export async function refreshReportRuns(load: () => Promise<void>): Promise<void> {
  await load();
}
