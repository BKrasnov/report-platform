import 'reflect-metadata';
import dataSource from '../database/data-source';
import { Company } from '../features/report-platform/domain/entities/company.entity';
import { Driver } from '../features/report-platform/domain/entities/driver.entity';
import { MedicalCheck } from '../features/report-platform/domain/entities/medical-check.entity';
import { companiesSeed } from './data/companies.seed';
import { driversSeed } from './data/drivers.seed';
import { medicalChecksSeed } from './data/medical-checks.seed';

async function seed(): Promise<void> {
  await dataSource.initialize();

  const companyRepository = dataSource.getRepository(Company);
  const driverRepository = dataSource.getRepository(Driver);
  const medicalCheckRepository = dataSource.getRepository(MedicalCheck);

  const companiesByName = new Map<string, Company>();

  for (const companySeed of companiesSeed) {
    let company = await companyRepository.findOneBy({ name: companySeed.name });

    if (!company) {
      company = await companyRepository.save(companyRepository.create(companySeed));
    }

    companiesByName.set(company.name, company);
  }

  const driversByPersonnelNumber = new Map<string, Driver>();

  for (const driverSeed of driversSeed) {
    const company = companiesByName.get(driverSeed.companyName);

    if (!company) {
      throw new Error(`Company not found for seed: ${driverSeed.companyName}`);
    }

    let driver = await driverRepository.findOneBy({
      personnelNumber: driverSeed.personnelNumber,
    });

    if (!driver) {
      driver = await driverRepository.save(
        driverRepository.create({
          companyId: company.id,
          fullName: driverSeed.fullName,
          personnelNumber: driverSeed.personnelNumber,
        }),
      );
    }

    driversByPersonnelNumber.set(driver.personnelNumber, driver);
  }

  for (const medicalCheckSeed of medicalChecksSeed) {
    const driver = driversByPersonnelNumber.get(medicalCheckSeed.personnelNumber);

    if (!driver) {
      throw new Error(
        `Driver not found for seed: ${medicalCheckSeed.personnelNumber}`,
      );
    }

    const checkedAt = new Date(medicalCheckSeed.checkedAt);
    const existing = await medicalCheckRepository.findOneBy({
      driverId: driver.id,
      checkedAt,
    });

    if (existing) {
      continue;
    }

    await medicalCheckRepository.save(
      medicalCheckRepository.create({
        driverId: driver.id,
        checkedAt,
        status: medicalCheckSeed.status,
        doctorName: medicalCheckSeed.doctorName,
        notes: medicalCheckSeed.notes,
      }),
    );
  }

  await dataSource.destroy();
}

seed().catch(async (error: unknown) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exitCode = 1;
});
