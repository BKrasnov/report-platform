import type { CreateRunForm, CreateRunPayload } from './types';

export function buildCreateRunPayload(form: CreateRunForm): CreateRunPayload {
  const companyId = form.companyId.trim();

  return {
    reportId: form.reportId,
    name: form.name.trim(),
    params: {
      from: form.from,
      to: form.to,
      ...(companyId ? { companyId } : {}),
    },
  };
}
