import { describe, expect, it, vi } from 'vitest';

import { CompanyStore } from '@/entities/company/model/store';

describe('CompanyStore', () => {
  it('loads companies only once without force reload', async () => {
    const getAll = vi.fn().mockResolvedValue([
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Company',
      },
    ]);

    const store = new CompanyStore({ getAll });

    await store.load();
    await store.load();

    expect(getAll).toHaveBeenCalledTimes(1);
    expect(store.items).toHaveLength(1);
  });
});
