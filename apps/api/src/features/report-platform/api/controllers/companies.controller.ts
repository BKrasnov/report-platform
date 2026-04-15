import { Controller, Get } from '@nestjs/common';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies.use-case';
import { mapCompanyToViewModel } from '../mappers/company.mapper';
import type { CompanyViewModel } from '../view-models/company.view-model';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly listCompaniesUseCase: ListCompaniesUseCase) {}

  @Get()
  async list(): Promise<CompanyViewModel[]> {
    const companies = await this.listCompaniesUseCase.execute();
    return companies.map(mapCompanyToViewModel);
  }
}
