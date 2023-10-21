import React, { useState } from "react";
import { Box, Grid, Card, CardContent} from "@mui/material";   
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const CheckboxList = ({items}) => {
  

  return (
    <>
      <Paper sx={{marginTop:'20px'}}>
        
        <Grid container direction="row" sx={{overflow: 'auto'}} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center">
            {items.map((item, index) => {
                return (
                    <Link to={item}>
                    <Card key={item} sx={{width:'200px', margin:'10px'}}>
                        <CardContent>
                            <Box display="flex" justifyContent={"space-between"}>
                            <Typography variation="Title">{item}</Typography>
                            </Box>
                        </CardContent>
                        </Card>
                    </Link>
                )
            })
            }
        </Grid>
      </Paper>
    </>
  );
}

export default CheckboxList;