import { Chip, Paper, Stack, Typography } from '@mui/material';

import type { ReportsListProps } from '../model';

import { getReportDescription, getReportTitle } from '@/shared/lib/report-localization';
import { withViewState } from '@/shared/lib/with-view-state';

const ReportsListBase = ({ reports }: ReportsListProps): JSX.Element => (
  <Stack spacing={1.5}>
    {reports.map((report) => (
      <Paper
        key={report.id}
        variant="outlined"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Stack spacing={0.4}>
          <Typography variant="subtitle1" fontWeight={700}>
            {getReportTitle(report.id, report.title)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getReportDescription(report.id, report.description)}
          </Typography>
        </Stack>

        <Chip
          label={report.format.toUpperCase()}
          size="small"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.05em',
            bgcolor: 'primary.light',
            color: 'primary.dark',
          }}
        />
      </Paper>
    ))}
  </Stack>
);

export const ReportsList = withViewState(ReportsListBase, {
  loading: <Typography color="text.secondary">Загружаем отчеты...</Typography>,
  empty: <Typography color="text.secondary">Отчеты пока не найдены.</Typography>,
});
