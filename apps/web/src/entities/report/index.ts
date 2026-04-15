import { ReportStore } from './model/store';
import { getAll } from './api';

export const reportModel = {
  state: new ReportStore({
    getAll,
  }),
};
