import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material";

import App from './App'

const theme = createTheme(
  {
    palette:{
      "primary": {
        "main": "#006E39",
        "contrastText": "#fff"
      },
      "secondary": {
        "main": "#fff",
        "contrastText": "#fff"
      },
    },
    typography:{
      fontFamily: [
        'Rokkitt',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    }
  }
)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

