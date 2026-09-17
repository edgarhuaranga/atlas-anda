import React from "react";
import { Box, Typography, Card, CardContent} from "@mui/material";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';


const CodeDetails = ({place, selected, refProp}) => {

  let backgroundcolorSelected = '#8f8c74';
  let backgroundcolorStandar = '#fafafa';
  if(selected){
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
        {place.audioUrl && (
          <Box display="flex" justifyContent={"space-between"}>
            <AudioPlayer src={place.audioUrl} />
          </Box>
        )}
        <br />
        <Typography variant="body2" display="block" gutterBottom>
         {place.comment}
        </Typography>
      </CardContent>
    </Card>
  )
};

export default CodeDetails;