import { describe, expect, it, vi } from 'vitest';

import { TimeoutRefreshLoop } from '@/shared/lib/TimeoutRefreshLoop';

describe('TimeoutRefreshLoop', () => {
  it('executes steps on interval and can stop via result', async () => {
    vi.useFakeTimers();
    const loop = new TimeoutRefreshLoop(1000);
    const step = vi.fn().mockResolvedValueOnce('continue').mockResolvedValueOnce('stop');

    loop.start(step);

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(3000);

    expect(step).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('clears scheduled step on stop()', async () => {
    vi.useFakeTimers();
    const loop = new TimeoutRefreshLoop(1000);
    const step = vi.fn().mockResolvedValue('continue');

    loop.start(step);
    loop.stop();

    await vi.advanceTimersByTimeAsync(5000);
    expect(step).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
