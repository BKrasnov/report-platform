import { ValidationPipe } from '@nestjs/common';
import type { ArgumentMetadata } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { CreateReportRunDto } from './create-report-run.dto';
import { ListReportRunsQueryDto } from './list-report-runs-query.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  transform: true,
});

function metadata(
  metatype: new () => unknown,
  type: ArgumentMetadata['type'],
): ArgumentMetadata {
  return {
    type,
    metatype,
    data: '',
  };
}

describe('DTO validation with whitelist', () => {
  it('keeps report run body fields and strips unknown fields', async () => {
    const result = (await pipe.transform(
      {
        reportId: 'driver-medical-checks',
        name: '  April run  ',
        params: { from: '2024-01-01', to: '2024-12-31' },
        extra: 'ignore-me',
      },
      metadata(CreateReportRunDto, 'body'),
    )) as CreateReportRunDto;

    expect(result.reportId).toBe('driver-medical-checks');
    expect(result.name).toBe('April run');
    expect(result.params).toEqual({ from: '2024-01-01', to: '2024-12-31' });
    expect(result).not.toHaveProperty('extra');
  });

  it('transforms query pagination fields to numbers', async () => {
    const result = (await pipe.transform(
      {
        status: 'queued',
        reportId: 'driver-medical-checks',
        limit: '10',
        offset: '2',
        extra: 'ignore-me',
      },
      metadata(ListReportRunsQueryDto, 'query'),
    )) as ListReportRunsQueryDto;

    expect(result.status).toBe('queued');
    expect(result.reportId).toBe('driver-medical-checks');
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(2);
    expect(result).not.toHaveProperty('extra');
  });

  it('rejects empty and too long names in create body', async () => {
    await expect(
      pipe.transform(
        {
          reportId: 'driver-medical-checks',
          name: '   ',
          params: {},
        },
        metadata(CreateReportRunDto, 'body'),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      pipe.transform(
        {
          reportId: 'driver-medical-checks',
          name: 'a'.repeat(121),
          params: {},
        },
        metadata(CreateReportRunDto, 'body'),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
