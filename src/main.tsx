import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, responsiveFontSizes } from '@mui/material';
import theme from './theme/theme';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)