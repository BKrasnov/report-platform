import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1712960000000 implements MigrationInterface {
  name = 'InitialSchema1712960000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(
      "CREATE TYPE medical_checks_status_enum AS ENUM ('allowed', 'rejected', 'needs_review')",
    );
    await queryRunner.query(
      "CREATE TYPE report_runs_status_enum AS ENUM ('queued', 'running', 'succeeded', 'failed')",
    );
    await queryRunner.query(`
      CREATE TABLE companies (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(160) NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE drivers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id uuid NOT NULL REFERENCES companies(id),
        full_name varchar(200) NOT NULL,
        personnel_number varchar(64) NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE medical_checks (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id uuid NOT NULL REFERENCES drivers(id),
        checked_at timestamptz NOT NULL,
        status medical_checks_status_enum NOT NULL,
        doctor_name varchar(200) NOT NULL,
        notes text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (driver_id, checked_at)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE report_runs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id varchar(120) NOT NULL,
        status report_runs_status_enum NOT NULL DEFAULT 'queued',
        params jsonb NOT NULL,
        result_file_path text,
        result_file_name varchar(255),
        result_content_type varchar(160),
        error_message text,
        started_at timestamptz,
        finished_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query('CREATE INDEX idx_drivers_company_id ON drivers(company_id)');
    await queryRunner.query(
      'CREATE INDEX idx_medical_checks_driver_id ON medical_checks(driver_id)',
    );
    await queryRunner.query(
      'CREATE INDEX idx_medical_checks_checked_at ON medical_checks(checked_at)',
    );
    await queryRunner.query(
      'CREATE INDEX idx_report_runs_status_created_at ON report_runs(status, created_at)',
    );
    await queryRunner.query(
      'CREATE INDEX idx_report_runs_report_id ON report_runs(report_id)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS idx_report_runs_report_id');
    await queryRunner.query('DROP INDEX IF EXISTS idx_report_runs_status_created_at');
    await queryRunner.query('DROP INDEX IF EXISTS idx_medical_checks_checked_at');
    await queryRunner.query('DROP INDEX IF EXISTS idx_medical_checks_driver_id');
    await queryRunner.query('DROP INDEX IF EXISTS idx_drivers_company_id');
    await queryRunner.query('DROP TABLE IF EXISTS report_runs');
    await queryRunner.query('DROP TABLE IF EXISTS medical_checks');
    await queryRunner.query('DROP TABLE IF EXISTS drivers');
    await queryRunner.query('DROP TABLE IF EXISTS companies');
    await queryRunner.query('DROP TYPE IF EXISTS report_runs_status_enum');
    await queryRunner.query('DROP TYPE IF EXISTS medical_checks_status_enum');
  }
}
