import { MedicalCheckStatus } from '../features/report-platform/domain/entities/medical-check.entity';
import { companiesSeed } from './data/companies.seed';
import { driversSeed } from './data/drivers.seed';
import { medicalChecksSeed } from './data/medical-checks.seed';

describe('Seed data integrity', () => {
  it('keeps a non-empty deterministic dataset', () => {
    expect(companiesSeed.length).toBe(3);
    expect(driversSeed.length).toBe(4);
    expect(medicalChecksSeed.length).toBe(8);
  });

  it('has unique company names', () => {
    const names = companiesSeed.map((company) => company.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('maps each driver to an existing company and keeps personnel numbers unique', () => {
    const companyNames = new Set(companiesSeed.map((company) => company.name));
    const personnelNumbers = driversSeed.map((driver) => driver.personnelNumber);

    for (const driver of driversSeed) {
      expect(companyNames.has(driver.companyName)).toBe(true);
    }

    expect(new Set(personnelNumbers).size).toBe(personnelNumbers.length);
  });

  it('keeps medical checks linked, dated, and deduplicated', () => {
    const knownPersonnelNumbers = new Set(
      driversSeed.map((driver) => driver.personnelNumber),
    );
    const knownStatuses = new Set(Object.values(MedicalCheckStatus));
    const uniqueCheckKeys = new Set<string>();

    for (const check of medicalChecksSeed) {
      expect(knownPersonnelNumbers.has(check.personnelNumber)).toBe(true);
      expect(knownStatuses.has(check.status)).toBe(true);

      const checkedAt = new Date(check.checkedAt);
      expect(Number.isNaN(checkedAt.getTime())).toBe(false);

      const uniqueKey = `${check.personnelNumber}|${check.checkedAt}`;
      expect(uniqueCheckKeys.has(uniqueKey)).toBe(false);
      uniqueCheckKeys.add(uniqueKey);
    }
  });
});
