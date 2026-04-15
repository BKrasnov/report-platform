import { REPORT_RUN_STATUSES, type ReportRunStatus } from '@report-platform/shared';

export const canDownloadReportArtifact = (status: ReportRunStatus | null | undefined): boolean =>
  status === REPORT_RUN_STATUSES.succeeded;
