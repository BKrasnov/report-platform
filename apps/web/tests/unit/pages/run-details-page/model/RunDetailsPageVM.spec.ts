import { REPORT_RUN_STATUSES, type ReportRunView } from '@report-platform/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTestViewModelParams } from '../../../utils/create-test-view-model-params';

import { RunDetailsPageVM } from '@/pages/run-details-page/model/RunDetailsPageVM';

const createRun = (
  status: ReportRunView['status'],
  overrides: Partial<ReportRunView> = {}
): ReportRunView => ({
  id: 'run-1',
  reportId: 'driver-medical-checks',
  name: 'April run',
  status,
  params: {},
  resultFileName: null,
  resultContentType: null,
  errorMessage: null,
  startedAt: null,
  finishedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const flushAsync = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('RunDetailsPageVM', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('enables download only for succeeded status', async () => {
    const run = createRun(REPORT_RUN_STATUSES.succeeded, {
      resultFileName: 'file.xlsx',
      resultContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi.fn().mockResolvedValue(run),
    };
    const download = vi.fn().mockResolvedValue(undefined);

    const vm = new RunDetailsPageVM(
      { runsStore, download },
      createTestViewModelParams({ runId: '' })
    );

    await vm.load('run-1');

    expect(vm.canDownload).toBe(true);
  });

  it('passes force option on refresh', async () => {
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi.fn().mockResolvedValue(createRun(REPORT_RUN_STATUSES.queued)),
    };
    const download = vi.fn().mockResolvedValue(undefined);

    const vm = new RunDetailsPageVM(
      { runsStore, download },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.load('run-1');
    await vm.refresh();

    expect(runsStore.loadById).toHaveBeenNthCalledWith(1, 'run-1', {});
    expect(runsStore.loadById).toHaveBeenNthCalledWith(2, 'run-1', { force: true });
  });

  it('uses cached run from store without network load', async () => {
    const cachedRun = createRun(REPORT_RUN_STATUSES.queued);
    const runsStore = {
      getById: vi.fn().mockReturnValue(cachedRun),
      loadById: vi.fn(),
    };

    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.load('run-1');

    expect(vm.run?.id).toBe('run-1');
    expect(runsStore.loadById).not.toHaveBeenCalled();
  });

  it('keeps isLoading=false during background force refresh for the same run', async () => {
    let resolveForceLoad!: (value: ReportRunView) => void;
    const forceLoadPromise = new Promise<ReportRunView>((resolve) => {
      resolveForceLoad = resolve;
    });
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi
        .fn()
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.queued))
        .mockImplementationOnce(() => forceLoadPromise),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.load('run-1');

    const forceLoad = vm.load('run-1', { force: true });
    expect(vm.isLoading).toBe(false);

    resolveForceLoad(createRun(REPORT_RUN_STATUSES.queued));
    await forceLoad;
  });

  it('starts polling for queued run and requests every 5 seconds with force option', async () => {
    vi.useFakeTimers();
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi.fn().mockResolvedValue(createRun(REPORT_RUN_STATUSES.queued)),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.mount();
    await flushAsync();

    expect(runsStore.loadById).toHaveBeenNthCalledWith(1, 'run-1', {});

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenNthCalledWith(2, 'run-1', { force: true });

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenNthCalledWith(3, 'run-1', { force: true });
  });

  it('stops polling after succeeded status', async () => {
    vi.useFakeTimers();
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi
        .fn()
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.queued))
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.succeeded)),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.mount();
    await flushAsync();

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenCalledTimes(2);
  });

  it('stops polling after failed status', async () => {
    vi.useFakeTimers();
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi
        .fn()
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.running))
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.failed)),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.mount();
    await flushAsync();

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenCalledTimes(2);
  });

  it('continues polling after failed request and retries every 5 seconds', async () => {
    vi.useFakeTimers();
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi
        .fn()
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.queued))
        .mockRejectedValueOnce(new Error('network'))
        .mockResolvedValueOnce(createRun(REPORT_RUN_STATUSES.queued)),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.mount();
    await flushAsync();

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenNthCalledWith(2, 'run-1', { force: true });

    await vi.advanceTimersByTimeAsync(5000);
    expect(runsStore.loadById).toHaveBeenNthCalledWith(3, 'run-1', { force: true });
  });

  it('clears polling timer on unmount', async () => {
    vi.useFakeTimers();
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi.fn().mockResolvedValue(createRun(REPORT_RUN_STATUSES.queued)),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.mount();
    await flushAsync();
    await vm.unmount();

    await vi.advanceTimersByTimeAsync(10000);
    expect(runsStore.loadById).toHaveBeenCalledTimes(1);
  });

  it('restarts polling when runId changes and stops previous run timer', async () => {
    vi.useFakeTimers();
    const runsStore = {
      getById: vi.fn().mockReturnValue(null),
      loadById: vi
        .fn()
        .mockImplementation((runId: string) =>
          Promise.resolve(createRun(REPORT_RUN_STATUSES.queued, { id: runId }))
        ),
    };
    const vm = new RunDetailsPageVM(
      { runsStore, download: vi.fn() },
      createTestViewModelParams({ runId: 'run-1' })
    );

    await vm.mount();
    await flushAsync();
    vm.setPayload({ runId: 'run-2' });
    await flushAsync();

    await vi.advanceTimersByTimeAsync(5000);

    expect(runsStore.loadById).toHaveBeenNthCalledWith(1, 'run-1', {});
    expect(runsStore.loadById).toHaveBeenNthCalledWith(2, 'run-2', {});
    expect(runsStore.loadById).toHaveBeenNthCalledWith(3, 'run-2', { force: true });
    expect(
      runsStore.loadById.mock.calls.some(
        (call) => call[0] === 'run-1' && JSON.stringify(call[1]) === JSON.stringify({ force: true })
      )
    ).toBe(false);
  });
});
