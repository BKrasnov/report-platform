import { mapReportRunToViewModel } from './report-run.mapper';

describe('mapReportRunToViewModel', () => {
  it('maps name field to response view model', () => {
    const run = {
      id: 'run-1',
      reportId: 'driver-medical-checks',
      name: 'April run',
      status: 'queued',
      params: {},
      resultFileName: null,
      resultContentType: null,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      createdAt: new Date('2026-04-15T10:00:00.000Z'),
      updatedAt: new Date('2026-04-15T10:00:00.000Z'),
    };

    const viewModel = mapReportRunToViewModel(run as never);

    expect(viewModel.name).toBe('April run');
  });

  it('keeps legacy nullable name values', () => {
    const run = {
      id: 'run-1',
      reportId: 'driver-medical-checks',
      name: null,
      status: 'queued',
      params: {},
      resultFileName: null,
      resultContentType: null,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      createdAt: new Date('2026-04-15T10:00:00.000Z'),
      updatedAt: new Date('2026-04-15T10:00:00.000Z'),
    };

    const viewModel = mapReportRunToViewModel(run as never);

    expect(viewModel.name).toBeNull();
  });
});
