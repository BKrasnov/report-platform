import { Stack } from '@mui/material';

import { AppLogo } from './AppLogo';
import { AppNav } from './AppNav';

import type { AppLinkProps } from '@/shared/ui';

type AppHeaderProps = {
  isReportsActive: boolean;
  isRunsActive: boolean;
  reportsHref: AppLinkProps['to'];
  runsHref: AppLinkProps['to'];
};

export const AppHeader = ({
  isReportsActive,
  isRunsActive,
  reportsHref,
  runsHref,
}: AppHeaderProps): JSX.Element => (
  <Stack
    component="header"
    direction={{ xs: 'column', md: 'row' }}
    alignItems={{ xs: 'flex-start', md: 'center' }}
    gap={2}
    sx={{
      px: { xs: 2.5, md: 3 },
      py: 2.25,
      borderBottom: 1,
      borderColor: 'divider',
      background: 'linear-gradient(180deg, rgb(255 255 255 / 44%) 0%, transparent 100%)',
    }}
  >
    <AppLogo />
    <AppNav
      isReportsActive={isReportsActive}
      isRunsActive={isRunsActive}
      reportsHref={reportsHref}
      runsHref={runsHref}
    />
  </Stack>
);
