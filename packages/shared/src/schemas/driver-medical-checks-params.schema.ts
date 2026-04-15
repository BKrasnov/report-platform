import { z } from 'zod';

export const driverMedicalChecksParamsSchema = z
  .object({
    from: z.string().date(),
    to: z.string().date(),
    companyId: z.string().uuid().optional(),
  })
  .refine((value) => value.from <= value.to, {
    message: '`from` must be before or equal to `to`',
    path: ['from'],
  });

export type DriverMedicalChecksParams = z.infer<
  typeof driverMedicalChecksParamsSchema
>;
