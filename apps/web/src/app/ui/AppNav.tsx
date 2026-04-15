import type { SxProps } from '@mui/material';
import { Stack } from '@mui/material';

import type { AppLinkProps } from '@/shared/ui';
import { AppLink } from '@/shared/ui';

type AppNavProps = {
  isReportsActive: boolean;
  isRunsActive: boolean;
  reportsHref: AppLinkProps['to'];
  runsHref: AppLinkProps['to'];
};

const getNavLinkSx = (isActive: boolean): SxProps =>
  ({
    display: 'inline-flex',
    alignItems: 'center',
    px: 2,
    py: 1.1,
    borderRadius: 1.5,
    fontSize: '1.05rem',
    fontWeight: 600,
    color: isActive ? 'primary.dark' : 'text.secondary',
    backgroundColor: isActive ? 'primary.light' : 'transparent',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      color: 'primary.dark',
      backgroundColor: isActive ? 'primary.light' : 'rgba(68, 90, 227, 0.08)',
    },
  }) as const;

export const AppNav = ({
  isReportsActive,
  isRunsActive,
  reportsHref,
  runsHref,
}: AppNavProps): JSX.Element => (
  <Stack component="nav" direction="row" spacing={1.25} aria-label="Основная навигация">
    <AppLink
      data-testid="nav-link-reports"
      to={reportsHref}
      aria-current={isReportsActive ? 'page' : undefined}
      sx={getNavLinkSx(isReportsActive)}
    >
      Отчеты
    </AppLink>
    <AppLink
      data-testid="nav-link-runs"
      to={runsHref}
      aria-current={isRunsActive ? 'page' : undefined}
      sx={getNavLinkSx(isRunsActive)}
    >
      Запуски
    </AppLink>
  </Stack>
);
