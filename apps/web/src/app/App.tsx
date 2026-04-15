import { Router } from 'reactive-route/react';
import { observer } from 'mobx-react-lite';

import { useRouter } from './providers/router';
import { AppHeader } from './ui/AppHeader';
import { AppShell } from './ui/AppShell';

import { ROUTE_NAMES, routerBuilder } from '@/shared/lib/router';

const AppComponent = (): JSX.Element => {
  const { router } = useRouter();

  const activeName = router.activeName;
  const isReportsActive = activeName === ROUTE_NAMES.reports;
  const isRunsActive = activeName === ROUTE_NAMES.runs || activeName === ROUTE_NAMES.runDetails;

  return (
    <AppShell
      header={
        <AppHeader
          isReportsActive={isReportsActive}
          isRunsActive={isRunsActive}
          reportsHref={routerBuilder.reports()}
          runsHref={routerBuilder.runs()}
        />
      }
    >
      <Router router={router} />
    </AppShell>
  );
};

export const App = observer(AppComponent);
