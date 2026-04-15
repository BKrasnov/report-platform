import { Box, Typography } from '@mui/material';

export const AppLogo = (): JSX.Element => (
  <Typography
    aria-label="Платформа отчетов"
    component="div"
    sx={{
      display: 'inline-flex',
      alignItems: 'baseline',
      lineHeight: 1,
      letterSpacing: '-0.02em',
      fontWeight: 800,
      fontSize: { xs: '2.1rem', md: '2.75rem' },
    }}
  >
    <Box component="span" sx={{ color: 'secondary.main' }}>
      +
    </Box>
    <Box component="span" sx={{ color: 'primary.dark' }}>
      MC
    </Box>
  </Typography>
);
