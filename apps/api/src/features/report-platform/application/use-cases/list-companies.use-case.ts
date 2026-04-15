import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from '../../infrastructure/repositories/companies.repository';
import type { Company } from '../../domain/entities/company.entity';

@Injectable()
export class ListCompaniesUseCase {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  execute(): Promise<Company[]> {
    return this.companiesRepository.findAll();
  }
}
