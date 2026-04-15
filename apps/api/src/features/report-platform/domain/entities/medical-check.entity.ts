import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

export enum MedicalCheckStatus {
  allowed = 'allowed',
  rejected = 'rejected',
  needsReview = 'needs_review',
}

@Entity({ name: 'medical_checks' })
export class MedicalCheck {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'driver_id', type: 'uuid' })
  driverId!: string;

  @ManyToOne(() => Driver, (driver) => driver.medicalChecks, {
    nullable: false,
  })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;

  @Column({ name: 'checked_at', type: 'timestamptz' })
  checkedAt!: Date;

  @Column({ type: 'enum', enum: MedicalCheckStatus })
  status!: MedicalCheckStatus;

  @Column({ name: 'doctor_name', type: 'varchar', length: 200 })
  doctorName!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
