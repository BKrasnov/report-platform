import {
  type CreateReportRunRequest,
  createReportRunSchema,
  type ReportRunView,
} from '@report-platform/shared';

import { getFileName } from '../model/utils';

import { fetchJson } from '@/shared/api/http-client';
import { downloadBlob } from '@/shared/lib/download-file';

export const getAll = (): Promise<ReportRunView[]> => fetchJson<ReportRunView[]>('/report-runs');

export const getById = (runId: string): Promise<ReportRunView> =>
  fetchJson<ReportRunView>(`/report-runs/${runId}`);

export const create = (payload: CreateReportRunRequest): Promise<ReportRunView> =>
  fetchJson<ReportRunView>('/report-runs', {
    method: 'POST',
    body: JSON.stringify(createReportRunSchema.parse(payload)),
  });

export const downloadArtifactById = async (runId: string): Promise<void> => {
  const response = await fetch(`/api/report-runs/${encodeURIComponent(runId)}/download`);

  if (!response.ok) {
    throw new Error('Failed to download report artifact');
  }

  const blob = await response.blob();
  const fileName = getFileName(response.headers.get('content-disposition'));
  downloadBlob(blob, fileName);
};
