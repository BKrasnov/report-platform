export function getFileName(contentDisposition: string | null): string {
  if (!contentDisposition) {
    return 'report-artifact';
  }

  const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return match?.[1] ?? 'report-artifact';
}
