import type { PropsWithChildren, ReactNode } from 'react';
import { Box, Paper } from '@mui/material';

type AppShellProps = PropsWithChildren<{
  header: ReactNode;
}>;

export const AppShell = ({ header, children }: AppShellProps): JSX.Element => (
  <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 3 } }}>
    <Paper
      elevation={10}
      sx={{
        minHeight: 'calc(100vh - 48px)',
        maxWidth: 1440,
        mx: 'auto',
        overflow: 'hidden',
        borderRadius: 3.25,
        border: '1px solid rgba(255,255,255,0.12)',
        background:
          'radial-gradient(140% 100% at 100% 0%, rgb(70 91 227 / 9%) 0%, transparent 42%), #eceef4',
      }}
    >
      {header}
      <Box component="main" sx={{ p: { xs: 2.5, md: 4 } }}>
        {children}
      </Box>
    </Paper>
  </Box>
);
