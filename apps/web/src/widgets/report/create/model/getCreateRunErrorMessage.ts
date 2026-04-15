import { CREATE_RUN_DEFAULT_ERROR_MESSAGE } from './constants';

import { HttpError } from '@/shared/api/http-error';
import {
  extractApiErrorDetailsByCode,
  parseApiValidationIssues,
} from '@/shared/lib/api-validation';

type ParsedIssue = {
  field: string | null;
  message: string;
};

function translateField(path: unknown): string | null {
  if (!Array.isArray(path) || path.length === 0) {
    return null;
  }

  const firstSegment = String(path[0]);
  if (firstSegment === 'from') return 'Дата начала';
  if (firstSegment === 'to') return 'Дата окончания';
  if (firstSegment === 'companyId') return 'ID компании';
  return firstSegment;
}

function parseIssues(value: unknown): ParsedIssue[] {
  return parseApiValidationIssues(value).map((issue) => ({
    field: translateField(issue.path),
    message:
      issue.message === '`from` must be before or equal to `to`'
        ? 'дата начала должна быть меньше или равна дате окончания'
        : issue.message,
  }));
}

function buildReportParamsErrorMessage(details: unknown): string | null {
  const issues = parseIssues(details);
  if (issues.length === 0) {
    return null;
  }

  const lines = issues.map((issue) => {
    if (!issue.field) {
      return `- ${issue.message}`;
    }

    return `- ${issue.field}: ${issue.message}`;
  });

  return `Проверьте параметры запуска:\n${lines.join('\n')}`;
}

function getReportParamsErrorDetails(body: unknown): unknown {
  return extractApiErrorDetailsByCode(body, 'REPORT_PARAMS_INVALID');
}

export function getCreateRunErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    const details = getReportParamsErrorDetails(error.body);
    const parsedMessage = buildReportParamsErrorMessage(details);
    if (parsedMessage) {
      return parsedMessage;
    }
  }

  return CREATE_RUN_DEFAULT_ERROR_MESSAGE;
}
