import { describe, expect, it, vi } from 'vitest';

import { ReportStore } from '@/entities/report/model/store';

describe('ReportStore', () => {
  it('loads reports only once without force reload', async () => {
    const getAll = vi.fn().mockResolvedValue([
      {
        id: 'driver-medical-checks',
        title: 'Driver',
        description: '',
        format: 'xlsx',
      },
    ]);

    const store = new ReportStore({ getAll });

    await store.load();
    await store.load();

    expect(getAll).toHaveBeenCalledTimes(1);
    expect(store.items).toHaveLength(1);
  });
});
