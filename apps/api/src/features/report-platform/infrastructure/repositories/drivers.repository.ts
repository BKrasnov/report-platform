import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../domain/entities/driver.entity';

@Injectable()
export class DriversRepository {
  constructor(
    @InjectRepository(Driver)
    private readonly repository: Repository<Driver>,
  ) {}

  findByCompanyId(companyId: string): Promise<Driver[]> {
    return this.repository.find({
      where: { companyId },
      order: { fullName: 'ASC' },
    });
  }
}
