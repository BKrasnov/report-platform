import { REPORT_RUN_STATUSES, type ReportRunStatus } from '@report-platform/shared';

const RUN_STATUS_LABELS: Record<ReportRunStatus, string> = {
  [REPORT_RUN_STATUSES.queued]: 'В очереди',
  [REPORT_RUN_STATUSES.running]: 'Выполняется',
  [REPORT_RUN_STATUSES.succeeded]: 'Завершен',
  [REPORT_RUN_STATUSES.failed]: 'Ошибка',
};

export const getStatusLabel = (status: ReportRunStatus): string => RUN_STATUS_LABELS[status];
