import { createTheme } from "@mui/material";

export default createTheme({
    typography: {
        allVariants: {
            textTransform: 'none',
            fontFamily: 'Open Sans, san-serif',
            fontWeight: 300
        },
        h4: {
            fontFamily: 'Montserrat, san-serif',
            fontSize: 26,
            fontWeight: 400
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "body": {
                    margin: 0,
                    background: '#F9FAFB'
                },

                ".maplibregl-ctrl": {
                    borderRadius: 50,
                    backdropFilter: "blur(4px)"
                },

                ".maplibgregl-ctrl-group:not(:empty)": {
                    boxShadow: `0px 6px 6px -3px #33000000,0px 10px 14px 1px #24000000,0px 4px 18px 3px $1f000000`,
                },

                ".maplibregl-ctrl-top-right": {
                    top: 0,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 'auto',
                    flexWrap: 'nowrap',
                    alignItems: 'flex-end'
                },

                ".maplibregl-ctrl-top-right .maplibregl-ctrl": {
                    float: 'right',
                    margin: '16px 16px 0 0'
                },

                ".maplibregl-ctrl-group button": {
                    width: 40,
                    height: 40,
                    padding: 8
                },

                ".maplibregl-ctrl button:first-child:not(:disabled):hover": {
                    borderRadius: '50px 50px 0px 0px'
                },

                ".maplibregl-ctrl button:last-child:not(:disabled):hover": {
                    borderRadius: '0px 0px 50px 50px'
                },

                ".maplibregl-ctrl button:only-child:not(:disabled):hover": {
                    borderRadius: 50
                }
            }
        }
    }
});