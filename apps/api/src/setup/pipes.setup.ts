import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';

export function setupPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
}
