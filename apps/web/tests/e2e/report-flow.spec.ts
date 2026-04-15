import { expect, test } from '@playwright/test';

test('reports -> create run -> details -> manual refresh', async ({ page }) => {
  await page.route('**/api/companies', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'ООО Североатлантика ПП',
        },
      ]),
    });
  });

  await page.route('**/api/reports', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'driver-medical-checks',
          title: 'Driver Medical Checks',
          description: 'Driver health report',
          format: 'xlsx',
        },
      ]),
    });
  });

  await page.route('**/api/report-runs', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'run-1',
          reportId: 'driver-medical-checks',
          status: 'queued',
          params: {},
          resultFileName: null,
          resultContentType: null,
          errorMessage: null,
          startedAt: null,
          finishedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/report-runs/run-1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'run-1',
        reportId: 'driver-medical-checks',
        status: 'running',
        params: {
          from: '2026-01-01',
          to: '2026-01-31',
        },
        resultFileName: null,
        resultContentType: null,
        errorMessage: null,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
  });

  await page.goto('/reports');
  await page.getByTestId('report-select').selectOption('driver-medical-checks');
  await page
    .getByTestId('company-select')
    .selectOption('f47ac10b-58cc-4372-a567-0e02b2c3d479');
  await page.getByTestId('from-input').fill('2026-01-01');
  await page.getByTestId('to-input').fill('2026-01-31');
  await page.getByTestId('create-run-button').click();

  await expect(page).toHaveURL(/\/runs\/run-1$/);
  await page.getByTestId('run-refresh-button').click();
  await expect(page.getByTestId('run-status')).toHaveText('Выполняется');
});
