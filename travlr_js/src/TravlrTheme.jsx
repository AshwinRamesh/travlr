import {createTheme} from '@mui/material/styles';

const gladeGreen = {
  50: '#f5f8f5',
  100: '#e8f0e8',
  200: '#d1e1d1',
  300: '#acc9ac',
  400: '#82a880',
  500: '#588157',
  600: '#4a7049',
  700: '#3c593c',
  800: '#334833',
  900: '#2b3c2b',
  950: '#141f15',
};

const activityColor = {
  'accommodation': '#FFD166',
  'food': '#118AB2',
  'sightseeing': '#073B4C'
}

// Create a custom theme
const travlrTheme = createTheme({
  palette: {
    primary: {
      main: gladeGreen[500], // Default primary color
    },
    secondary: {
      main: '#19857b', // Custom secondary color
    },
    gladeGreen,
    activityColor,
  },
});

export default travlrTheme;