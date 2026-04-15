import { createContext, useContext } from 'react';
import { createConfigs, createRouter } from 'reactive-route';
import { adapters } from 'reactive-route/adapters/mobx-react';

import type { AppRouter, RouterContextValue } from './types';

import { ROUTE_NAMES } from '@/shared/lib/router';

const isNonEmpty = (value: string): boolean => value.trim().length > 0;

export const createAppConfigs = () =>
  createConfigs({
    [ROUTE_NAMES.reports]: {
      path: '/reports',
      loader: () => import('@/pages/reports-page/ui/ReportsPage'),
    },
    [ROUTE_NAMES.runs]: {
      path: '/runs',
      loader: () => import('@/pages/runs-page/ui/RunsPage'),
    },
    [ROUTE_NAMES.runDetails]: {
      path: '/runs/:runId',
      params: {
        runId: isNonEmpty,
      },
      loader: () => import('@/pages/run-details-page/ui/RunDetailsPage'),
    },
    [ROUTE_NAMES.notFound]: {
      path: '/not-found',
      loader: () => import('@/pages/not-found-page/ui/NotFoundPage'),
    },
    [ROUTE_NAMES.internalError]: {
      path: '/internal-error',
      loader: () => import('@/pages/internal-error-page/ui/InternalErrorPage'),
    },
  });

export const getRouter = () =>
  createRouter({
    adapters,
    configs: createAppConfigs(),
  });

export const RouterContext = createContext<RouterContextValue | null>(null);

export function resolveInitialUrl(currentHref: string): string {
  let currentUrl: URL;

  try {
    currentUrl = new URL(currentHref);
  } catch {
    return `/${ROUTE_NAMES.reports}`;
  }

  if (currentUrl.pathname === '/') {
    return `/${ROUTE_NAMES.reports}${currentUrl.search}${currentUrl.hash}`;
  }

  return `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
}

export function useRouter(): { router: AppRouter } {
  const value = useContext(RouterContext);
  if (!value) {
    throw new Error('RouterContext is not initialized');
  }

  return { router: value.router };
}
