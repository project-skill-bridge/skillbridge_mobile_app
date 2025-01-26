import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z
    .string()
    .trim()
    .min(10, { message: "Mobile number is required" })
    .regex(/^[0-9]{10}$/, { message: "Invalid mobile number" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Minimum 6 characters required" }),
});

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  mobile: z
    .string()
    .trim()
    .min(10, { message: "Mobile number is required" })
    .regex(/^[0-9]{10}$/, { message: "Invalid mobile number" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Minimum 6 characters required" }),
});

export type RegisterFormType = z.infer<typeof RegisterSchema>;
export type LoginFormType = z.infer<typeof LoginSchema>;
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;
