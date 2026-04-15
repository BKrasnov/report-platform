import type { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exceptions/http-exception.filter';
import { setupPipes } from './pipes.setup';
import { setupSwagger } from './swagger.setup';

export function setupApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  setupPipes(app);
  setupSwagger(app);
}
