import React from "react";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const Hero = () => {
  
  return(
    <Paper
    sx={{
      position: 'relative',
      borderRadius: 0,
      color: '#fff',
      mb: 4,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url(/mask-hero.svg)`,
    }}
    >
    <Box/>
    <Grid container>
      <Grid item md={6}>
        <Box sx={{ position: 'relative', p: { xs: 3, md: 6 }, pr: { md: 0 }, }}>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Atlas Lingüístico Interactivo de los Acentos de Andalucía
          </Typography>
          <Stack spacing={1} direction="row">
            <Link to="/">
                <Button color="secondary" variant="outlined" size="large">Ir al inicio</Button>
            </Link>
        </Stack>
        </Box>
      </Grid>
    </Grid>
  </Paper> 
  )
};

export default Hero;