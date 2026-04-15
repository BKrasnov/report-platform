import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';

import { AppIcons } from '@/shared/ui';

type DownloadReportArtifactButtonProps = {
  canDownload: boolean;
  isDownloading: boolean;
  onDownload: () => Promise<void>;
} & Omit<ButtonProps, 'onClick' | 'children' | 'startIcon' | 'disabled'>;

export const DownloadReportArtifactButton = ({
  canDownload,
  isDownloading,
  onDownload,
  ...buttonProps
}: DownloadReportArtifactButtonProps): JSX.Element => (
  <Button
    type="button"
    variant="contained"
    onClick={() => void onDownload()}
    disabled={!canDownload || isDownloading}
    startIcon={<AppIcons.Download size={16} />}
    {...buttonProps}
  >
    Скачать
  </Button>
);
