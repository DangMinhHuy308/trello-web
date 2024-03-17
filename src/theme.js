import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { teal, deepOrange, cyan, orange } from '@mui/material/colors'
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides:{
        body:{
          '':{
            '*::--webkit-scrollbar':{
              width: '8px',
              height: '8px'
            },
            '*::--webkit-scrollbar-thumb':{
              backgroundColor: '#dcdde1',
              borderRadius: '8px'
            },
            '*::--webkit-scrollbar-thumb:hover':{
              backgroundColor: 'white'
            }
          }
        }
      }
    },
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'none',
          border: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root: {
          '& fieldset':{
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset':{
            borderWidth: '1px !important'
          },
          '&.Mui-focused fieldset':{
            borderWidth: '1px !important'
          }

        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        // Name of the slot
        root: {
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '& fieldset':{
            borderWidth: '1px !important'
          }
        }
      }
    }
  }
  // ...other properties
})

export default theme