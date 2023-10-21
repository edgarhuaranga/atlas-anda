import React from "react";
import { Grid } from "@mui/material";   
import CodeDetails from "../CodeDetails/CodeDetails";

import 'react-h5-audio-player/lib/styles.css';

const List = ({places, word}) => {  

  return(
      <div sx={{padding: '25px'}}>
        <Grid container spacing={3} sx={{height: '85vh', overflow: 'auto', marginTop:'10px'}}>
          {places?.map((place, i) => (
            <Grid item key={i} xs={12}>
              <CodeDetails place={place.properties}/>
            </Grid>
          ))}
        </Grid>
      </div>
  )
};

export default List;