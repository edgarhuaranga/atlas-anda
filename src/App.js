import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { CssBaseline, Grid, Typography } from "@mui/material";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import AtlasMap from './components/AtlasMap/AtlasMap';
import Home from './components/Home/Home';
import { getWordMap, getPhenomenonMap } from './api/client';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';
import RequireAuth from './components/Admin/RequireAuth';


function WordMap() {
  const { mapstyle, word } = useParams();
  const [postalCodeClicked, setPostalCodeClicked] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMapData(null);
    setError(null);
    setPostalCodeClicked(null);
    const fetchMap = mapstyle === "fenomeno" ? getPhenomenonMap(word) : getWordMap(word);
    fetchMap.then(setMapData).catch(() => setError(true));
  }, [mapstyle, word]);

  return (
    <>
      <CssBaseline />
      <Header />
      {error && <Typography sx={{ padding: 2 }}>No se encontró "{word}".</Typography>}
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <AtlasMap mapstyle={mapstyle} mapData={mapData} setPostalCodeClicked={setPostalCodeClicked}/>
        </Grid>
        <Grid item xs={12} md={4}>
          <List features={mapData?.features} postalCodeClicked={postalCodeClicked}/>
        </Grid>
      </Grid>

    </>
  );
}


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin" element={<RequireAuth><AdminDashboard/></RequireAuth>} />
        <Route path="/:mapstyle/:word" element={<WordMap/>} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );

}

export default App;
