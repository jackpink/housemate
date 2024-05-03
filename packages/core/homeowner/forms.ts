import { z, ZodError } from "zod";
import { AuthError } from "next-auth";
import { ItemCategory, ItemStatus } from "../db/schema";

/* 
**********************************************
Generic Form Handlers
**********************************************
*/
export type FormState = {
  error: boolean;
  message?: string;
  fieldErrors: Record<string, string[] | undefined>;
};

export const emptyFormState: FormState = {
  error: false,
  message: "",
  fieldErrors: {},
};

export const fromErrorToFormState = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      error: true,
      message: "There are errors in the form",
      fieldErrors: error.flatten().fieldErrors,
    };
  } else if (error instanceof Error) {
    return {
      error: true,
      message: error.message,
      fieldErrors: {},
    };
  } else {
    return {
      error: true,
      message: "An unknown error occurred",
      fieldErrors: {},
    };
  }
};

/* 
**********************************************
Schemas
**********************************************
*/

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MIN_LENGTH = 8;
const FIELD_VALIDATION = {
  TEST: {
    SPECIAL_CHAR: (value: string) =>
      /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
    LOWERCASE: (value: string) => /[a-z]/.test(value),
    UPPERCASE: (value: string) => /[A-Z]/.test(value),
    NUMBER: (value: string) => /.*[0-9].*/.test(value),
  },
  MSG: {
    MIN_LEN: `Password must have ${MIN_LENGTH} characters`,
    SPECIAL_CHAR: "Password must contain atleast one special character",
    LOWERCASE: "Password must contain at least one lowercase letter",
    UPPERCASE: "Password must contain at least one uppercase letter",
    NUMBER: "Password must contain at least one number",
    MATCH: "Password must match",
  },
};

const passwordPatterns = z
  .string()
  .min(MIN_LENGTH, {
    message: FIELD_VALIDATION.MSG.MIN_LEN,
  })
  .refine(FIELD_VALIDATION.TEST.SPECIAL_CHAR, FIELD_VALIDATION.MSG.SPECIAL_CHAR)
  .refine(FIELD_VALIDATION.TEST.LOWERCASE, FIELD_VALIDATION.MSG.LOWERCASE)
  .refine(FIELD_VALIDATION.TEST.UPPERCASE, FIELD_VALIDATION.MSG.UPPERCASE)
  .refine(FIELD_VALIDATION.TEST.NUMBER, FIELD_VALIDATION.MSG.NUMBER);

export const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: passwordPatterns,
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addItemSchema = z.object({
  title: z.string().min(1),
  status: z.nativeEnum(ItemStatus),
  category: z.nativeEnum(ItemCategory),
  homeownerId: z.string(),
  propertyId: z.string(),
});
