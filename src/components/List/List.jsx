import React, {useState, useEffect, createRef} from "react";
import { Grid } from "@mui/material";   
import CodeDetails from "../CodeDetails/CodeDetails";
import { useParams } from 'react-router-dom';
import 'react-h5-audio-player/lib/styles.css';
import andalucia from '../../data/postal_codes.json'
import words from '../../data/words.json'

function filterMap(word){
  let result = words.filter((w) => w.word === word)[0];
  var filteredMap = andalucia.features.filter((feature) => {
    for(var i=0; i<result.distribution.length; i++){
      let pc = result.distribution[i].postalcode;
      if(feature.properties.name === pc){
        feature.properties["variation"] = result.distribution[i].variation
        feature.properties["audioURL"] = result.distribution[i].audioURL
        feature.properties["comment"] = result.distribution[i].comment
        return feature
      }
    }
  })
  return filteredMap;
}


const List = ( {postalCodeClicked}) => {  
  let { word } = useParams();
  let { mapstyle } = useParams();
  const [elRefs, setElRefs] = useState([]);

  andalucia.features = filterMap(word);
  const places = andalucia.features;

  useEffect(()=>{
    const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places])


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