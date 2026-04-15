import { ListCompaniesUseCase } from './list-companies.use-case';

describe('ListCompaniesUseCase', () => {
  it('returns all companies from repository', async () => {
    const companiesRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: 'c-1', name: 'Alpha' },
        { id: 'c-2', name: 'Beta' },
      ]),
    };
    const useCase = new ListCompaniesUseCase(companiesRepository as never);

    const companies = await useCase.execute();

    expect(companiesRepository.findAll).toHaveBeenCalledTimes(1);
    expect(companies).toEqual([
      { id: 'c-1', name: 'Alpha' },
      { id: 'c-2', name: 'Beta' },
    ]);
  });
});
