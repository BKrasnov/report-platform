import type { CompanyView } from '@report-platform/shared';

import { fetchJson } from '@/shared/api/http-client';

export const getAll = (): Promise<CompanyView[]> => fetchJson<CompanyView[]>('/companies');
