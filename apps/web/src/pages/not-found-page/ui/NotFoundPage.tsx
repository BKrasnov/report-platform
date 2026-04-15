import { Paper, Stack, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Страница не найдена
        </Typography>
        <Typography color="text.secondary">Запрошенная страница не существует.</Typography>
      </Paper>
    </Stack>
  );
}
