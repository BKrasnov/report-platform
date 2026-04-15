export const REPORT_IDS = {
  driverMedicalChecks: 'driver-medical-checks',
  companySummary: 'company-summary',
} as const;

export type ReportId = (typeof REPORT_IDS)[keyof typeof REPORT_IDS];
