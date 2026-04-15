import { createTheme } from '@mui/material';

import { tokens } from './tokens';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.palette.primary.main,
      dark: tokens.palette.primary.dark,
      light: tokens.palette.primary.light,
    },
    secondary: {
      main: tokens.palette.secondary.main,
    },
    background: {
      default: tokens.palette.background.default,
      paper: tokens.palette.background.paper,
    },
    text: {
      primary: tokens.palette.text.primary,
      secondary: tokens.palette.text.secondary,
    },
  },
  shape: {
    borderRadius: tokens.shape.borderRadius,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: {
      fontSize: tokens.typography.h1.fontSize,
      fontWeight: tokens.typography.h1.fontWeight,
      letterSpacing: tokens.typography.h1.letterSpacing,
    },
    h2: {
      fontSize: tokens.typography.h2.fontSize,
      fontWeight: tokens.typography.h2.fontWeight,
      letterSpacing: tokens.typography.h2.letterSpacing,
    },
    button: {
      fontWeight: tokens.typography.button.fontWeight,
      textTransform: tokens.typography.button.textTransform,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: tokens.gradients.bodyBackground,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.buttonBorderRadius,
          fontWeight: tokens.fontWeights.strong,
        },
        containedPrimary: {
          boxShadow: tokens.shadows.primaryContainedButton,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: tokens.fontWeights.strong,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.palette.white,
        },
      },
    },
  },
});
