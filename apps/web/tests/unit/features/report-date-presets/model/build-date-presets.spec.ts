import { describe, expect, it } from 'vitest';

import { reportDatePresetsModel } from '@/features/report-date-presets';

describe('buildDatePresets', () => {
  it('builds deterministic ranges for a fixed date', () => {
    const presets = reportDatePresetsModel.utils.buildDatePresets(new Date(2026, 3, 15));

    expect(presets).toEqual([
      {
        id: 'seed',
        label: 'Данные из seed 01–08.04.2026',
        range: {
          from: '2026-04-01',
          to: '2026-04-08',
        },
      },
    ]);
  });
});
