import { Stack, Typography } from '@mui/material';
import type { ReportRunView } from '@report-platform/shared';

import { ReportRun, reportRunModel } from '@/entities/report-run';

type RunDetailsHeaderProps = {
  status: ReportRunView['status'];
};

export const RunDetailsHeader = ({ status }: RunDetailsHeaderProps): JSX.Element => (
  <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
    <Typography variant="h6" fontWeight={800}>
      Статус
    </Typography>
    <ReportRun.StatusChip
      data-testid="run-status"
      status={status}
      label={reportRunModel.model.getStatusLabel(status)}
    />
  </Stack>
);
