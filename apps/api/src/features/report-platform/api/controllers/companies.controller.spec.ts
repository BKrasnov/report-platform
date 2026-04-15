import { CompaniesController } from './companies.controller';

describe('CompaniesController', () => {
  it('returns mapped companies from use case', async () => {
    const listCompaniesUseCase = {
      execute: vi.fn().mockResolvedValue([
        { id: 'c-1', name: 'ООО Североатлантика ПП' },
      ]),
    };
    const controller = new CompaniesController(listCompaniesUseCase as never);

    const companies = await controller.list();

    expect(listCompaniesUseCase.execute).toHaveBeenCalledTimes(1);
    expect(companies).toEqual([{ id: 'c-1', name: 'ООО Североатлантика ПП' }]);
  });
});
