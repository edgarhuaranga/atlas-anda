import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip} from "@mui/material"; 
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
//https://www.npmjs.com/package/react-h5-audio-player


const CodeDetails = ({place}) => {
  return(
    <Card elevation={2}>
      <CardContent>
        <Typography gutterBottom variant="h5">{place.lugar}</Typography>
        <Box display="flex" justifyContent={"space-between"}>
          <Typography variant="subtitle1">Código postal: </Typography>
          <Typography gutterBottom variant="subtitle1" sx={{fontWeight: 'bold'}}>{place.name}</Typography>  
        </Box>
        <Box display="flex" justifyContent={"space-between"}>
          <AudioPlayer src="/atlas-anda/Probando.mp3" onPlay={e => console.log("onPlay")}
          />  
        </Box>
      </CardContent>
    </Card>
  )
};

export default CodeDetails;