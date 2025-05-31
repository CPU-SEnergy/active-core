import { z } from "zod"
import { isValidPhoneNumber } from 'libphonenumber-js'
import { checkEmailExists } from "@/utils/firebase/firebaseAuthOperations"


export const registerSchemaBase = z.object({
    
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmation: z.string(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces"),
  phoneNumber: z
    .string()
    .refine((val) => {
      if (!val) return true
      try {
        return isValidPhoneNumber(val)
      } catch {
        return false
      }
    }, "Please enter a valid phone number with country code (e.g. +63)")
    .optional(),
  dob: z.string()
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      return selectedDate <= today
    }, "Invalid date of birth. Please select a valid date.")
    .transform((date) => new Date(date)),
  sex: z.enum(["male", "female", "other"], {
    required_error: "Please select your sex",
  }),
  isCustomer: z.boolean().default(false),
})

export const step1Schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: registerSchemaBase.shape.password,
  confirmation: z.string()
}).refine((data) => data.password === data.confirmation, {
  message: "Passwords do not match",
  path: ["confirmation"],
})

export const registerSchema = registerSchemaBase
  .extend({
    email: z.string()
      .email("Please enter a valid email address")
      .refine(
        async (email) => !(await checkEmailExists(email)),
        "This email is already registered. Please use a different email."
      )
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Passwords do not match",
    path: ["confirmation"],
  })