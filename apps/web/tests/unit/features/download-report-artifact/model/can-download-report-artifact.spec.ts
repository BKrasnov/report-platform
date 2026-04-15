import { REPORT_RUN_STATUSES } from '@report-platform/shared';
import { describe, expect, it } from 'vitest';

import { downloadReportModel } from '@/features/download-report-artifact';

describe('download-report-artifact feature', () => {
  it('allows download only for succeeded status', () => {
    expect(downloadReportModel.utils.canDownloadReportArtifact(REPORT_RUN_STATUSES.succeeded)).toBe(
      true
    );
    expect(downloadReportModel.utils.canDownloadReportArtifact(REPORT_RUN_STATUSES.running)).toBe(
      false
    );
    expect(downloadReportModel.utils.canDownloadReportArtifact(REPORT_RUN_STATUSES.failed)).toBe(
      false
    );
    expect(downloadReportModel.utils.canDownloadReportArtifact(null)).toBe(false);
    expect(downloadReportModel.utils.canDownloadReportArtifact(undefined)).toBe(false);
  });
});
