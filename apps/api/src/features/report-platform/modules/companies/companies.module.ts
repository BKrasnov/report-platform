import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from '../../api/controllers/companies.controller';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies.use-case';
import { Company } from '../../domain/entities/company.entity';
import { CompaniesRepository } from '../../infrastructure/repositories/companies.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesRepository, ListCompaniesUseCase],
  exports: [ListCompaniesUseCase],
})
export class CompaniesModule {}
