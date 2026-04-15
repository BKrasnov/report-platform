export const tokens = {
  palette: {
    primary: {
      main: '#445ae3',
      dark: '#283bb4',
      light: '#dce2ff',
    },
    secondary: {
      main: '#ff2f8b',
    },
    background: {
      default: '#080b14',
      paper: '#eceef4',
    },
    text: {
      primary: '#121423',
      secondary: '#6f7693',
    },
    white: '#ffffff',
  },
  shape: {
    borderRadius: 14,
    buttonBorderRadius: 12,
  },
  typography: {
    fontFamily: 'Manrope, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.15rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.65rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  gradients: {
    bodyBackground: 'radial-gradient(120% 120% at 50% -10%, #15214e 0%, transparent 55%), #080b14',
  },
  shadows: {
    primaryContainedButton: '0 10px 20px rgba(68, 90, 227, 0.22)',
  },
  fontWeights: {
    strong: 700,
  },
} as const;
