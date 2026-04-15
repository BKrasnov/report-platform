import { RecoverStaleReportRunsUseCase } from './recover-stale-report-runs.use-case';

describe('RecoverStaleReportRunsUseCase', () => {
  it('fails stale running report runs using configured timeout', async () => {
    const markStaleRunningAsFailed = vi.fn().mockResolvedValue(3);
    const repository = {
      markStaleRunningAsFailed,
    };
    const useCase = new RecoverStaleReportRunsUseCase(repository as never);

    const result = await useCase.execute(new Date('2026-01-01T00:00:10.000Z'), 5000);

    expect(markStaleRunningAsFailed).toHaveBeenCalledTimes(1);
    const [staleBefore, message] = markStaleRunningAsFailed.mock.calls[0] as [
      Date,
      string,
    ];
    expect(staleBefore.toISOString()).toBe('2026-01-01T00:00:05.000Z');
    expect(message).toContain('timed out');
    expect(result).toBe(3);
  });

  it('uses default timeout when config value is invalid', async () => {
    const markStaleRunningAsFailed = vi.fn().mockResolvedValue(0);
    const repository = {
      markStaleRunningAsFailed,
    };
    const useCase = new RecoverStaleReportRunsUseCase(repository as never);

    await useCase.execute(new Date('2026-01-01T00:20:00.000Z'), 0);

    const [staleBefore] = markStaleRunningAsFailed.mock.calls[0] as [Date];
    expect(staleBefore.toISOString()).toBe('2026-01-01T00:05:00.000Z');
  });
});
