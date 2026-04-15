import type { ReactNode } from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';

type RefreshReportRunsButtonProps = {
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  testId?: string;
  children?: ReactNode;
} & Omit<ButtonProps, 'onClick' | 'children'>;

export const RefreshReportRunsButton = ({
  onRefresh,
  isLoading,
  testId,
  children = 'Обновить',
  ...buttonProps
}: RefreshReportRunsButtonProps) => (
  <Button
    type="button"
    variant="outlined"
    onClick={() => void onRefresh()}
    disabled={isLoading}
    data-testid={testId}
    {...buttonProps}
  >
    {children}
  </Button>
);
