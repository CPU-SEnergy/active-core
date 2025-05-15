import { useState } from "react";
import { z } from "zod";
import { step1Schema, step2Schema } from "@/lib/schema/auth/register-info";
import { RegisterFormProps } from "@/lib/types/registerForm";

export const useRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<RegisterFormProps>({
    email: "",
    password: "",
    confirmation: "",
    firstName: "",
    lastName: "",
    dob: "",
    sex: "",
    phoneNumber: "", // Added missing phoneNumber property
  });
  const [error, setError] = useState("");

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleNextStep = (
    event: React.FormEvent,
    options?: { backAction?: boolean }
  ) => {
    event.preventDefault();

    if (options?.backAction) {
      setStep((prevStep) => Math.max(prevStep - 1, 1));
      return;
    }

    try {
      step1Schema.parse({
        email: formState.email,
        password: formState.password,
        confirmation: formState.confirmation,
      });
      setError("");
      setStep(2);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0]?.message || "Validation error");
      }
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      step2Schema.parse({
        firstName: formState.firstName,
        lastName: formState.lastName,
        dob: formState.dob,
        sex: formState.sex,
      });
      setError("");
      return { formState };
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0]?.message || "Validation error");
      } else {
        setError("An error occurred during sign-up.");
      }
    }
  };

  return {
    step,
    formState,
    error,
    handleChange,
    handleNextStep,
    handleSignUp,
  };
};
