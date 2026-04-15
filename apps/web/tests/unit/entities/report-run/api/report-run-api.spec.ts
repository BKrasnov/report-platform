import { afterEach, describe, expect, it, vi } from 'vitest';

import { create, getAll, getById } from '@/entities/report-run/api';

describe('report-run-api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('validates payload with shared schema before fetch', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    expect(() =>
      create({
        reportId: 'invalid-report-id',
        name: 'invalid',
        params: {},
      } as never)
    ).toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('maps successful response', async () => {
    const fakeRuns = [
      {
        id: 'run-1',
        reportId: 'driver-medical-checks',
        name: 'April run',
        status: 'queued',
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(fakeRuns), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    const result = await getAll();

    expect(result[0]?.id).toBe('run-1');
  });

  it('requests run details via report-runs endpoint', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'run-1',
          reportId: 'driver-medical-checks',
          name: 'April run',
          status: 'queued',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchSpy);

    await getById('run-1');

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/report-runs/run-1',
      expect.objectContaining({
        headers: expect.objectContaining({ 'content-type': 'application/json' }),
      })
    );
  });
});
