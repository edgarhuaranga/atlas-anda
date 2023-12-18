import React, {useState} from "react";
import ReactDOMServer from 'react-dom/server';
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, Tooltip, useMapEvents, Marker, TileLayer } from 'react-leaflet'
import andalucia from '../../data/andalucia.json'
import {Box, Typography, Card, CardContent} from "@mui/material"; 
import spania from '../../files/basemap.json'
import words from './words.json'
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

function Leyenda(titulo) {
    return(
        <Card elevation={2}>
            <CardContent>
                <Typography variant="h1">{titulo}</Typography>
            </CardContent>
        </Card>        
    )
}

function MyComponent({word}) {

  const map = useMapEvents({
    click: () => {
      //console.log('map center:', map.getCenter())
    }
  });
  var bbox = turf.bbox({
    type: 'FeatureCollection',
    features: spania.features
  });
  map.setMaxBounds([[bbox[1], bbox[0]],[bbox[3], bbox[2]]])

    var legend = L.control({position: 'topright'});
    try{
        var legends = document.getElementsByClassName(styles.legend);
        console.log("aqui estamos")
        console.log(legends);
        if(legends.length == 0){
            console.log("aqui estamos 2")
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', styles.legend);
                console.log(word.word)
                div.innerHTML = ReactDOMServer.renderToString(Leyenda(word.word));
                return div;
            };
            legend.addTo(map);    
        }
    } catch(error){
        console.log(error)
    }
    

    
    return null
}


const Map = ({polygons, data, word, setPostalCodeClicked}) => {
  const [mapa, setMapa] = useState(null);
  const result = words.filter((w) => w.word === word)[0];
  console.log(result);
  console.log("=========")
  console.log(mapa)

  return(
    <>
    <MapContainer id={'map'} center={[37.96721, -4.92092]} minZoom={7} maxZoom={15} zoom={8} whenCreated={setMapa} scrollWheelZoom={true} sx={{border:'5px blue solid'}} style={ {width:'100%', height:'85vh', marginTop:'10px'}}>
      <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
      {/* <TileLayer url="http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png" />
      <TileLayer url="http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png" /> */}
      <GeoJSON 
       onEachFeature={(feature, layer) => {
        layer.options.fillColor = "#EFE9DD"
        layer.options.color = "black"
        layer.options.fillOpacity = 0.5
        layer.options.weight = 3
        layer.options.dashArray = 1
        layer.options.opacity = 0.9
      
        }} key={2} data={JSON.parse(JSON.stringify(spania))}/> 

      <GeoJSON 
        onEachFeature={(feature, layer) => {
          layer.options.fillColor = "#006E39"
          layer.options.color = "black"
          layer.options.fillOpacity = 0.5
          layer.options.weight = 1
          layer.options.dashArray = 1
          layer.options.opacity = 1
          
          layer.on({
            click: (event) => {
              const districtName = event.target.feature.properties.comunidad
              console.log(districtName);
              console.log(layer.feature);
              setPostalCodeClicked(layer);
            }
          })

          let popupContent = result.variations[1]

          let tooltipOptions = {
            permanent: true,
            opacity: 0.75,
            className: styles.leaflet_tooltip
          }

          layer.bindTooltip(popupContent, tooltipOptions);

        }}
        key={1} data={JSON.parse(JSON.stringify(andalucia))} style={{weight:1}}/>


      {/* {polygons?.map((feature, i) => {  
          return  <Marker key={i} icon={svgIcon} position={[turf.center(feature.geometry).geometry.coordinates[1] , turf.center(feature.geometry).geometry.coordinates[0]]}>
                  </Marker>  
        } 
        )} */}
        <MyComponent word={result}/>
        
      </MapContainer>
    </>
  )
};

export default Map;