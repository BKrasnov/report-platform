import type { ReportRunView } from '@report-platform/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Run } from '@/widgets/run';

const run: ReportRunView = {
  id: '1821c7fb-2674-4796-8b9b-6ccdba42555c',
  reportId: 'driver-medical-checks',
  name: 'April run',
  status: 'succeeded',
  params: {},
  resultFileName: 'report.xlsx',
  resultContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  errorMessage: null,
  startedAt: null,
  finishedAt: null,
  createdAt: new Date('2026-04-15T07:00:00.000Z').toISOString(),
  updatedAt: new Date('2026-04-15T07:00:00.000Z').toISOString(),
};

describe('RunsTable', () => {
  it('opens run details when clicking on table row', () => {
    const openRunDetails = vi.fn(async () => undefined);

    render(
      <Run.View.Table
        state="ready"
        runs={[run]}
        getRunDetailsHref={(runId) => `/runs/${runId}`}
        openRunDetails={openRunDetails}
      />,
    );

    const row = screen.getByText(run.id).closest('tr');
    expect(row).not.toBeNull();

    fireEvent.click(row!);

    expect(openRunDetails).toHaveBeenCalledTimes(1);
    expect(openRunDetails).toHaveBeenCalledWith(run.id);
  });

  it('does not call openRunDetails twice when clicking on run id link', () => {
    const openRunDetails = vi.fn(async () => undefined);

    render(
      <Run.View.Table
        state="ready"
        runs={[run]}
        getRunDetailsHref={(runId) => `/runs/${runId}`}
        openRunDetails={openRunDetails}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: run.id }));

    expect(openRunDetails).toHaveBeenCalledTimes(1);
    expect(openRunDetails).toHaveBeenCalledWith(run.id);
  });

  it('shows explicit run name when present', () => {
    render(
      <Run.View.Table
        state="ready"
        runs={[run]}
        getRunDetailsHref={(runId) => `/runs/${runId}`}
        openRunDetails={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByText('April run')).toBeDefined();
  });

  it('shows fallback run name for legacy runs', () => {
    render(
      <Run.View.Table
        state="ready"
        runs={[{ ...run, id: 'daaf2952-171a-4c98-add6-988eaf57105a', name: null }]}
        getRunDetailsHref={(runId) => `/runs/${runId}`}
        openRunDetails={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByText('Медосмотры водителей #daaf2952')).toBeDefined();
  });
});
