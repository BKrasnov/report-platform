import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

type PageSectionProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export const PageSection = ({
  title,
  subtitle,
  actions,
  children,
}: PageSectionProps): JSX.Element => (
  <Stack spacing={2.75}>
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', md: 'flex-start' }}
      gap={2}
    >
      <Stack spacing={0.75}>
        <Typography variant="h1">{title}</Typography>
        {subtitle && (
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            {subtitle}
          </Typography>
        )}
      </Stack>

      {actions}
    </Stack>

    {children}
  </Stack>
);
