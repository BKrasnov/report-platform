import { useMemo } from 'react';
import { Button, Stack } from '@mui/material';

import { buildDatePresets } from '../model';

type ReportDatePresetButtonsProps = {
  onApplyRange: (from: string, to: string) => void;
};

export const ReportDatePresetButtons = ({
  onApplyRange,
}: ReportDatePresetButtonsProps): JSX.Element => {
  const datePresets = useMemo(() => buildDatePresets(), []);

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {datePresets.map((preset) => (
        <Button
          key={preset.id}
          type="button"
          variant="contained"
          size="small"
          data-testid={`date-preset-${preset.id}`}
          onClick={() => onApplyRange(preset.range.from, preset.range.to)}
        >
          {preset.label}
        </Button>
      ))}
    </Stack>
  );
};
