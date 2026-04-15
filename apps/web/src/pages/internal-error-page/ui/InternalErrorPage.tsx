import { Paper, Stack, Typography } from '@mui/material';

export default function InternalErrorPage() {
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Внутренняя ошибка
        </Typography>
        <Typography color="text.secondary">Произошла ошибка при обработке навигации.</Typography>
      </Paper>
    </Stack>
  );
}
