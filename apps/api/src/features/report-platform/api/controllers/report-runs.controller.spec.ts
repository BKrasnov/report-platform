import { ReportRunsController } from './report-runs.controller';

const baseRun = {
  id: 'run-1',
  reportId: 'driver-medical-checks',
  name: 'April run',
  status: 'queued',
  params: {
    from: '2026-04-01',
    to: '2026-04-13',
  },
  resultFileName: null,
  resultContentType: null,
  errorMessage: null,
  startedAt: null,
  finishedAt: null,
  createdAt: new Date('2026-04-13T10:00:00.000Z'),
  updatedAt: new Date('2026-04-13T10:00:00.000Z'),
};

describe('ReportRunsController', () => {
  it('delegates report run creation to the use case', async () => {
    const createReportRunUseCase = {
      execute: vi.fn().mockResolvedValue(baseRun),
    };
    const controller = new ReportRunsController(
      createReportRunUseCase as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await controller.create({
      reportId: 'driver-medical-checks',
      name: 'April run',
      params: {
        from: '2026-04-01',
        to: '2026-04-13',
      },
    });

    expect(createReportRunUseCase.execute).toHaveBeenCalledWith({
      reportId: 'driver-medical-checks',
      name: 'April run',
      params: {
        from: '2026-04-01',
        to: '2026-04-13',
      },
    });
  });

  it('returns name in list and get responses', async () => {
    const controller = new ReportRunsController(
      {} as never,
      {
        execute: vi.fn().mockResolvedValue([{ ...baseRun, id: 'run-2' }]),
      } as never,
      {
        execute: vi.fn().mockResolvedValue({ ...baseRun, id: 'run-3' }),
      } as never,
      {} as never,
    );

    const listResult = await controller.list({});
    const getResult = await controller.get('run-3');

    expect(listResult[0]?.name).toBe('April run');
    expect(getResult.name).toBe('April run');
  });
});
