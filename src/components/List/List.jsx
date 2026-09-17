import React, {useState, useEffect, createRef} from "react";
import { Grid, Typography } from "@mui/material";
import CodeDetails from "../CodeDetails/CodeDetails";
import 'react-h5-audio-player/lib/styles.css';

const List = ({ features, postalCodeClicked }) => {
  const [elRefs, setElRefs] = useState([]);
  const places = features || [];

  useEffect(()=>{
    const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places?.length])

  if (features === undefined) {
    return null;
  }

  if (places.length === 0) {
    return (
      <div sx={{padding: '25px'}}>
        <Typography sx={{ marginTop: '10px' }}>Todavía no hay datos registrados para esta entrada.</Typography>
      </div>
    );
  }

  return(
      <div sx={{padding: '25px'}}>
        <Grid container spacing={3} sx={{height: '85vh', overflow: 'auto', marginTop:'10px'}}>
          {places?.map((place, i) => (
            <Grid ref={elRefs[i]} item key={i} xs={12}>
              <CodeDetails place={place.properties} selected={postalCodeClicked?.feature.properties.name === place.properties.name} refProp={elRefs[i]}/>
            </Grid>
          ))}
        </Grid>
      </div>
  )
};

export default List;
