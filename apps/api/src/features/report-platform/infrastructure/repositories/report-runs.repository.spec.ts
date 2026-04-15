import { REPORT_RUN_STATUSES } from '@report-platform/shared';
import {
  CLAIM_NEXT_QUEUED_REPORT_RUN_SQL,
  FAIL_STALE_RUNNING_REPORT_RUNS_SQL,
  ReportRunsRepository,
} from './report-runs.repository';

describe('ReportRunsRepository', () => {
  it('stores name when creating queued run', async () => {
    const save = vi.fn().mockResolvedValue({ id: 'run-1' });
    const create = vi.fn().mockImplementation((input) => input);
    const repository = {
      save,
      create,
    };
    const dataSource = {
      query: vi.fn(),
    };
    const subject = new ReportRunsRepository(repository as never, dataSource as never);

    await subject.createQueued({
      reportId: 'driver-medical-checks',
      name: 'April run',
      params: {},
    });

    expect(create).toHaveBeenCalledWith({
      reportId: 'driver-medical-checks',
      name: 'April run',
      params: {},
      status: REPORT_RUN_STATUSES.queued,
    });
  });

  it('uses an atomic PostgreSQL update when claiming queued report runs', () => {
    expect(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL).toContain('WITH next AS');
    expect(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL).toContain('FOR UPDATE SKIP LOCKED');
    expect(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL).toContain('UPDATE report_runs');
    expect(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL).toContain('RETURNING id');
    expect(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL).toContain('status = $2');
    expect(REPORT_RUN_STATUSES.running).toBe('running');
  });

  it('uses SQL watchdog query to fail stale running runs', () => {
    expect(FAIL_STALE_RUNNING_REPORT_RUNS_SQL).toContain('UPDATE report_runs');
    expect(FAIL_STALE_RUNNING_REPORT_RUNS_SQL).toContain('status = $2');
    expect(FAIL_STALE_RUNNING_REPORT_RUNS_SQL).toContain('status = $1');
    expect(FAIL_STALE_RUNNING_REPORT_RUNS_SQL).toContain('started_at < $3');
    expect(FAIL_STALE_RUNNING_REPORT_RUNS_SQL).toContain('RETURNING id');
    expect(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL).toContain('FOR UPDATE SKIP LOCKED');
    expect(REPORT_RUN_STATUSES.failed).toBe('failed');
  });

  it('handles tuple-style raw query result when claiming next run', async () => {
    const repository = {
      findOneByOrFail: vi.fn().mockResolvedValue({ id: 'run-1' }),
    };
    const dataSource = {
      query: vi.fn().mockResolvedValue([[{ id: 'run-1' }], 1]),
    };
    const subject = new ReportRunsRepository(repository as never, dataSource as never);

    const claimed = await subject.claimNextQueued();

    expect(dataSource.query).toHaveBeenCalledTimes(1);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id: 'run-1' });
    expect(claimed).toEqual({ id: 'run-1' });
  });

  it('returns zero stale updates for tuple-style empty result', async () => {
    const repository = {
      findOneByOrFail: vi.fn(),
    };
    const dataSource = {
      query: vi.fn().mockResolvedValue([[], 0]),
    };
    const subject = new ReportRunsRepository(repository as never, dataSource as never);

    const staleCount = await subject.markStaleRunningAsFailed(
      new Date('2026-01-01T00:00:00.000Z'),
      'timeout',
    );

    expect(staleCount).toBe(0);
    expect(repository.findOneByOrFail).not.toHaveBeenCalled();
  });
});
