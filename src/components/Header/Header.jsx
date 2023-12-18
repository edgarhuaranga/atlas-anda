  import React from "react";
  import { Link } from "react-router-dom";

  import { AppBar,Toolbar, Typography, Box, IconButton } from "@mui/material"; 

  import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';


  const Header = () => {
    
    return(
        <AppBar position="static">
            <Toolbar  sx={{display:"flex", justifyContent: 'space-between', width:'100%'}}>
                <Typography variant="h5">
                Atlas Lingüístico Interactivo de los Acentos de Andalucía
                </Typography>
                <Box sx={{display:'flex', flexDirection:'row'}}>
                    
                    <Link to="/" sx={{color:'white'}}>
                        <HomeOutlinedIcon sx={{color:'white'}}/>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    )
  };

  export default Header;