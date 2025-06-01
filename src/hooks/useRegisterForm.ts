/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { step1Schema, step2Schema } from "@/lib/schema/auth/registerSchema";
import type { RegisterFormProps } from "@/lib/types/registerForm";

export function useRegisterForm() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<RegisterFormProps>({
    email: "",
    password: "",
    confirmation: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    sex: "",
  });

  const handleChange =
    (field: keyof RegisterFormProps) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) => {
      // Clear error when user starts typing
      if (error) setError(null);

      const value = typeof e === "string" ? e : e.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleNextStep = async (
    e: React.FormEvent,
    options?: { backAction?: boolean }
  ) => {
    e.preventDefault();

    if (options?.backAction) {
      setStep(1);
      return;
    }

    try {
      // Validate step 1 data
      const result = step1Schema.safeParse(formState);
      if (!result.success) {
        const formattedErrors = result.error.format();

        // Get the first error message
        const firstError =
          formattedErrors.email?._errors?.[0] ||
          formattedErrors.password?._errors?.[0] ||
          formattedErrors.confirmation?._errors?.[0] ||
          "Please check your form inputs";

        setError(firstError);
        return;
      }

      // If validation passes, move to step 2
      setStep(2);
    } catch (err) {
      setError("An error occurred. Please check your inputs.");
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Validate step 2 data
      const step2Data = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        dob: formState.dob,
        sex: formState.sex,
        phone: formState.phoneNumber || "",
      };

      const result = step2Schema.safeParse(step2Data);
      if (!result.success) {
        const formattedErrors = result.error.format();

        // Get the first error message
        const firstError =
          formattedErrors.firstName?._errors?.[0] ||
          formattedErrors.lastName?._errors?.[0] ||
          formattedErrors.dob?._errors?.[0] ||
          formattedErrors.sex?._errors?.[0] ||
          formattedErrors.phone?._errors?.[0] ||
          "Please check your form inputs";

        setError(firstError);
        return null;
      }

      // Return the validated form data
      return { formState };
    } catch (err) {
      setError("An error occurred. Please check your inputs.");
      return null;
    }
  };

  // Add a method to set external errors (like from Firebase)
  const setExternalError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return {
    step,
    formState,
    error,
    handleChange,
    handleNextStep,
    handleSignUp,
    setExternalError,
  };
}
