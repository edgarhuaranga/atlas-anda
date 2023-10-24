import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, useParams, } from "react-router-dom";
import { CssBaseline, Grid, Typography, Card, CardContent } from "@mui/material";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import PhenoMap from './components/PhenoMap/PhenoMap';
import andalucia from './components/Map/andalucia.json';
import phenomenos from './files/phenomenoms.json';
import Home from './components/Home/Home';

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}


function WordMap() {
  let { word } = useParams();
  const [childClicked, setChildClicked] = useState(null);
  console.log(andalucia);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <Map polygons={andalucia.features} data={andalucia} word={word} setChildClicked={setChildClicked}/>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <Card elevation={2}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography>
              <Typography variant="h5" component="div">
                {word}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
          </Card> */}
          <List places={andalucia.features} word={word} childClicked={childClicked}/>
        </Grid>


      </Grid>

    </>
  );
}

function FMap(){
  let { word } = useParams();
  const [childClicked, setChildClicked] = useState(null);
  console.log(word);
  const result = phenomenos.filter((w) => w.key === word)[0];
  
  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <PhenoMap polygons={andalucia.features} data={andalucia} word={word} setChildClicked={setChildClicked}/>
        </Grid>
        <Grid item xs={12} md={4}>

          {/* <Card elevation={2}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography>
              <Typography variant="h5" component="div">
                {result.word}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
          </Card> */}
          {<List places={andalucia.features} word={word} childClicked={childClicked}/>}
        </Grid>

      </Grid>

    </>
  );
}


const App = () => {

  const finalData = getMultipleRandom(andalucia.features, 500);
  andalucia.features = finalData;

  return (
    <Router>
      <Routes>
        <Route path="/atlas-anda/palabra/:word" element={<WordMap />} />
        <Route path="/atlas-anda/fenomeno/:word" element={<FMap />} />
        <Route path="/atlas-anda/" element={<Home />} />
      </Routes>
    </Router>
  );


}

export default App;