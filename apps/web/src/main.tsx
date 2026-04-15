import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ViewModelsProvider } from 'mobx-view-model-react';

import { App } from '@/app/App';
import { getRouter, resolveInitialUrl, RouterContext } from '@/app/providers/router';
import { appTheme } from '@/app/styles/theme';
import { appViewModelsStore } from '@/shared/lib/view-model';

import '@/app/styles/global.css';

async function bootstrap(): Promise<void> {
  const router = getRouter();
  await router.init(resolveInitialUrl(window.location.href));

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ViewModelsProvider value={appViewModelsStore}>
        <RouterContext.Provider value={{ router }}>
          <App />
        </RouterContext.Provider>
      </ViewModelsProvider>
    </ThemeProvider>
  );
}

void bootstrap();
