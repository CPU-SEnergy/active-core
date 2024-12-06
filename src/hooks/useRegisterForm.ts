import { useState } from "react";
import { z } from "zod";
import { step1Schema, step2Schema } from "@/lib/schema/auth/register-info";

export const useRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmation: "",
    firstName: "",
    lastName: "",
    dob: "",
    sex: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleNextStep = (event: React.FormEvent) => {
    event.preventDefault();
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
        setError(e.errors[0].message);
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
      setLoading(true);
      return { formState, loading };
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else {
        setError("An error occurred during sign-up.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    formState,
    error,
    loading,
    handleChange,
    handleNextStep,
    handleSignUp,
  };
};
