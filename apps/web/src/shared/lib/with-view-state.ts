import type { ComponentType, ReactNode } from 'react';
import { createElement } from 'react';

export type ViewState = 'loading' | 'ready' | 'empty' | 'error' | 'not_found';

export type WithViewStateProps = {
  state?: ViewState;
};

export type WithViewStateOptions = {
  loading?: ReactNode;
  empty?: ReactNode;
  error?: ReactNode;
  notFound?: ReactNode;
};

export function withViewState<P extends object>(
  Component: ComponentType<P>,
  options: WithViewStateOptions = {}
) {
  const Wrapped = (props: P & WithViewStateProps): ReactNode => {
    const { state = 'ready', ...restProps } = props;

    if (state === 'loading') {
      return options.loading ?? null;
    }

    if (state === 'empty') {
      return options.empty ?? null;
    }

    if (state === 'error') {
      return options.error ?? null;
    }

    if (state === 'not_found') {
      return options.notFound ?? null;
    }

    return createElement(Component, restProps as P);
  };

  return Wrapped;
}
