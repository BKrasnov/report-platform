export const ROUTE_NAMES = {
  reports: 'reports',
  runs: 'runs',
  runDetails: 'runDetails',
  notFound: 'notFound',
  internalError: 'internalError',
} as const;

export type AppRouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];

type NoParamsRouteState<TName extends string> = {
  name: TName;
};

type ParamsRouteState<TName extends string, TParams extends Record<string, string>> = {
  name: TName;
  params: TParams;
};

export const routerBuilder = {
  [ROUTE_NAMES.reports]: (): NoParamsRouteState<typeof ROUTE_NAMES.reports> => ({
    name: ROUTE_NAMES.reports,
  }),
  [ROUTE_NAMES.runs]: (): NoParamsRouteState<typeof ROUTE_NAMES.runs> => ({
    name: ROUTE_NAMES.runs,
  }),
  [ROUTE_NAMES.runDetails]: ({
    runId,
  }: {
    runId: string;
  }): ParamsRouteState<typeof ROUTE_NAMES.runDetails, { runId: string }> => ({
    name: ROUTE_NAMES.runDetails,
    params: { runId },
  }),
  [ROUTE_NAMES.notFound]: (): NoParamsRouteState<typeof ROUTE_NAMES.notFound> => ({
    name: ROUTE_NAMES.notFound,
  }),
  [ROUTE_NAMES.internalError]: (): NoParamsRouteState<typeof ROUTE_NAMES.internalError> => ({
    name: ROUTE_NAMES.internalError,
  }),
} as const;

export type AppRouteState = ReturnType<(typeof routerBuilder)[AppRouteName]>;
