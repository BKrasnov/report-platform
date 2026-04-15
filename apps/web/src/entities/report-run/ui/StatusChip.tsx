import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { REPORT_RUN_STATUSES, type ReportRunStatus } from '@report-platform/shared';

type ReportRunStatusChipProps = {
  status: ReportRunStatus;
  label: string;
} & Omit<ChipProps, 'color' | 'variant' | 'label'>;

function getStatusColor(status: ReportRunStatus): 'default' | 'primary' | 'success' | 'error' {
  if (status === REPORT_RUN_STATUSES.running) return 'primary';
  if (status === REPORT_RUN_STATUSES.succeeded) return 'success';
  if (status === REPORT_RUN_STATUSES.failed) return 'error';
  return 'default';
}

export const StatusChip = ({
  status,
  label,
  ...chipProps
}: ReportRunStatusChipProps): JSX.Element => (
  <Chip
    color={getStatusColor(status)}
    label={label}
    variant={status === REPORT_RUN_STATUSES.queued ? 'outlined' : 'filled'}
    {...chipProps}
  />
);
