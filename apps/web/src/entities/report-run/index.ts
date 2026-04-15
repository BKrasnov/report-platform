import { getStatusLabel } from './model/constants';
import { ReportRunStore } from './model/store';
import { StatusChip } from './ui/StatusChip';
import * as api from './api';

export { type ReportRunStore } from './model/store';

export const reportRunModel = {
  api,
  state: new ReportRunStore({
    getAll: api.getAll,
    getById: api.getById,
  }),
  model: {
    getStatusLabel,
  },
};

export const ReportRun = {
  StatusChip,
};
