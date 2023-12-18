import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip} from "@mui/material"; 
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';


const CodeDetails = ({place, selected, refProp}) => {

  let backgroundcolorSelected = '#8f8c74';
  let backgroundcolorStandar = '#fafafa';
  if(selected){
    console.log(place);
    console.log(refProp); 
    refProp?.current?.scrollIntoView({behavior: "smooth", block:"start"})
  } 

  return(
    <Card elevation={2}>
      <CardContent sx={{backgroundColor: selected? backgroundcolorSelected: backgroundcolorStandar}}>
        <Typography gutterBottom variant="h5">{place.lugar}</Typography>
        <Box display="flex" justifyContent={"space-between"}>
          <Typography variant="subtitle1">Código postal: </Typography>
          <Typography gutterBottom variant="subtitle1" sx={{fontWeight: 'bold'}}>{place.name}</Typography>  
        </Box>
        <Box display="flex" justifyContent={"space-between"}>
          <AudioPlayer src="/atlas-anda/Probando.mp3" onPlay={e => console.log("onPlay")}
          />  
        </Box>
        <br />
        <Typography variant="body2" display="block" gutterBottom>
         This is a description of the word.
        </Typography>
      </CardContent>
    </Card>
  )
};

export default CodeDetails;