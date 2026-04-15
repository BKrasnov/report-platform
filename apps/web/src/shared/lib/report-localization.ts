type ReportRunNameSource = {
  id: string;
  reportId: string;
  name: string | null;
};

const REPORT_TITLES: Record<string, string> = {
  'driver-medical-checks': 'Медосмотры водителей',
  'company-summary': 'Сводка по компании',
};

const REPORT_DESCRIPTIONS: Record<string, string> = {
  'driver-medical-checks': 'Детализированная выгрузка медицинских проверок по периоду и компании.',
  'company-summary': 'Сводная аналитика медицинских проверок по компании.',
};

const FALLBACK_SHORT_ID_LENGTH = 8;

export function getReportTitle(reportId: string, fallback?: string): string {
  return REPORT_TITLES[reportId] ?? fallback ?? reportId;
}

export function getReportDescription(reportId: string, fallback?: string): string {
  return REPORT_DESCRIPTIONS[reportId] ?? fallback ?? 'Описание отсутствует';
}

export function getRunDisplayName(run: ReportRunNameSource): string {
  const normalizedName = run.name?.trim() ?? '';
  if (normalizedName) {
    return normalizedName;
  }

  const reportTitle = getReportTitle(run.reportId);
  const shortId = run.id.slice(0, FALLBACK_SHORT_ID_LENGTH);

  return `${reportTitle} #${shortId}`;
}
