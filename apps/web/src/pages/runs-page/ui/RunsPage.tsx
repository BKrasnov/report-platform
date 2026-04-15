import { Alert, Box, Paper } from '@mui/material';
import type { ViewModelParams } from 'mobx-view-model';
import { type ViewModelProps, withViewModel } from 'mobx-view-model-react';

import { RunsPageVM } from '../model/RunsPageVM';

import { useRouter } from '@/app/providers/router';
import { reportRunModel } from '@/entities/report-run';
import { RefreshReportRuns } from '@/features/refresh-report-runs';
import { routerBuilder } from '@/shared/lib/router';
import { AppIcons, InfoCard, PageSection } from '@/shared/ui';
import { Run } from '@/widgets/run';

type RunsPageProps = ViewModelProps<RunsPageVM>;

const config = {
  factory: (vmParams: ViewModelParams<Record<string, never>>) =>
    new RunsPageVM(
      {
        runsStore: reportRunModel.state,
      },
      vmParams
    ),
};

const RunsPage = withViewModel(
  RunsPageVM,
  ({ model: vm }: RunsPageProps): JSX.Element => {
    const { router } = useRouter();
    const { queued, running, done } = vm.stats;

    return (
      <PageSection
        title="Запуски"
        subtitle="Отслеживайте прогресс и открывайте детали запуска в один клик."
        actions={
          <RefreshReportRuns.Button
            onRefresh={vm.refresh}
            isLoading={vm.isLoading}
            startIcon={<AppIcons.RefreshCw size={18} />}
            sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}
          />
        }
      >
        <Box
          component="section"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 1.5,
          }}
        >
          <InfoCard
            layout="column"
            label="В очереди"
            value={queued}
            labelTypographyProps={{ variant: 'overline', fontWeight: 700 }}
            valueTypographyProps={{ color: 'primary.dark', fontSize: '2rem', fontWeight: 800 }}
            sx={{ p: 2 }}
          />

          <InfoCard
            layout="column"
            label="В работе"
            value={running}
            labelTypographyProps={{ variant: 'overline', fontWeight: 700 }}
            valueTypographyProps={{ color: 'primary.dark', fontSize: '2rem', fontWeight: 800 }}
            sx={{ p: 2 }}
          />

          <InfoCard
            layout="column"
            label="Завершено"
            value={done}
            labelTypographyProps={{ variant: 'overline', fontWeight: 700 }}
            valueTypographyProps={{ color: 'primary.dark', fontSize: '2rem', fontWeight: 800 }}
            sx={{ p: 2 }}
          />
        </Box>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfcff' }}>
          <Run.View.Table
            runs={vm.runs}
            state={vm.isLoading ? 'loading' : 'ready'}
            getRunDetailsHref={(runId) => router.stateToUrl(routerBuilder.runDetails({ runId }))}
            openRunDetails={(runId) => router.redirect(routerBuilder.runDetails({ runId }))}
          />
        </Paper>

        {vm.error && <Alert severity="error">{vm.error}</Alert>}
      </PageSection>
    );
  },
  config
);

export default RunsPage;
