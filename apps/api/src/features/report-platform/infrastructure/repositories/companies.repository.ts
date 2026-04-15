import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../domain/entities/company.entity';

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {}

  findAll(): Promise<Company[]> {
    return this.repository.find({ order: { name: 'ASC' } });
  }

  findById(id: string): Promise<Company | null> {
    return this.repository.findOne({ where: { id } });
  }
}
