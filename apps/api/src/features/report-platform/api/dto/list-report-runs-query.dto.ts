import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListReportRunsQueryDto {
  @ApiPropertyOptional({ example: 'queued' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'driver-medical-checks' })
  @IsOptional()
  @IsString()
  reportId?: string;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
