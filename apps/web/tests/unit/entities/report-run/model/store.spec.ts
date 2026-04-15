import { REPORT_RUN_STATUSES, type ReportRunView } from '@report-platform/shared';
import { describe, expect, it, vi } from 'vitest';

import { ReportRunStore } from '@/entities/report-run/model/store';

const createRun = (overrides: Partial<ReportRunView> = {}): ReportRunView => ({
  id: 'run-1',
  reportId: 'driver-medical-checks',
  name: 'Initial name',
  status: REPORT_RUN_STATUSES.queued,
  params: {},
  resultFileName: null,
  resultContentType: null,
  errorMessage: null,
  startedAt: null,
  finishedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('ReportRunStore', () => {
  it('loads list once and reuses cached state', async () => {
    const getAll = vi.fn().mockResolvedValue([createRun()]);
    const getById = vi.fn();
    const store = new ReportRunStore({ getAll, getById });

    await store.loadAll();
    await store.loadAll();

    expect(getAll).toHaveBeenCalledTimes(1);
    expect(store.items).toHaveLength(1);
  });

  it('reuses run details from store and force reloads when requested', async () => {
    const getAll = vi.fn().mockResolvedValue([createRun()]);
    const getById = vi.fn().mockResolvedValue(createRun({ status: REPORT_RUN_STATUSES.succeeded }));
    const store = new ReportRunStore({ getAll, getById });

    await store.loadAll();
    const cachedRun = await store.loadById('run-1');
    const refreshedRun = await store.loadById('run-1', { force: true });

    expect(cachedRun.status).toBe(REPORT_RUN_STATUSES.queued);
    expect(refreshedRun.status).toBe(REPORT_RUN_STATUSES.succeeded);
    expect(getById).toHaveBeenCalledTimes(1);
    expect(store.getById('run-1')?.status).toBe(REPORT_RUN_STATUSES.succeeded);
  });

  it('updates cached name when details request returns a newer entity shape', async () => {
    const getAll = vi.fn().mockResolvedValue([createRun({ name: null })]);
    const getById = vi.fn().mockResolvedValue(createRun({ name: 'Detailed name' }));
    const store = new ReportRunStore({ getAll, getById });

    await store.loadAll();
    expect(store.getById('run-1')?.name).toBeNull();

    await store.loadById('run-1', { force: true });

    expect(store.getById('run-1')?.name).toBe('Detailed name');
  });
});
