import { describe, expect, it, vi } from 'vitest';

import { createTestViewModelParams } from '../../../utils/create-test-view-model-params';

import { RunsPageVM } from '@/pages/runs-page/model/RunsPageVM';

describe('RunsPageVM', () => {
  it('loads runs and refreshes manually', async () => {
    const loadAll = vi
      .fn()
      .mockResolvedValueOnce([
        {
          id: 'run-1',
          reportId: 'driver-medical-checks',
          status: 'queued',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'run-1',
          reportId: 'driver-medical-checks',
          status: 'running',
        },
      ]);

    const vm = new RunsPageVM({ runsStore: { items: [], loadAll } }, createTestViewModelParams({}));

    await vm.load();
    expect(vm.runs[0]?.status).toBe('queued');

    await vm.refresh();
    expect(vm.runs[0]?.status).toBe('running');
  });

  it('passes force option on manual refresh', async () => {
    const loadAll = vi.fn().mockResolvedValue([]);
    const vm = new RunsPageVM({ runsStore: { items: [], loadAll } }, createTestViewModelParams({}));

    await vm.load();
    await vm.refresh();

    expect(loadAll).toHaveBeenNthCalledWith(1, {});
    expect(loadAll).toHaveBeenNthCalledWith(2, { force: true });
  });
});
