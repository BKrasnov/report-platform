import { formatIsoDate } from '@/shared/lib/date';

export type DateRange = {
  from: string;
  to: string;
};

export type DatePreset = {
  id: 'seed' | 'last-7-days' | 'current-month';
  label: string;
  range: DateRange;
};

function shiftDays(date: Date, deltaDays: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + deltaDays);
  return next;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function buildDatePresets(now: Date = new Date()): DatePreset[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return [
    {
      id: 'seed',
      label: 'Данные из seed',
      range: {
        from: '2026-04-01',
        to: '2026-04-08',
      },
    },
    {
      id: 'last-7-days',
      label: 'Последние 7 дней',
      range: {
        from: formatIsoDate(shiftDays(today, -6)),
        to: formatIsoDate(today),
      },
    },
    {
      id: 'current-month',
      label: 'Текущий месяц',
      range: {
        from: formatIsoDate(startOfMonth(today)),
        to: formatIsoDate(today),
      },
    },
  ];
}
