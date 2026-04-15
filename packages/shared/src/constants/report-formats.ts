export const REPORT_FORMATS = {
  xlsx: 'xlsx',
  pdf: 'pdf',
} as const;

export type ReportFormat = (typeof REPORT_FORMATS)[keyof typeof REPORT_FORMATS];
