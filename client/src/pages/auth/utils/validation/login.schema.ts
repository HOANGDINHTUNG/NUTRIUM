import { z } from "zod";
import { REGEX } from "../../../../constants/regex";

export const LoginSchema = z.object({
  email: z.string().min(1, "emailRequired").regex(REGEX.EMAIL, "emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type LoginErrors = Partial<Record<keyof LoginData, string>>;
