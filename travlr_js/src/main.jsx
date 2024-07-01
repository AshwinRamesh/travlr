import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import travlrTheme from "./TravlrTheme.jsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={travlrTheme}>
    <CssBaseline />
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App/>
      </LocalizationProvider>
    </React.StrictMode>,
  </ThemeProvider>
)
