import type { ReactNode } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import type { PaperProps } from '@mui/material/Paper';
import type { TypographyProps } from '@mui/material/Typography';

type InfoCardProps = {
  label?: ReactNode;
  value?: ReactNode;
  layout?: 'row' | 'column';
  labelTypographyProps?: TypographyProps;
  valueTypographyProps?: TypographyProps;
  children?: ReactNode;
} & Omit<PaperProps, 'children'>;

export const InfoCard = ({
  label,
  value,
  layout = 'row',
  labelTypographyProps,
  valueTypographyProps,
  children,
  ...paperProps
}: InfoCardProps): JSX.Element => {
  const hasLabel = label !== null && label !== undefined;
  const hasValue = value !== null && value !== undefined;

  return (
    <Paper variant="outlined" {...paperProps}>
      {children ?? (
        <Stack
          direction={layout === 'column' ? 'column' : 'row'}
          justifyContent={layout === 'column' ? undefined : 'space-between'}
          alignItems={layout === 'column' ? undefined : 'center'}
          spacing={layout === 'column' ? 0.4 : 1}
        >
          {hasLabel && (
            <Typography color="text.secondary" {...labelTypographyProps}>
              {label}
            </Typography>
          )}
          {hasValue && (
            <Typography
              fontWeight={700}
              color={layout === 'column' ? 'primary.dark' : 'text.primary'}
              {...valueTypographyProps}
            >
              {value}
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};
