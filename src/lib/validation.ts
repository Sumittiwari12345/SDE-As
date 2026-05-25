import { z } from "zod";

export const listCollegesSchema = z.object({
  search: z.string().trim().optional().default(""),
  city: z.string().trim().optional().default(""),
  minFees: z.coerce.number().int().min(0).optional(),
  maxFees: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(24).optional().default(6)
});

export const compareSchema = z.object({
  collegeA: z.string().min(1),
  collegeB: z.string().min(1)
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required")
});

export const favoriteSchema = z.object({
  collegeId: z.string().min(1)
});
