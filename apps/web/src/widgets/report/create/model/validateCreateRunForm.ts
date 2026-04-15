import type { CompanyView } from '@report-platform/shared';

import type { CreateRunForm } from './types';

import { isValidIsoDate, isValidUuid, toUtcTimestamp } from '@/shared/lib/validation';

export function validateCreateRunForm(
  form: CreateRunForm,
  companies: CompanyView[]
): string | null {
  const name = form.name.trim();
  if (!name) {
    return 'Укажите название отчета.';
  }

  if (name.length > 120) {
    return 'Название отчета должно содержать не более 120 символов.';
  }

  if (!isValidIsoDate(form.from) || !isValidIsoDate(form.to)) {
    return 'Укажите корректные даты в формате YYYY-MM-DD.';
  }

  if (toUtcTimestamp(form.from) > toUtcTimestamp(form.to)) {
    return 'Дата начала должна быть меньше или равна дате окончания.';
  }

  const companyId = form.companyId.trim();
  if (!companyId) {
    return null;
  }

  if (!isValidUuid(companyId)) {
    return 'ID компании должен быть в формате UUID.';
  }

  if (!companies.some((company) => company.id === companyId)) {
    return 'Выберите компанию из списка.';
  }

  return null;
}
