import type { Company } from '../../domain/entities/company.entity';
import type { CompanyViewModel } from '../view-models/company.view-model';

export function mapCompanyToViewModel(company: Company): CompanyViewModel {
  return {
    id: company.id,
    name: company.name,
  };
}
