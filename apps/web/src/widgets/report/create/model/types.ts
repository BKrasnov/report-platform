import type { ReportId } from '@report-platform/shared';

export type CreateRunForm = {
  reportId: ReportId;
  name: string;
  from: string;
  to: string;
  companyId: string;
};

export type CreateRunPayload = {
  reportId: ReportId;
  name: string;
  params: {
    from: string;
    to: string;
    companyId?: string;
  };
};
