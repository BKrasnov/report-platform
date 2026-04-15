import { Stack } from '@mui/material';
import type { ReportRunView } from '@report-platform/shared';

import { getReportTitle, getRunDisplayName } from '@/shared/lib/report-localization';
import { InfoCard } from '@/shared/ui';

type RunDetailsMetaProps = {
  run: ReportRunView;
};

export const RunDetailsMeta = ({ run }: RunDetailsMetaProps): JSX.Element => (
  <Stack spacing={1.1}>
    <InfoCard label="Название" value={getRunDisplayName(run)} sx={{ p: 1.4 }} />
    <InfoCard label="Отчет" value={getReportTitle(run.reportId)} sx={{ p: 1.4 }} />
    <InfoCard
      label="Создан"
      value={new Date(run.createdAt).toLocaleString('ru-RU')}
      sx={{ p: 1.4 }}
    />
    <InfoCard label="Начат" value={run.startedAt ?? '-'} sx={{ p: 1.4 }} />
    <InfoCard label="Завершен" value={run.finishedAt ?? '-'} sx={{ p: 1.4 }} />
    <InfoCard label="Файл" value={run.resultFileName ?? '-'} sx={{ p: 1.4 }} />
  </Stack>
);
