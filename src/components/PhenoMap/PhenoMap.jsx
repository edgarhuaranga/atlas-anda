import React, {useState, useRef} from "react";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer, Tooltip, useMap, useMapEvents, Marker, Popup, Pane } from 'react-leaflet'
import andalucia from '../Map/andalucia.json'
import phenomenos from '../../files/phenomenoms.json'
import spania from '../../files/basemap.json'
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


const Map = ({polygons, data, word, setChildClicked}) => {
  
  const result = phenomenos.filter((w) => w.key === word)[0];

  return(
    <>
    <MapContainer id={'map'} center={[37.96721, -4.92092]} zoom={8} scrollWheelZoom={false} sx={{border:'5px blue solid'}} style={ {width:'100%', height:'85vh', marginTop:'10px'}}>
      
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
      
      <GeoJSON onEachFeature={(feature, layer) => {
        layer.options.color = "#252E24"
        layer.options.fillOpacity = 0.8
        layer.options.weight = 1
        layer.options.dashArray = 1
        layer.options.opacity = 0.1
      
        layer.bindPopup(feature.properties.name);
        
        layer.on({
          mouseover: (event) =>{
            event.target.bringToFront()
            event.target.setStyle({
              color: "#c8d0d4",
              weight: 1
            });
          },
          mouseout: (event)=> {
            event.target.bringToBack()
            event.target.setStyle({
              color: "#252E24",
              weight: 1
            });
          },
          click: (event) => {
            const districtName = event.target.feature.properties.comunidad
            console.log(districtName);
            console.log(layer.feature);
            setChildClicked(layer);
          }
        })
        
      }} key={1} data={JSON.parse(JSON.stringify(andalucia))} style={{weight:10}}/>
      {/* <MyComponent /> */}
      </MapContainer>
    </>
  )
};

export default Map;