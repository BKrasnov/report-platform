import { z } from 'zod';

export const companySummaryParamsSchema = z
  .object({
    from: z.string().date(),
    to: z.string().date(),
    companyId: z.string().uuid().optional(),
  })
  .refine((value) => value.from <= value.to, {
    message: '`from` must be before or equal to `to`',
    path: ['from'],
  });

export type CompanySummaryParams = z.infer<typeof companySummaryParamsSchema>;
