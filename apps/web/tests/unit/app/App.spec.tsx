import { fireEvent, render, waitFor } from '@testing-library/react';
import { makeAutoObservable } from 'mobx';
import { describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';
import { RouterContext } from '@/app/providers/router';
import type { AppRouter } from '@/app/providers/router/types';

vi.mock('reactive-route/react', () => ({
  Router: () => null,
}));

type FakeRouter = Pick<AppRouter, 'activeName' | 'state' | 'stateToUrl' | 'redirect'>;

function createFakeRouter(): FakeRouter {
  const router = {
    activeName: 'reports',
    state: {},
    stateToUrl: ({ name }: { name: string }) => (name === 'runs' ? '/runs' : '/reports'),
    redirect: vi.fn(async ({ name }: { name: string }) => {
      router.activeName = name;
      return `/${name}`;
    }),
  };

  makeAutoObservable(router);
  return router as unknown as FakeRouter;
}

describe('App navigation', () => {
  it('switches active link class without page reload', async () => {
    const router = createFakeRouter();

    const { getByTestId } = render(
      <RouterContext.Provider value={{ router: router as AppRouter }}>
        <App />
      </RouterContext.Provider>
    );

    const reportsLink = getByTestId('nav-link-reports');
    const runsLink = getByTestId('nav-link-runs');

    expect(reportsLink.getAttribute('aria-current')).toBe('page');
    expect(runsLink.getAttribute('aria-current')).toBeNull();

    fireEvent.click(runsLink);

    await waitFor(() => {
      expect(runsLink.getAttribute('aria-current')).toBe('page');
    });
    expect(reportsLink.getAttribute('aria-current')).toBeNull();
  });
});
