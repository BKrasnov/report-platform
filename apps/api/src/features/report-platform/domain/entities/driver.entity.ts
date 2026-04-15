import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { MedicalCheck } from './medical-check.entity';

@Entity({ name: 'drivers' })
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.drivers, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @Column({ name: 'full_name', type: 'varchar', length: 200 })
  fullName!: string;

  @Column({ name: 'personnel_number', type: 'varchar', length: 64 })
  personnelNumber!: string;

  @OneToMany(() => MedicalCheck, (medicalCheck) => medicalCheck.driver)
  medicalChecks!: MedicalCheck[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
