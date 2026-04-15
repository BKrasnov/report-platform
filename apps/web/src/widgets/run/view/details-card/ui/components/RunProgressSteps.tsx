import { Box, CircularProgress, Stack, Typography } from '@mui/material';

import { getStepState, getStepStyles, RUN_PROGRESS_STEPS } from '../../model';

type RunProgressStepsProps = {
  status: string;
};

export const RunProgressSteps = ({ status }: RunProgressStepsProps): JSX.Element => (
  <Stack spacing={1}>
    {RUN_PROGRESS_STEPS.map(({ step, label }) => {
      const stepState = getStepState(step, status);
      const style = getStepStyles(stepState);

      return (
        <Box
          key={step}
          sx={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr',
            alignItems: 'center',
            gap: 1.2,
            p: 1.2,
            borderRadius: 1.5,
            border: 1,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              backgroundColor: style.markerBackground,
              color: style.markerColor,
            }}
          >
            {step}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography fontSize="0.875rem" fontWeight={700}>
              {label}
            </Typography>
            {stepState === 'active' && (
              <CircularProgress
                size={16}
                thickness={5}
                color="inherit"
                data-testid={`run-step-loader-${step}`}
              />
            )}
          </Box>
        </Box>
      );
    })}
  </Stack>
);
