import { MedicalCheckStatus } from '../../features/report-platform/domain/entities/medical-check.entity';

export const medicalChecksSeed = [
  {
    personnelNumber: 'NL-001',
    checkedAt: '2026-04-01T06:30:00.000Z',
    status: MedicalCheckStatus.allowed,
    doctorName: 'Dr. Morozova',
    notes: null,
  },
  {
    personnelNumber: 'NL-002',
    checkedAt: '2026-04-02T06:45:00.000Z',
    status: MedicalCheckStatus.needsReview,
    doctorName: 'Dr. Morozova',
    notes: 'Repeated pressure measurement required',
  },
  {
    personnelNumber: 'VT-001',
    checkedAt: '2026-04-03T07:00:00.000Z',
    status: MedicalCheckStatus.rejected,
    doctorName: 'Dr. Pavlov',
    notes: 'High temperature',
  },
  {
    personnelNumber: 'ME-001',
    checkedAt: '2026-04-04T07:15:00.000Z',
    status: MedicalCheckStatus.allowed,
    doctorName: 'Dr. Sokolova',
    notes: null,
  },
  {
    personnelNumber: 'NL-001',
    checkedAt: '2026-04-05T06:25:00.000Z',
    status: MedicalCheckStatus.allowed,
    doctorName: 'Dr. Pavlov',
    notes: null,
  },
  {
    personnelNumber: 'VT-001',
    checkedAt: '2026-04-06T06:50:00.000Z',
    status: MedicalCheckStatus.allowed,
    doctorName: 'Dr. Morozova',
    notes: null,
  },
  {
    personnelNumber: 'ME-001',
    checkedAt: '2026-04-07T07:05:00.000Z',
    status: MedicalCheckStatus.needsReview,
    doctorName: 'Dr. Sokolova',
    notes: 'Manual review requested',
  },
  {
    personnelNumber: 'NL-002',
    checkedAt: '2026-04-08T06:40:00.000Z',
    status: MedicalCheckStatus.allowed,
    doctorName: 'Dr. Pavlov',
    notes: null,
  },
];
