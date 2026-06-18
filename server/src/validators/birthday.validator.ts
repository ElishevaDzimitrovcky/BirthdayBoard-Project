import { z } from "zod";

export const createBirthdaySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Birth date must be a valid date",
    }),
});

export const updateBirthdaySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .optional(),

  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Birth date must be a valid date",
    })
    .optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateBirthdayInput = z.infer<typeof createBirthdaySchema>;
export type UpdateBirthdayInput = z.infer<typeof updateBirthdaySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;