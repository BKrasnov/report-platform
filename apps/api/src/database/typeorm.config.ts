import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';
import { Company } from '../features/report-platform/domain/entities/company.entity';
import { Driver } from '../features/report-platform/domain/entities/driver.entity';
import { MedicalCheck } from '../features/report-platform/domain/entities/medical-check.entity';
import { ReportRun } from '../features/report-platform/domain/entities/report-run.entity';

export function createTypeOrmDataSourceOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER ?? 'report_platform',
    password: process.env.DATABASE_PASSWORD ?? 'report_platform',
    database: process.env.DATABASE_NAME ?? 'report_platform',
    entities: [Company, Driver, MedicalCheck, ReportRun],
    synchronize: false,
    migrationsRun: false,
  };
}

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  return createTypeOrmDataSourceOptions();
}
