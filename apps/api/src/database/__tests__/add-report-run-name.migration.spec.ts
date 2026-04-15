import { AddReportRunName1713180000000 } from '../migrations/1713180000000-add-report-run-name';

describe('AddReportRunName1713180000000', () => {
  it('adds nullable report_runs.name column on migrate up', async () => {
    const queryRunner = {
      query: vi.fn().mockResolvedValue(undefined),
    };
    const migration = new AddReportRunName1713180000000();

    await migration.up(queryRunner as never);

    expect(queryRunner.query).toHaveBeenCalledWith(
      'ALTER TABLE report_runs ADD COLUMN IF NOT EXISTS name varchar(120)',
    );
  });

  it('drops report_runs.name column on migrate down', async () => {
    const queryRunner = {
      query: vi.fn().mockResolvedValue(undefined),
    };
    const migration = new AddReportRunName1713180000000();

    await migration.down(queryRunner as never);

    expect(queryRunner.query).toHaveBeenCalledWith(
      'ALTER TABLE report_runs DROP COLUMN IF EXISTS name',
    );
  });
});
