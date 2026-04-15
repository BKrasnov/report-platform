export type ApiValidationIssue = {
  path: unknown;
  message: string;
};

export function mapApiValidationMessage(message: string): string {
  if (message === 'Invalid date') return 'некорректная дата';
  if (message === 'Invalid uuid') return 'некорректный UUID';
  return message;
}

export function extractApiErrorDetailsByCode(body: unknown, code: string): unknown {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const apiBody = body as Record<string, unknown>;
  const errorValue = apiBody.error;
  if (!errorValue || typeof errorValue !== 'object') {
    return null;
  }

  const errorRecord = errorValue as Record<string, unknown>;
  if (errorRecord.code !== code) {
    return null;
  }

  return errorRecord.details;
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseApiValidationIssues(value: unknown): ApiValidationIssue[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const issues: ApiValidationIssue[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const record = item as Record<string, unknown>;
    if (typeof record.message !== 'string') {
      continue;
    }

    const nestedIssues = tryParseJson(record.message);
    if (nestedIssues) {
      issues.push(...parseApiValidationIssues(nestedIssues));
      continue;
    }

    issues.push({
      path: record.path,
      message: mapApiValidationMessage(record.message),
    });
  }

  return issues;
}
