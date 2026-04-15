import { ReportCreateFormVM } from './model/FormVM';
import { ReportCreateFormWidget } from './ui/Form';
import {
  buildCreateRunPayload,
  CREATE_RUN_DEFAULT_ERROR_MESSAGE,
  getCreateRunErrorMessage,
  validateCreateRunForm,
} from './model';

export type { CreateRunForm, CreateRunPayload } from './model';

export const createReportRunModel = {
  utils: {
    buildCreateRunPayload,
    getCreateRunErrorMessage,
    validateCreateRunForm,
  },
  constants: {
    CREATE_RUN_DEFAULT_ERROR_MESSAGE,
  },
};

export const Create = {
  Form: ReportCreateFormWidget,
  VM: ReportCreateFormVM,
};
