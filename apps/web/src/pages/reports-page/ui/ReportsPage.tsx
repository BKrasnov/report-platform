import { useEffect } from 'react';
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { ViewModelParams } from 'mobx-view-model';
import { type ViewModelProps, withViewModel } from 'mobx-view-model-react';

import { useRouter } from '@/app/providers/router';
import { companyModel } from '@/entities/company';
import { reportModel } from '@/entities/report';
import { reportRunModel } from '@/entities/report-run';
import { ReportsPageVM } from '@/pages/reports-page/model/ReportsPageVM';
import { type PluralForms, pluralWithCount } from '@/shared/lib/plural';
import { type ViewState } from '@/shared/lib/with-view-state';
import { PageSection } from '@/shared/ui';
import { AppIcons } from '@/shared/ui';
import { Report } from '@/widgets/report';

const templateWordForms: PluralForms = ['шаблон', 'шаблона', 'шаблонов'];

type ReportsPageProps = ViewModelProps<ReportsPageVM>;

const config = {
  factory: (vmParams: ViewModelParams<Record<string, never>>) =>
    new ReportsPageVM(
      {
        reportsStore: reportModel.state,
        companiesStore: companyModel.state,
        createRun: reportRunModel.api.create,
      },
      vmParams
    ),
};

const ReportsPage = withViewModel(
  ReportsPageVM,
  ({ model: vm }: ReportsPageProps): JSX.Element => {
    const { router } = useRouter();

    const reportCount = vm.reports.length;

    const reportsListState: ViewState = (() => {
      if (vm.isLoading) return 'loading';
      if (reportCount === 0) return 'empty';

      return 'ready';
    })();

    useEffect(() => {
      vm.setRedirect((state) => router.redirect(state));
    }, [vm, router]);

    return (
      <PageSection title="Отчеты" subtitle="Создавайте и запускайте отчеты из готовых шаблонов.">
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderColor: '#d4daf4',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            alignItems: { xs: 'stretch', md: 'end' },
            gap: 2,
          }}
        >
          <Stack spacing={1.25}>
            <Typography
              component="p"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                color: 'primary.dark',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              <AppIcons.Sparkles size={16} />
              Центр управления отчетами
            </Typography>

            <Typography variant="h2">Быстрый запуск и предсказуемый результат</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Выберите диапазон дат и компанию, затем сразу переходите к отслеживанию выполнения и
              скачиванию файла.
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Chip
              icon={<AppIcons.Layers3 size={16} />}
              label={pluralWithCount(reportCount, templateWordForms)}
              sx={{
                px: 1.2,
                py: 0.35,
                justifyContent: 'flex-start',
                borderRadius: 10,
                bgcolor: 'primary.light',
                color: 'primary.dark',
                fontWeight: 800,
                border: '1px solid rgba(68, 90, 227, 0.2)',
              }}
            />
            <Chip
              icon={<AppIcons.GaugeCircle size={16} />}
              label="Ручное обновление статуса"
              sx={{
                px: 1.2,
                py: 0.35,
                justifyContent: 'flex-start',
                borderRadius: 10,
                bgcolor: 'primary.light',
                color: 'primary.dark',
                fontWeight: 800,
                border: '1px solid rgba(68, 90, 227, 0.2)',
              }}
            />
          </Stack>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', xl: '460px minmax(0, 1fr)' },
          }}
        >
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#fbfcff' }}>
            <Stack spacing={1.5}>
              <Stack spacing={0.5}>
                <Typography variant="h2">Новый запуск</Typography>
                <Typography color="text.secondary">
                  Выберите тип отчета и параметры периода.
                </Typography>
              </Stack>

              <Report.Create.Form
                companies={vm.companies}
                isSubmitting={vm.isSubmitting}
                onCreateRun={vm.createRun}
              />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#fbfcff' }}>
            <Stack spacing={1.5}>
              <Stack spacing={0.5}>
                <Typography variant="h2">Доступные отчеты</Typography>
                <Typography color="text.secondary">
                  Форматы и назначение каждого шаблона.
                </Typography>
              </Stack>
              <Report.View.List reports={vm.reports} state={reportsListState} />
            </Stack>
          </Paper>
        </Box>

        {vm.error && <Alert severity="error">{vm.error}</Alert>}
      </PageSection>
    );
  },
  config
);

export default ReportsPage;
