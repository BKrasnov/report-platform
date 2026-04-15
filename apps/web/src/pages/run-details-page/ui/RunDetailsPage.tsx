import { Alert, Stack } from '@mui/material';
import type { ViewModelParams } from 'mobx-view-model';
import { type ViewModelProps, withViewModel } from 'mobx-view-model-react';

import { RunDetailsPageVM } from '../model/RunDetailsPageVM';

import { useRouter } from '@/app/providers/router';
import { reportRunModel } from '@/entities/report-run';
import { RefreshReportRuns } from '@/features/refresh-report-runs';
import { routerBuilder } from '@/shared/lib/router';
import { AppIcons, AppLink, PageSection } from '@/shared/ui';
import { Run } from '@/widgets/run';

type RunDetailsRouteProps = {
  runId: string;
};

type RunDetailsPageProps = RunDetailsRouteProps & ViewModelProps<RunDetailsPageVM>;

const config = {
  factory: (vmParams: ViewModelParams<RunDetailsRouteProps>) =>
    new RunDetailsPageVM(
      {
        runsStore: reportRunModel.state,
        download: reportRunModel.api.downloadArtifactById,
      },
      vmParams
    ),
};

const RunDetailsPageWithVM = withViewModel(
  RunDetailsPageVM,
  ({ model: vm, runId }: RunDetailsPageProps): JSX.Element => (
    <Stack spacing={2.75}>
      <div>
        <AppLink
          to={routerBuilder.runs()}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.8,
            px: 1.2,
            py: 0.9,
            borderRadius: 1.25,
            color: 'primary.dark',
            fontWeight: 700,
            '&:hover': { backgroundColor: 'primary.light' },
          }}
        >
          <AppIcons.ArrowLeft size={16} />К списку запусков
        </AppLink>
      </div>

      <PageSection
        title="Детали запуска"
        subtitle={`Полное состояние выполнения для ${runId}.`}
        actions={
          <RefreshReportRuns.Button
            testId="run-refresh-button"
            onRefresh={vm.refresh}
            isLoading={vm.isLoading || !runId}
            startIcon={<AppIcons.RefreshCw size={18} />}
            sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}
          >
            Обновить
          </RefreshReportRuns.Button>
        }
      >
        <Run.View.DetailsCard
          run={vm.run}
          state={vm.isLoading ? 'loading' : 'ready'}
          isDownloading={vm.isDownloading}
          canDownload={vm.canDownload}
          onDownload={vm.download}
        />

        {vm.error && <Alert severity="error">{vm.error}</Alert>}
      </PageSection>
    </Stack>
  ),
  config
);

export default function RunDetailsPage() {
  const { router } = useRouter();
  const runId = router.state.runDetails?.params.runId ?? '';

  return <RunDetailsPageWithVM runId={runId} payload={{ runId }} />;
}
