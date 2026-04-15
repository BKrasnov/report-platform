import { CompanyStore } from './model/store';
import { getAll } from './api';

export const companyModel = {
  state: new CompanyStore({
    getAll,
  }),
};
