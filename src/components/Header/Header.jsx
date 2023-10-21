  import React from "react";
  import { AppBar,Toolbar, Typography, Box } from "@mui/material"; 
  import InfoIcon from '@mui/icons-material/Info';

  const Header = () => {
    
    return(
        <AppBar position="static">
            <Toolbar  sx={{display:"flex", justifyContent: 'space-between', width:'100%'}}>
                <Typography variant="h5">
                    Atlas Linguístico de Acentos de Andalucía
                </Typography>
                <Box sx={{display:'flex', flexDirection:'row'}}>
                    <InfoIcon/>
                </Box>
            </Toolbar>
        </AppBar>
    )
  };

  export default Header;