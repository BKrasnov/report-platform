import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Report } from '@/widgets/report';

describe('ReportCreateForm', () => {
  it('renders required run name input with max length', () => {
    const onCreateRun = vi.fn();

    render(<Report.Create.Form companies={[]} isSubmitting={false} onCreateRun={onCreateRun} />);

    const nameInput = screen.getByTestId('run-name-input') as HTMLInputElement;

    expect(nameInput.required).toBe(true);
    expect(nameInput.maxLength).toBe(120);
  });

  it('renders company select with available companies', () => {
    const onCreateRun = vi.fn();
    const companies = [
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'North Atlantic LLC',
      },
    ];

    render(
      <Report.Create.Form companies={companies} isSubmitting={false} onCreateRun={onCreateRun} />,
    );

    expect(screen.getByTestId('company-select')).toBeDefined();
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('reacts to submitting state changes', () => {
    const onCreateRun = vi.fn();
    const { rerender } = render(
      <Report.Create.Form companies={[]} isSubmitting={false} onCreateRun={onCreateRun} />,
    );

    const submitButton = screen.getByTestId('create-run-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    rerender(<Report.Create.Form companies={[]} isSubmitting={true} onCreateRun={onCreateRun} />);

    expect(submitButton.disabled).toBe(true);
  });
});
