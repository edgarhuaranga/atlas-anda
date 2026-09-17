import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server';

import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import { Typography, Card, CardContent, Fab, Menu, MenuItem } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import spania from '../../files/basemap.json'
import * as turf from '@turf/turf'
import L from "leaflet";
import styles from "./styles.module.css";

// Below this zoom level, showing a permanently-open tooltip on every one of the
// (sometimes 500+) postal-code polygons at once makes zoom/pan visibly laggy —
// Leaflet has to reposition every tooltip DOM node on every animation frame.
// Tooltips only open once the user has zoomed in past this point.
const TOOLTIP_MIN_ZOOM = 10;
// Past this zoom, few enough polygons are on screen that larger labels stay readable.
const TOOLTIP_LARGE_ZOOM = 12;

function Leyenda(titulo, categories) {
  var table = <></>

  if (categories && categories.length) {
    table = <table style={{fontSize:18, margin:5}}>
      {categories.map((item, key) => (
        <tr key={key} style={{height:20}}>
          <td style={{ backgroundColor: item.color, width:29, borderRadius:14 }}>&nbsp;</td>
          <td>{item.type}</td>
        </tr>
      ))}
    </table>
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h1" sx={{mb:0}}>{titulo}</Typography>
        {table}
      </CardContent>
    </Card>
  )
}

function MapBehavior({ titulo, categories, geoJsonRef, showTooltips, legendRef }) {
  const map = useMap();

  useEffect(() => {
    const bbox = turf.bbox({ type: 'FeatureCollection', features: spania.features });
    map.setMaxBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
  }, [map]);

  useEffect(() => {
    const legend = L.control({ position: 'topright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', styles.legend);
      div.innerHTML = ReactDOMServer.renderToString(Leyenda(titulo, categories));
      legendRef.current = div;
      return div;
    };
    legend.addTo(map);
    return () => { legend.remove(); legendRef.current = null; };
  }, [map, titulo, categories, legendRef]);

  useEffect(() => {
    if (!showTooltips) return;

    const updateTooltips = () => {
      const zoom = map.getZoom();
      const open = zoom >= TOOLTIP_MIN_ZOOM;
      const large = zoom >= TOOLTIP_LARGE_ZOOM;
      geoJsonRef.current?.eachLayer((layer) => {
        if (open) layer.openTooltip();
        else layer.closeTooltip();
        const el = layer.getTooltip()?.getElement();
        if (el) el.classList.toggle(styles.leaflet_tooltip_large, large);
      });
    };

    updateTooltips();
    map.on('zoomend', updateTooltips);
    return () => map.off('zoomend', updateTooltips);
  }, [map, geoJsonRef, showTooltips, titulo]);

  return null;
}

function timestamp() {
  return new Date().toLocaleString('es-ES');
}

async function addImageToPdf(pdf, canvas, x, y, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, w, h);
  return h;
}

function addCommentText(pdf, comment, x, y, width) {
  if (!comment) return y;
  pdf.setFontSize(10);
  const lines = pdf.splitTextToSize(comment, width);
  pdf.text(lines, x, y);
  return y + lines.length * 12;
}

async function exportPdf({ mode, mapElement, legendElement, comment, titulo }) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;

  pdf.setFontSize(14);
  pdf.text(titulo || 'Atlas', margin, margin);

  const contentTop = margin + 16;
  const contentHeight = pageHeight - contentTop - margin - 16;

  if (mode === 'map') {
    const canvas = await html2canvas(mapElement, { useCORS: true, ignoreElements: (el) => el.classList?.contains(styles.legend) });
    await addImageToPdf(pdf, canvas, margin, contentTop, pageWidth - margin * 2, contentHeight);
  } else if (mode === 'legend') {
    const contentWidth = pageWidth - margin * 2;
    const legendCanvas = await html2canvas(legendElement, { useCORS: true });
    const legendHeight = await addImageToPdf(pdf, legendCanvas, margin, contentTop, contentWidth, contentHeight * 0.7);
    addCommentText(pdf, comment, margin, contentTop + legendHeight + 16, contentWidth);
  } else {
    // Map gets 3/4 of the width, legend + description share the remaining 1/4.
    const mapColumnWidth = (pageWidth - margin * 3) * 0.75;
    const sideColumnWidth = (pageWidth - margin * 3) * 0.25;
    const sideColumnX = margin * 2 + mapColumnWidth;

    const mapCanvas = await html2canvas(mapElement, { useCORS: true, ignoreElements: (el) => el.classList?.contains(styles.legend) });
    const legendCanvas = await html2canvas(legendElement, { useCORS: true });

    await addImageToPdf(pdf, mapCanvas, margin, contentTop, mapColumnWidth, contentHeight);
    const legendHeight = await addImageToPdf(pdf, legendCanvas, sideColumnX, contentTop, sideColumnWidth, contentHeight * 0.5);
    addCommentText(pdf, comment, sideColumnX, contentTop + legendHeight + 16, sideColumnWidth);
  }

  pdf.setFontSize(9);
  pdf.text(`Exportado: ${timestamp()}`, margin, pageHeight - margin / 2);

  pdf.save(`${(titulo || 'atlas').replace(/[^\w-]+/g, '_')}.pdf`);
}

function ExportButton({ mapContainerRef, legendRef, comment, titulo }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExport = async (mode) => {
    setAnchorEl(null);
    if (!mapContainerRef.current) return;
    await exportPdf({ mode, mapElement: mapContainerRef.current, legendElement: legendRef.current, comment, titulo });
  };

  return (
    <>
      <Fab
        size="small"
        color="primary"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000 }}
        title="Exportar a PDF"
      >
        <FileDownloadIcon />
      </Fab>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleExport('both')}>Mapa (3/4) y leyenda con descripción (1/4)</MenuItem>
        <MenuItem onClick={() => handleExport('map')}>Solo el mapa</MenuItem>
        <MenuItem onClick={() => handleExport('legend')}>Solo la leyenda y descripción</MenuItem>
      </Menu>
    </>
  );
}

const AtlasMap = ({ mapstyle, mapData, setPostalCodeClicked }) => {
  const geoJsonRef = useRef(null);
  const legendRef = useRef(null);
  const mapContainerRef = useRef(null);

  if (!mapData) return null;

  const { features } = mapData;
  const titulo = mapstyle === "fenomeno" ? mapData.label : mapData.word;
  const categories = mapstyle === "fenomeno" ? mapData.categories : null;
  const showTooltips = mapstyle === "palabra";
  const generalComment = mapstyle === "fenomeno" ? mapData.comment : null;

  let secondLayer = null;
  if (features && features.length > 0) {
    secondLayer = (
      <GeoJSON
        ref={geoJsonRef}
        key={`${mapstyle}-${titulo}`}
        data={{ type: 'FeatureCollection', features }}
        onEachFeature={(feature, layer) => {
          layer.options.fillColor = mapstyle === "fenomeno" ? feature.properties.color : "#006E39"
          layer.options.color = "black"
          layer.options.fillOpacity = mapstyle === "fenomeno" ? 0.5 : 0.8
          layer.options.weight = 1
          layer.options.opacity = 1

          layer.on({
            click: () => {
              setPostalCodeClicked(layer);
            }
          })

          if (showTooltips) {
            layer.bindTooltip(feature.properties.variation, { permanent: false, opacity: 0.75, className: styles.leaflet_tooltip })
          }
        }}
        style={{ weight: 1 }}
      />
    )
  }

  return (
    <>
      {(!features || features.length === 0) && (
        <Typography sx={{ padding: 2 }}>Todavía no hay datos registrados para "{titulo}".</Typography>
      )}
      <div ref={mapContainerRef} style={{ position: 'relative' }}>
        <MapContainer id={'map'} center={[37.96721, -4.92092]} minZoom={5} maxZoom={15} zoom={8} scrollWheelZoom={true} preferCanvas={true} style={{ width: '100%', height: '85vh', marginTop: '10px' }}>
          <GeoJSON
            onEachFeature={(feature, layer) => {
              layer.options.fillColor = "#EFE9DD"
              layer.options.color = "black"
              layer.options.fillOpacity = 0.5
              layer.options.weight = 2
              layer.options.opacity = 1
            }} data={JSON.parse(JSON.stringify(spania))} />

          {secondLayer}

          <MapBehavior titulo={titulo} categories={categories} geoJsonRef={geoJsonRef} showTooltips={showTooltips} legendRef={legendRef} />

        </MapContainer>
        <ExportButton mapContainerRef={mapContainerRef} legendRef={legendRef} comment={generalComment} titulo={titulo} />
      </div>

      {generalComment && (
        <Card elevation={1} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="body2">{generalComment}</Typography>
          </CardContent>
        </Card>
      )}
    </>
  )
};

export default AtlasMap;
