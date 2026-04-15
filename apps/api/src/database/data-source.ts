import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createTypeOrmDataSourceOptions } from './typeorm.config';

export default new DataSource({
  ...createTypeOrmDataSourceOptions(),
  migrations: ['src/database/migrations/*.ts'],
});
