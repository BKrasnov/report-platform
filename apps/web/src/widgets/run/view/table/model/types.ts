import type { ReportRunView } from '@report-platform/shared';

export type RunsTableProps = {
  runs: ReportRunView[];
  isLoading: boolean;
  getRunDetailsHref: (runId: string) => string;
  openRunDetails: (runId: string) => Promise<unknown>;
};
