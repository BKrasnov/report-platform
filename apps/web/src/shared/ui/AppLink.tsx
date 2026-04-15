import type { MouseEvent, ReactNode } from 'react';
import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';

import { useRouter } from '@/app/providers/router';
import type { AppRouteState } from '@/shared/lib/router';

export type AppLinkProps<TTo extends AppRouteState = AppRouteState> = {
  to: TTo;
  children: ReactNode;
} & Omit<MuiLinkProps, 'href' | 'onClick' | 'children'>;

const hasModifier = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

export const AppLink = <TTo extends AppRouteState>({
  to,
  children,
  ...linkProps
}: AppLinkProps<TTo>): JSX.Element => {
  const { router } = useRouter();
  const href = router.stateToUrl(to);

  return (
    <MuiLink
      {...linkProps}
      href={href}
      underline={linkProps.underline ?? 'none'}
      color={linkProps.color ?? 'inherit'}
      onClick={(event) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (hasModifier(event)) return;

        event.preventDefault();
        void router.redirect(to);
      }}
    >
      {children}
    </MuiLink>
  );
};
