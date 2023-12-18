import React from "react";
import {Grid, Card, CardContent} from "@mui/material";   
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

function WordContent(type, item){
  return (
      <Link to={type+"/"+item} style={{textDecoration: 'none'}}>  
        <Card key={item} sx={{margin:'10px', minWidth:'100px', maxWidth:'200px'}} variant="outlined">
          <CardContent sx={{display:'flex', justifyContent:'center', color:'#006E39', paddingBottom:'16px!important'}}>
              <Typography variant="h6">{item}</Typography>
          </CardContent>
        </Card>
      </Link>
  )
}

function PhenomenomContent(type, item){
  return (
    <Link to={type+"/"+item.k} style={{textDecoration: 'none'}}>  
        <Card key={item} sx={{margin:'10px', minWidth:'100px', maxWidth:'200px'}} variant="outlined">
          <CardContent sx={{display:'flex', justifyContent:'center', color:'#006E39', paddingBottom:'16px!important'}}>
              <Typography variant="h6">{item.w}</Typography>
          </CardContent>
        </Card>
      </Link>
  )
}

const CheckboxList = ({items, type}) => {
  
  return (
    <>
      <Grid 
        container direction="row" 
        sx={{overflow: 'auto'}} 
        columns={{ xs: 2, sm: 8, md: 12, lg:16 }} 
        justifyContent="center">
            { 
              items.map((item, index) => {
                  if(type === 'palabra') return WordContent(type, item);
                  else return PhenomenomContent(type, item);
                }
              )
            }
      </Grid>
    </>
  );
}

export default CheckboxList;