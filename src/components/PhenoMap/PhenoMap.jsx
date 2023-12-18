import React, {useState, useRef} from "react";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer, Tooltip, useMap, useMapEvents, Marker, Popup, Pane } from 'react-leaflet'
import andalucia from '../../data/andalucia.json'
import phenomenos from '../../files/phenomenoms.json'
import spania from '../../files/basemap.json'
import * as turf from '@turf/turf'
import L from "leaflet";
import styles from "./styles.module.css";

function MyComponent() {
    const map = useMapEvents({
      click: () => {
        console.log('map center:', map.getCenter())
      }
    })
    return null
}


const Map = ({polygons, data, word, setPostalCodeClicked}) => {
  
  const result = phenomenos.filter((w) => w.key === word)[0];
  const colors = ['#08519C', '#3182BD', '#6BAED6', '#9ECAE1', '#C6DBEF']

  return(
    <>
    <MapContainer id={'map'} center={[37.96721, -4.92092]} zoom={8} scrollWheelZoom={false} style={ {width:'100%', height:'85vh', marginTop:'10px'}}>
      {/* <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" /> */}
      <GeoJSON 
       onEachFeature={(feature, layer) => {
        layer.options.fillColor = "transparent"
        layer.options.color = "black"
        layer.options.fillOpacity = 0.8
        layer.options.weight = 1
        layer.options.dashArray = 1
        layer.options.opacity = 0.9
      
        }} key={2} data={JSON.parse(JSON.stringify(spania))}/> 
      
      <GeoJSON onEachFeature={(feature, layer) => {
        //layer.options.fillColor = "blue"
        layer.options.fillColor = colors[Math.floor(Math.random() * colors.length)]
        layer.options.color = "red"
        layer.options.fillOpacity = 0.8
        layer.options.weight = 1
        layer.options.dashArray = 1
        layer.options.opacity = 0.9
      
        layer.bindPopup(feature.properties.name);
        
        layer.on({
          click: (event) => {
            const districtName = event.target.feature.properties.comunidad
            console.log(districtName);
            console.log(layer.feature);
            setPostalCodeClicked(layer);
          }
        })
        
      }} key={1} data={JSON.parse(JSON.stringify(andalucia))}/>
      {/* <MyComponent /> */}
      </MapContainer>
    </>
  )
};

export default Map;