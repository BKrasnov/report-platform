import { describe, expect, expectTypeOf, it } from 'vitest';

import { getRouter, resolveInitialUrl } from '@/app/providers/router';
import type { AppRouter } from '@/app/providers/router/types';
import { routerBuilder } from '@/shared/lib/router';

describe('router', () => {
  it('builds urls for reports, runs and run details', () => {
    const router = getRouter();

    expect(router.stateToUrl(routerBuilder.reports())).toBe('/reports');
    expect(router.stateToUrl(routerBuilder.runs())).toBe('/runs');
    expect(router.stateToUrl(routerBuilder.runDetails({ runId: 'run-1' }))).toBe('/runs/run-1');
  });

  it('resolves root url to reports route', () => {
    expect(resolveInitialUrl('http://localhost:5173/')).toBe('/reports');
    expect(resolveInitialUrl('http://localhost:5173/runs?status=running#table')).toBe(
      '/runs?status=running#table'
    );
  });
});

describe('routerBuilder types', () => {
  it('is compatible with router redirect and stateToUrl args', () => {
    type RedirectArg = Parameters<AppRouter['redirect']>[0];
    type StateToUrlArg = Parameters<AppRouter['stateToUrl']>[0];

    expectTypeOf(routerBuilder.reports()).toMatchTypeOf<RedirectArg>();
    expectTypeOf(routerBuilder.runs()).toMatchTypeOf<StateToUrlArg>();
    expectTypeOf(routerBuilder.runDetails({ runId: 'run-1' })).toMatchTypeOf<RedirectArg>();
  });

  it('enforces route params and route names at compile time', () => {
    if (false) {
      // @ts-expect-error runId is required
      routerBuilder.runDetails();

      // @ts-expect-error unknown route does not exist on builder
      routerBuilder.unknown();
    }
  });
});
