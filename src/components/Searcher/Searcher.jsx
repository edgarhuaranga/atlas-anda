import React, { useState } from "react";
import {Grid, Card, CardContent} from "@mui/material";   
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

function WordContent(type, item){
  return (
    <Link to={type+"/"+item}>
      <Card key={item} sx={{margin:'15px'}}>
        <CardContent>
          <Typography variation="Title">{item}</Typography>
        </CardContent>
      </Card>
    </Link>
)
}

function PhenomenomContent(type, item){
  return (
    <Link to={type+"/"+item.k}>
      <Card key={item} sx={{margin:'15px'}}>
        <CardContent>
          <Typography variation="Title">{item.w}</Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

const CheckboxList = ({items, type}) => {
  
  return (
    <>
      <Paper sx={{marginTop:'20px'}}>
        <Grid container direction="row" sx={{overflow: 'auto'}} columns={{ xs: 2, sm: 8, md: 12, lg:16 }} justifyContent="center">
            { items.map((item, index) => {
                  if(type === 'palabra') return WordContent(type, item);
                  else return PhenomenomContent(type, item);
                }
              )
            }
        </Grid>
      </Paper>
    </>
  );
}

export default CheckboxList;