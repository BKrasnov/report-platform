import type { ReportRunView } from '@report-platform/shared';

export type RunDetailsCardProps = {
  run: ReportRunView | null;
  isLoading: boolean;
  isDownloading: boolean;
  canDownload: boolean;
  onDownload: () => Promise<void>;
};

export type StepState = 'idle' | 'active' | 'done' | 'failed';

export type StepStyle = {
  backgroundColor: string;
  borderColor: string;
  markerBackground: string;
  markerColor: string;
};
