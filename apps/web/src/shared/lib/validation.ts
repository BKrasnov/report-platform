const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_REGEX.test(value)) return false;

  const utcDate = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(utcDate.getTime())) return false;

  return utcDate.toISOString().slice(0, 10) === value;
}

export function toUtcTimestamp(value: string): number {
  return new Date(`${value}T00:00:00.000Z`).getTime();
}

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}
