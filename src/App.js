import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams, } from "react-router-dom";
import { CssBaseline, Grid, Typography, Card, CardContent } from "@mui/material";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import andalucia from './components/Map/andalucia.json'
import Home from './components/Home/Home';

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}


function WordMap() {
  let { word } = useParams();
  console.log(andalucia);
  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <Map polygons={andalucia.features} data={andalucia} word={word} />
        </Grid>
        <Grid item xs={12} md={4}>

          <Card elevation={2}>
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
          </Card>
          <List places={andalucia.features} word={word} />
        </Grid>


      </Grid>

    </>
  );
}



const App = () => {

  const finalData = getMultipleRandom(andalucia.features, 200);
  andalucia.features = finalData;

  return (
    <Router>
      <Routes>
        <Route path="/atlas-anda/:word" element={<WordMap />} />
        <Route path="/atlas-anda/" element={<Home />} />
      </Routes>
    </Router>
  );


}

export default App;