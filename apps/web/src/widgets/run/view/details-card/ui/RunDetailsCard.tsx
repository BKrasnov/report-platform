import { Paper, Stack, Typography } from '@mui/material';

import { RunDetailsHeader } from './components/RunDetailsHeader';
import { RunDetailsMeta } from './components/RunDetailsMeta';
import { RunDownloadSection } from './components/RunDownloadSection';
import { RunProgressSteps } from './components/RunProgressSteps';
import { type RunDetailsCardProps } from '../model';

import { withViewState } from '@/shared/lib/with-view-state';

const RunDetailsCardBase = ({
  run,
  isDownloading,
  canDownload,
  onDownload,
}: Omit<RunDetailsCardProps, 'isLoading'>): JSX.Element => {
  if (!run) {
    return <Typography color="text.secondary">Запуск не найден.</Typography>;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
        gap: 2,
      }}
    >
      <Stack spacing={2}>
        <RunDetailsHeader status={run.status} />
        <RunDetailsMeta run={run} />
      </Stack>

      <Stack
        spacing={1.5}
        sx={{ borderTop: { xs: 1, lg: 0 }, borderColor: 'divider', pt: { xs: 2, lg: 0 } }}
      >
        <RunProgressSteps status={run.status} />
        <RunDownloadSection
          onDownload={onDownload}
          canDownload={canDownload}
          isDownloading={isDownloading}
        />
      </Stack>
    </Paper>
  );
};

export const RunDetailsCard = withViewState(RunDetailsCardBase, {
  loading: <Typography color="text.secondary">Загружаем детали запуска...</Typography>,
});
