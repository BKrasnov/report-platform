import type { TypeStateDynamic } from 'reactive-route';

import type { createAppConfigs, getRouter } from './index';

import type {
  AppRouteName as BuilderAppRouteName,
  AppRouteState as BuilderAppRouteState,
} from '@/shared/lib/router';

export type AppConfigs = ReturnType<typeof createAppConfigs>;
export type AppRouteName = BuilderAppRouteName;

type AppRouteStateFromConfigs = TypeStateDynamic<AppConfigs>;
type EnsureExtends<T extends U, U> = T extends U ? true : never;
export type AppRouter = ReturnType<typeof getRouter> &
  (EnsureExtends<BuilderAppRouteState, AppRouteStateFromConfigs> extends true ? unknown : never) &
  (EnsureExtends<AppRouteStateFromConfigs, BuilderAppRouteState> extends true ? unknown : never);

export type RouterContextValue = {
  router: AppRouter;
};
