import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, useParams, } from "react-router-dom";
import { CssBaseline, Grid } from "@mui/material";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import PhenoMap from './components/PhenoMap/PhenoMap';
import AtlasMap from './components/AtlasMap/AtlasMap';
import andalucia from './data/andalucia.json';
import Home from './components/Home/Home';


function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}


function WordMap() {
  let { word } = useParams();
  const [postalCodeClicked, setPostalCodeClicked] = useState(null);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <AtlasMap polygons={andalucia.features} data={andalucia} word={word} setPostalCodeClicked={setPostalCodeClicked}/>
        </Grid>
        <Grid item xs={12} md={4}>
          <List places={andalucia.features} word={word} postalCodeClicked={postalCodeClicked}/>
        </Grid>
      </Grid>

    </>
  );
}

function FMap(){
  let { word } = useParams();
  const [postalCodeClicked, setPostalCodeClicked] = useState(null);
  
  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <PhenoMap polygons={andalucia.features} data={andalucia} word={word} setPostalCodeClicked={setPostalCodeClicked}/>
        </Grid>
        <Grid item xs={12} md={4}>
          <List places={andalucia.features} word={word} postalCodeClicked={postalCodeClicked}/>
        </Grid>

      </Grid>

    </>
  );
}

const App = () => {

  const finalData = getMultipleRandom(andalucia.features, 250);
  andalucia.features = finalData;

  return (
    <Router>
      <Routes>
        <Route path="/palabra/:word" element={<WordMap/>} />
        <Route path="/fenomeno/:word" element={<FMap/>} />
        <Route path="/" element={<Home />} />
        <Route path="/atlas-anda/palabra/:word" element={<WordMap/>} />
        <Route path="/atlas-anda/fenomeno/:word" element={<FMap/>} />
        <Route path="/atlas-anda/" element={<Home/>} />
      </Routes>
    </Router>
  );

}

export default App;