import React from "react";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { LocationOnOutlined } from "@mui/icons-material";  
import { GeoJSON, MapContainer, TileLayer, Tooltip, useMap, useMapEvents, Marker, Popup, Pane } from 'react-leaflet'
import andalucia from '../../data/andalucia.json'
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

function MyComponent() {
  const map = useMapEvents({
    click: () => {
      console.log('map center:', map.getCenter())
    }
  })
  return null
}


const Map = ({polygons, data, word, setPostalCodeClicked}) => {

  const result = words.filter((w) => w.word === word)[0];
  console.log(result);

  const bounds = [
    [-9.380169, 35.832815],
    [-0.242498, 38.386313],
    ] 

  return(
    <>
    {/* <Typography variant="h4">Mapa</Typography> */}
    <MapContainer id={'map'} center={[37.96721, -4.92092]} minZoom={7} maxZoom={15} zoom={8} scrollWheelZoom={false} sx={{border:'5px blue solid'}} style={ {width:'100%', height:'85vh', marginTop:'10px'}}>
    {/* <MapContainer id={'map'} center={[37.96721, -4.92092]} minZoom={7} maxZoom={15} zoom={8} scrollWheelZoom={false} sx={{border:'5px blue solid'}} style={ {width:'100%', height:'85vh', marginTop:'10px'}}> */}
      {/* <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" /> */}
      <GeoJSON 
       onEachFeature={(feature, layer) => {
        layer.options.fillColor = "transparent"
        layer.options.color = "black"
        layer.options.fillOpacity = 0.8
        layer.options.weight = 3
        layer.options.dashArray = 1
        layer.options.opacity = 0.9
      
        }} key={2} data={JSON.parse(JSON.stringify(spania))}/> 

      <GeoJSON 
        onEachFeature={(feature, layer) => {
          layer.options.fillColor = "blue"
          layer.options.color = "red"
          layer.options.fillOpacity = 0.8
          layer.options.weight = 2
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

        }}
        key={1} data={JSON.parse(JSON.stringify(andalucia))} style={{weight:1}}/>

      

      {polygons?.map((feature, i) => {  
          return  <Marker key={i} icon={svgIcon} position={[turf.center(feature.geometry).geometry.coordinates[1] , turf.center(feature.geometry).geometry.coordinates[0]]}>
                    <Tooltip permanent className={styles.leaflet_tooltip}>
                      {result.variations[i%10]}
                    </Tooltip >
                  </Marker>  
        } 
        )}
        <MyComponent />
      </MapContainer>
    </>
  )
};

export default Map;