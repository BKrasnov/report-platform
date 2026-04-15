import type { ReportRunView } from '@report-platform/shared';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { formatDateTime } from '@/shared/lib/date';
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('RunDetailsCard', () => {
  it('reacts to download state changes', () => {
    const onDownload = vi.fn();

    const { rerender } = render(
      <Run.View.DetailsCard
        run={run}
        state="ready"
        isDownloading={false}
        canDownload={true}
        onDownload={onDownload}
      />
    );

    const downloadButton = screen.getByRole('button') as HTMLButtonElement;
    expect(downloadButton.disabled).toBe(false);

    rerender(
      <Run.View.DetailsCard
        run={run}
        state="ready"
        isDownloading={true}
        canDownload={true}
        onDownload={onDownload}
      />
    );

    expect(downloadButton.disabled).toBe(true);
  });

  it('shows run name in details card', () => {
    render(
      <Run.View.DetailsCard
        run={run}
        state="ready"
        isDownloading={false}
        canDownload={true}
        onDownload={vi.fn(async () => undefined)}
      />
    );

    expect(screen.getByText('April run')).toBeDefined();
  });

  it('shows fallback name for legacy run without name', () => {
    render(
      <Run.View.DetailsCard
        run={{ ...run, name: null, id: 'daaf2952-171a-4c98-add6-988eaf57105a' }}
        state="ready"
        isDownloading={false}
        canDownload={true}
        onDownload={vi.fn(async () => undefined)}
      />
    );

    expect(screen.getByText('Медосмотры водителей #daaf2952')).toBeDefined();
  });

  it('shows auto-refresh hint in download section', () => {
    render(
      <Run.View.DetailsCard
        run={{ ...run, status: 'queued' }}
        state="ready"
        isDownloading={false}
        canDownload={false}
        onDownload={vi.fn(async () => undefined)}
      />
    );

    expect(screen.getByText(/5 секунд/i)).toBeDefined();
  });

  it('shows loader on step 1 when run is queued', () => {
    render(
      <Run.View.DetailsCard
        run={{ ...run, status: 'queued' }}
        state="ready"
        isDownloading={false}
        canDownload={false}
        onDownload={vi.fn(async () => undefined)}
      />
    );

    expect(screen.getByTestId('run-step-loader-1')).toBeDefined();
    expect(screen.queryByTestId('run-step-loader-2')).toBeNull();
    expect(screen.queryByTestId('run-step-loader-3')).toBeNull();
  });

  it('shows loader on step 2 when run is running', () => {
    render(
      <Run.View.DetailsCard
        run={{ ...run, status: 'running' }}
        state="ready"
        isDownloading={false}
        canDownload={false}
        onDownload={vi.fn(async () => undefined)}
      />
    );

    expect(screen.getByTestId('run-step-loader-2')).toBeDefined();
    expect(screen.queryByTestId('run-step-loader-1')).toBeNull();
    expect(screen.queryByTestId('run-step-loader-3')).toBeNull();
  });

  it('formats started and finished timestamps the same way as created', () => {
    const isoTimestamp = '2026-04-15T12:47:59.943Z';
    const expected = formatDateTime(isoTimestamp);

    render(
      <Run.View.DetailsCard
        run={{
          ...run,
          createdAt: isoTimestamp,
          startedAt: isoTimestamp,
          finishedAt: isoTimestamp,
        }}
        state="ready"
        isDownloading={false}
        canDownload={true}
        onDownload={vi.fn(async () => undefined)}
      />
    );

    expect(screen.getAllByText(expected)).toHaveLength(3);
  });
});
