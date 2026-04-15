import type { MouseEvent } from 'react';
import {
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { RunsTableProps } from '../model/types';

import { ReportRun, reportRunModel } from '@/entities/report-run';
import { getReportTitle, getRunDisplayName } from '@/shared/lib/report-localization';
import { withViewState } from '@/shared/lib/with-view-state';

const hasModifier = (event: MouseEvent<HTMLElement>): boolean =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const isAnchorClick = (event: MouseEvent<HTMLElement>): boolean => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.closest('a') !== null;
};

const RunsTableBase = ({
  runs,
  getRunDetailsHref,
  openRunDetails,
}: Omit<RunsTableProps, 'isLoading'>): JSX.Element => {
  if (runs.length === 0) {
    return <Typography color="text.secondary">Запуски пока отсутствуют.</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small" sx={{ minWidth: 880 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID запуска</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Отчет</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Создан</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow
              key={run.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={(event) => {
                if (event.defaultPrevented) return;
                if (event.button !== 0) return;
                if (hasModifier(event)) return;
                if (isAnchorClick(event)) return;

                void openRunDetails(run.id);
              }}
            >
              <TableCell>
                <MuiLink
                  href={getRunDetailsHref(run.id)}
                  underline="hover"
                  onClick={(event) => {
                    if (event.defaultPrevented) return;
                    if (event.button !== 0) return;
                    if (hasModifier(event)) return;

                    event.preventDefault();
                    void openRunDetails(run.id);
                  }}
                >
                  {run.id}
                </MuiLink>
              </TableCell>
              <TableCell>{getRunDisplayName(run)}</TableCell>
              <TableCell>{getReportTitle(run.reportId)}</TableCell>
              <TableCell>
                <ReportRun.StatusChip
                  size="small"
                  status={run.status}
                  label={reportRunModel.model.getStatusLabel(run.status)}
                />
              </TableCell>
              <TableCell>{new Date(run.createdAt).toLocaleString('ru-RU')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const RunsTable = withViewState(RunsTableBase, {
  loading: <Typography color="text.secondary">Загружаем запуски...</Typography>,
});
