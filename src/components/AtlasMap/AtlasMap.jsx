import React, { useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';

import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, Tooltip, useMapEvents, Marker, TileLayer } from 'react-leaflet'
import andalucia from '../../data/postal_codes.json'
import { Box, Typography, Card, CardContent } from "@mui/material";
import spania from '../../files/basemap.json'
import words from '../../data/words.json'
import phenomenos from '../../data/phenomenoms.json'
import * as turf from '@turf/turf'
import L from "leaflet";
import styles from "./styles.module.css";

const svgIcon = L.divIcon({
  html: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="5" cy="5" r="4.5" fill="#D9D9D9" stroke="black"/>
  </svg>
  `,
  className: "svg-icon",
  iconSize: [10, 10],
  iconAnchor: [10, 10]
});

function filterMap(word, mapstyle) {

  let result = words.filter((w) => w.word === word)[0];
  if (mapstyle === "fenomeno") {
    result = phenomenos.filter((w) => w.key === word)[0];
  }

  var filteredMap = andalucia.features.filter((feature) => {
    for (var i = 0; i < result.distribution.length; i++) {
      let pc = result.distribution[i].postalcode;
      if (feature.properties.name === pc) {
        feature.properties["variation"] = result.distribution[i].variation
        feature.properties["audioURL"] = result.distribution[i].audioURL
        feature.properties["comment"] = result.distribution[i].comment
        feature.properties["category"] = result.distribution[i].category
        let cat = result.distribution[i].category;
        feature.properties["color"] = result.variations.filter((c) => c.type === cat)[0].color
        return feature
      }
    }
  })
  console.log(filteredMap);
  return filteredMap;
}

function Leyenda(titulo, mapstyle) {

  let legend = andalucia.features.map((object) => {
    return { "color": object.properties.color, "label": object.properties.category }
  })

  const uniqueIds = [];
  const unique = legend.filter(element => {
    const isDuplicate = uniqueIds.includes(element.label);
    if (!isDuplicate) {
      uniqueIds.push(element.label);
      return true;
    }
    return false;
  });


  var table = <></>

  if (mapstyle === "fenomeno") {
    table = <table>
      {
        unique?.map((item, key) => {
          return (
            <tr key={key}>
              <td style={{ backgroundColor: item.color }}>&nbsp;</td>
              <td>{item.label}</td>
            </tr>
          )

        }
        )}
    </table>
  }





  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h1">{titulo}</Typography>
        {table}
      </CardContent>
    </Card>
  )
}

function MyComponent() {
  let { word } = useParams();
  let {mapstyle} = useParams();
  const map = useMapEvents({
    click: () => {
      //console.log('map center:', map.getCenter())
    }
  });
  var bbox = turf.bbox({
    type: 'FeatureCollection',
    features: spania.features
  });
  map.setMaxBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]])

  var legend = L.control({ position: 'topright' });
  try {
    var legends = document.getElementsByClassName(styles.legend);
    if (legends.length == 0) {
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', styles.legend);
        div.innerHTML = ReactDOMServer.renderToString(Leyenda(word, mapstyle));
        return div;
      };
      legend.addTo(map);
    }
  } catch (error) {
    console.log(error)
  }

  return null
}



const Map = ({ polygons, data, setPostalCodeClicked }) => {

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
  let { word } = useParams();
  let { mapstyle } = useParams();

  const finalData = filterMap(word, mapstyle);
  andalucia.features = finalData;

  if (mapstyle === "palabra") {
    var secondLayer =
      <>
        <GeoJSON
          onEachFeature={(feature, layer) => {
            layer.options.fillColor = "#006E39"
            layer.options.color = "black"
            layer.options.fillOpacity = 0.8
            layer.options.weight = 1
            layer.options.dashArray = 1
            layer.options.opacity = 1

            layer.on({
              click: (event) => {
                const districtName = event.target.feature.properties.comunidad
                console.log(districtName + " - " + layer.feature.properties.lugar);
                setPostalCodeClicked(layer);
              }
            })


            let popupContent = feature.properties.variation
            let tooltipOptions = { permanent: true, opacity: 0.75, className: styles.leaflet_tooltip }
            layer.bindTooltip(popupContent, tooltipOptions);


          }}
          key={1} data={JSON.parse(JSON.stringify(andalucia))} style={{ weight: 1 }} />

      </>
  }

  else if (mapstyle === "fenomeno") {

    secondLayer = <GeoJSON
      onEachFeature={(feature, layer) => {
        layer.options.fillColor = feature.properties.color
        layer.options.color = "black"
        layer.options.fillOpacity = 0.5
        layer.options.weight = 1
        layer.options.dashArray = 1
        layer.options.opacity = 1

        layer.on({
          click: (event) => {
            const districtName = event.target.feature.properties.comunidad
            console.log(districtName + " - " + layer.feature.properties.lugar);
            setPostalCodeClicked(layer);
          }
        })

      }}
      key={1} data={JSON.parse(JSON.stringify(andalucia))} style={{ weight: 1 }} />

  }


  return (
    <>
      <MapContainer id={'map'} center={[37.96721, -4.92092]} minZoom={7} maxZoom={15} zoom={8} scrollWheelZoom={true} sx={{ border: '5px blue solid' }} style={{ width: '100%', height: '85vh', marginTop: '10px' }}>
        <GeoJSON
          onEachFeature={(feature, layer) => {
            layer.options.fillColor = "#EFE9DD"
            layer.options.color = "black"
            layer.options.fillOpacity = 0.5
            layer.options.weight = 3
            layer.options.dashArray = 1
            layer.options.opacity = 1
          }} key={2} data={JSON.parse(JSON.stringify(spania))} />

        {secondLayer}

        <MyComponent />

      </MapContainer>
    </>
  )
};

export default Map;