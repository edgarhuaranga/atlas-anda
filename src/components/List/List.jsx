import React, {useRef, useState, useEffect, createRef} from "react";
import { Grid } from "@mui/material";   
import CodeDetails from "../CodeDetails/CodeDetails";

import 'react-h5-audio-player/lib/styles.css';

const List = ({places, word, childClicked}) => {  

  const [elRefs, setElRefs] = useState([]);
  
  console.log("============");
  console.log(childClicked);
  console.log("============");

  useEffect(()=>{
    const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places])

  
  return(
      <div sx={{padding: '25px'}}>
        <Grid container spacing={3} sx={{height: '85vh', overflow: 'auto', marginTop:'10px'}}>
          {places?.map((place, i) => (
            <Grid ref={elRefs[i]} item key={i} xs={12}>
              <CodeDetails place={place.properties} selected={childClicked?.feature.properties.name === place.properties.name} refProp={elRefs[i]}/>
            </Grid>
          ))}
        </Grid>
      </div>
  )
};

export default List;