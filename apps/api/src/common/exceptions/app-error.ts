export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'REPORT_NOT_FOUND'
  | 'REPORT_PARAMS_INVALID'
  | 'REPORT_RUN_NOT_FOUND'
  | 'REPORT_RUN_NOT_READY'
  | 'REPORT_ARTIFACT_MISSING';

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
    readonly statusCode: number,
    readonly details: unknown = null,
  ) {
    super(message);
  }
}
