export const REPORT_RUN_STATUSES = {
  queued: 'queued',
  running: 'running',
  succeeded: 'succeeded',
  failed: 'failed',
} as const;

export type ReportRunStatus =
  (typeof REPORT_RUN_STATUSES)[keyof typeof REPORT_RUN_STATUSES];
