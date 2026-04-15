import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './database/typeorm.config';
import { ReportPlatformModule } from './features/report-platform/report-platform.module';

@Module({
  imports: [TypeOrmModule.forRoot(createTypeOrmOptions()), ReportPlatformModule],
})
export class AppModule {}
