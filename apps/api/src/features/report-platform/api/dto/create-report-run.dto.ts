import { ApiProperty } from '@nestjs/swagger';
import { REPORT_IDS, type CreateReportRunRequest } from '@report-platform/shared';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReportRunDto implements CreateReportRunRequest {
  @ApiProperty({
    example: 'driver-medical-checks',
    enum: REPORT_IDS,
  })
  @IsEnum(REPORT_IDS)
  reportId!: CreateReportRunRequest['reportId'];

  @ApiProperty({
    example: 'April run',
    maxLength: 120,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: CreateReportRunRequest['name'];

  @ApiProperty({
    example: { from: '2024-01-01', to: '2024-01-31' },
    additionalProperties: true,
  })
  @IsDefined()
  @IsObject()
  params!: CreateReportRunRequest['params'];
}
