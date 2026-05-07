import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "What should we call you?"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/\d/, "Include at least one number"),
  disclaimerAccepted: z
    .boolean()
    .refine((v) => v === true, "You need to accept the disclaimer"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export const DISCLAIMER_TEXT =
  "I understand JasonBot is a coaching tool, not a substitute for medical or psychiatric care, and I'll seek professional help in a crisis.";
