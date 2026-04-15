import { describe, expect, it, vi } from 'vitest';

import { refreshReportRuns } from '@/features/refresh-report-runs';

describe('refresh-report-runs feature', () => {
  it('delegates to provided loader', async () => {
    const load = vi.fn().mockResolvedValue(undefined);

    await refreshReportRuns(load);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('propagates loader failures', async () => {
    const load = vi.fn().mockRejectedValue(new Error('network'));

    await expect(refreshReportRuns(load)).rejects.toThrow('network');
  });
});
