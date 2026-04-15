export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(`Request failed with status ${status}`);
  }
}
