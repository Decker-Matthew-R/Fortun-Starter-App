import { blue, green, grey, pink, red, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    background: {
      default: '#383737',
    },
    primary: {
      main: '#766cb8',
    },
    secondary: {
      main: '#AEB86C',
    },
    text: {
      primary: '#6CAEB8',
    },
  },
});
