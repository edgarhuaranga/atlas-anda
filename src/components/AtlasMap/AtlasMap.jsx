import React, { useEffect } from "react";
import ReactDOMServer from 'react-dom/server';

import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import { Typography, Card, CardContent } from "@mui/material";
import spania from '../../files/basemap.json'
import * as turf from '@turf/turf'
import L from "leaflet";
import styles from "./styles.module.css";

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

function MapBehavior({ titulo, categories }) {
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
      return div;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map, titulo, categories]);

  return null;
}

const AtlasMap = ({ mapstyle, mapData, setPostalCodeClicked }) => {
  if (!mapData) return null;

  const { features } = mapData;
  const titulo = mapstyle === "fenomeno" ? mapData.label : mapData.word;
  const categories = mapstyle === "fenomeno" ? mapData.categories : null;

  let secondLayer = null;
  if (features && features.length > 0) {
    secondLayer = (
      <GeoJSON
        key={`${mapstyle}-${titulo}`}
        data={{ type: 'FeatureCollection', features }}
        onEachFeature={(feature, layer) => {
          layer.options.fillColor = mapstyle === "fenomeno" ? feature.properties.color : "#006E39"
          layer.options.color = "black"
          layer.options.fillOpacity = mapstyle === "fenomeno" ? 0.5 : 0.8
          layer.options.weight = 1
          layer.options.dashArray = 1
          layer.options.opacity = 1

          layer.on({
            click: () => {
              setPostalCodeClicked(layer);
            }
          })

          if (mapstyle === "palabra") {
            layer.bindTooltip(feature.properties.variation, { permanent: true, opacity: 0.75, className: styles.leaflet_tooltip })
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
      <MapContainer id={'map'} center={[37.96721, -4.92092]} minZoom={7} maxZoom={15} zoom={8} scrollWheelZoom={true} style={{ width: '100%', height: '85vh', marginTop: '10px' }}>
        <GeoJSON
          onEachFeature={(feature, layer) => {
            layer.options.fillColor = "#EFE9DD"
            layer.options.color = "black"
            layer.options.fillOpacity = 0.5
            layer.options.weight = 3
            layer.options.dashArray = 1
            layer.options.opacity = 1
          }} data={JSON.parse(JSON.stringify(spania))} />

        {secondLayer}

        <MapBehavior titulo={titulo} categories={categories} />

      </MapContainer>
    </>
  )
};

export default AtlasMap;
