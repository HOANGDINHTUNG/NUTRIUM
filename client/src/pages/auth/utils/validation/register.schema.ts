import { z } from "zod";
import { REGEX } from "../../../../constants/regex";

export const RegisterSchema = z.object({
  email: z.string().min(1, "emailRequired").regex(REGEX.EMAIL, "emailInvalid"),
  username: z.string().min(1, "usernameRequired").min(3, "usernameShort"),
  password: z
    .string()
    .min(1, "passwordRequired")
    .refine((v) => v.length >= 8, "passwordPolicy")
    .refine((v) => /[a-z]/.test(v), "passwordPolicy")
    .refine((v) => /[A-Z]/.test(v), "passwordPolicy")
    .refine((v) => /\d/.test(v), "passwordPolicy")
    .refine((v) => /[^A-Za-z0-9]/.test(v), "passwordPolicy"),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
export type RegisterErrors = Partial<Record<keyof RegisterData, string>>;
