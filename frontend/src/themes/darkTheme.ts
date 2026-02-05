import { createTheme } from '@mui/material/styles';

const brandColors = {
    primary: '#2D5CAE',
    black: '#000000',
    white: '#FFFFFF',
};

const primaryVariants = {
    50: '#E8F0FF',
    100: '#C6DAFF',
    200: '#A1C4FF',
    300: '#7CAEFF',
    400: '#5D98FF',
    500: brandColors.primary,
    600: '#2650A3',
    700: '#1E4297',
    800: '#17358C',
    900: '#0D2580',
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: brandColors.primary,
            light: primaryVariants[400],
            dark: primaryVariants[700],
            contrastText: brandColors.white,
        },

        secondary: {
            main: '#404040',
            light: '#606060',
            dark: '#202020',
            contrastText: brandColors.white,
        },

        background: {
            default: brandColors.black,
            paper: '#0A0A0A',
        },

        text: {
            primary: brandColors.white,
            secondary: '#B0B0B0',
            disabled: '#606060',
        },

        error: {
            main: '#FF5252',
            light: '#FF7A7A',
            dark: '#D32F2F',
            contrastText: brandColors.white,
        },

        warning: {
            main: '#FFA726',
            light: '#FFB74D',
            dark: '#F57C00',
            contrastText: brandColors.black,
        },

        info: {
            main: '#29B6F6',
            light: '#4FC3F7',
            dark: '#0288D1',
            contrastText: brandColors.white,
        },

        success: {
            main: '#66BB6A',
            light: '#81C784',
            dark: '#388E3C',
            contrastText: brandColors.white,
        },

        grey: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
        },

        divider: '#303030',

        action: {
            active: brandColors.white,
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(45, 92, 174, 0.12)',
            disabled: '#606060',
            disabledBackground: '#1A1A1A',
            focus: 'rgba(255, 255, 255, 0.12)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.2,
            color: brandColors.white,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: brandColors.white,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: brandColors.white,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: brandColors.white,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.5,
            color: brandColors.white,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.6,
            color: brandColors.white,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
            color: brandColors.white,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.43,
            color: '#B0B0B0',
        },
        button: {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.75,
            textTransform: 'none',
        },
    },
    spacing: 8,
    shape: {
        borderRadius: 8,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: brandColors.black,
                    color: brandColors.white,
                },
                '*:focus': {
                    outline: 'none',
                },
                'button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible':
                    {
                        outline: `2px solid ${brandColors.white}`,
                        outlineOffset: '2px',
                    },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '10px 20px',
                    boxShadow: 'none',
                    '&:focus': {
                        outline: 'none',
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${brandColors.white}`,
                        outlineOffset: '2px',
                    },
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(45, 92, 174, 0.25)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0px 6px 16px rgba(45, 92, 174, 0.3)',
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${brandColors.white}`,
                        outlineOffset: '2px',
                        boxShadow: '0px 6px 16px rgba(45, 92, 174, 0.3)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    borderColor: '#303030',
                    '&:hover': {
                        borderWidth: '1.5px',
                        borderColor: brandColors.primary,
                        backgroundColor: 'rgba(45, 92, 174, 0.08)',
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${brandColors.white}`,
                        outlineOffset: '2px',
                        borderColor: brandColors.primary,
                    },
                },
                text: {
                    '&:focus-visible': {
                        outline: `2px solid ${brandColors.white}`,
                        outlineOffset: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0A0A0A',
                    borderRadius: 12,
                    border: '1px solid #1A1A1A',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
                        borderColor: '#303030',
                    },
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#0A0A0A',
                        borderRadius: 8,
                        '& fieldset': {
                            borderColor: '#303030',
                        },
                        '&:hover fieldset': {
                            borderColor: '#505050',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: brandColors.primary,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#B0B0B0',
                    },
                    '& .MuiInputBase-input': {
                        color: brandColors.white,
                        '&:focus': {
                            outline: 'none',
                        },
                    },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0A0A0A',
                    borderRadius: 8,
                },
                elevation1: {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                },
                elevation2: {
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
                },
                elevation3: {
                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: brandColors.black,
                    borderBottom: '1px solid #1A1A1A',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1A1A1A',
                    color: brandColors.white,
                    borderRadius: 16,
                    '&:hover': {
                        backgroundColor: '#303030',
                    },
                },
                outlined: {
                    borderColor: '#303030',
                    '&:hover': {
                        borderColor: '#505050',
                    },
                },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0A0A0A',
                    borderRadius: 12,
                    border: '1px solid #1A1A1A',
                },
            },
        },

        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(45, 92, 174, 0.12)',
                        '&:hover': {
                            backgroundColor: 'rgba(45, 92, 174, 0.16)',
                        },
                    },
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: brandColors.primary,
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: brandColors.primary,
                        '& + .MuiSwitch-track': {
                            backgroundColor: brandColors.primary,
                        },
                    },
                },
                track: {
                    backgroundColor: '#505050',
                },
            },
        },
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default darkTheme;
