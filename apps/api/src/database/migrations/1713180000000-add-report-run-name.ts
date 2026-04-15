import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportRunName1713180000000 implements MigrationInterface {
  name = 'AddReportRunName1713180000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE report_runs ADD COLUMN IF NOT EXISTS name varchar(120)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE report_runs DROP COLUMN IF EXISTS name');
  }
}
