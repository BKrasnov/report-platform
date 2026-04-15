import { Typography } from '@mui/material';

import { DownloadReportArtifact } from '@/features/download-report-artifact';

type RunDownloadSectionProps = {
  onDownload: () => Promise<void>;
  canDownload: boolean;
  isDownloading: boolean;
};

export const RunDownloadSection = ({
  onDownload,
  canDownload,
  isDownloading,
}: RunDownloadSectionProps): JSX.Element => (
  <>
    <Typography color="text.secondary" fontSize="0.95rem">
      Скачивание станет доступно после успешного завершения. Статус обновляется автоматически
      каждые 5 секунд.
    </Typography>

    <DownloadReportArtifact.Button
      onDownload={onDownload}
      canDownload={canDownload}
      isDownloading={isDownloading}
      sx={{ alignSelf: 'flex-start' }}
    />
  </>
);
