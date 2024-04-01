// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

import theme from './theme'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider>
      <CssBaseline />
      <App />
      <ToastContainer />
    </ConfirmProvider>
  </CssVarsProvider>
  /* </React.StrictMode> */
)
