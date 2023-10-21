import React from "react";
import { useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import { CssBaseline, Grid, Typography } from "@mui/material";
import andalucia from './components/Map/andalucia.json'

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}


const Atlas = () => {

    const finalData = getMultipleRandom(andalucia.features, 200);
    andalucia.features = finalData;
    const params = useParams();

    console.log("======");
    console.log(params);
    console.log("======");
    return (
        <>
            <CssBaseline />
            <Header />
            <Grid container spacing={3} style={{ width: '100%'}}>
                <Grid item xs={12} md={6}>
                    <Map polygons={andalucia.features} data={andalucia}/>
                </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant="h5">Hola2</Typography>
                    <List places={andalucia.features} />
                </Grid>


            </Grid>

        </>
    );
}

export default Atlas;