import { z } from "zod";
import parsePhoneNumber from "libphonenumber-js";

const today = new Date();
const hundredYearsAgo = new Date(
  today.getFullYear() - 100,
  today.getMonth(),
  today.getDate()
);
const oneYearAgo = new Date(
  today.getFullYear() - 1,
  today.getMonth(),
  today.getDate()
);

export const step1Schema = z
  .object({
    email: z
      .string()
      .min(5, "Email must be at least 5 characters")
      .max(254, "Email must be at most 254 characters")
      .email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Passwords must match",
    path: ["confirmation"],
  });

export const step2Schema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be at most 50 characters"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= hundredYearsAgo && date <= oneYearAgo, {
      message: "Age must be between 1 and 100 years",
    }),
  sex: z
    .string()
    .min(1, "Input sex is required")
    .max(10, "Sex must be at most 10 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length === 11;
      },
      {
        message: "Phone number must be exactly 11 digits",
      }
    )
    .refine(
      (value) => {
        // Remove all non-digit characters and check if it starts with 09
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.startsWith("09");
      },
      {
        message: "Phone number must start with 09",
      }
    )
    .transform((value, ctx) => {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");

      // Double-check length and format
      if (digitsOnly.length !== 11 || !digitsOnly.startsWith("09")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Invalid Philippine phone number (must be 11 digits starting with 09)",
        });
        return z.NEVER;
      }

      const phoneNumber = parsePhoneNumber(`+63${digitsOnly.slice(1)}`, "PH");

      if (!phoneNumber?.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Philippine phone number",
        });
        return z.NEVER;
      }

      return phoneNumber.formatInternational();
    }),
});
