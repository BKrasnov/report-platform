import type { ReportView } from '@report-platform/shared';

import { fetchJson } from '@/shared/api/http-client';

export const getAll = (): Promise<ReportView[]> => fetchJson<ReportView[]>('/reports');
