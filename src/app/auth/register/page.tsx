"use client";

import React, { useState, FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { app } from "@/lib/firebaseClient";
import { InputText } from "@/components/auth/InputText";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const step1Schema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Passwords must match",
    path: ["confirmation"],
  });

const step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  sex: z.string().min(1, "Input sex is required")
});

export default function Register() {
  const router = useRouter()
  const { toast } = useToast()

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

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNextStep = (event: FormEvent) => {
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

  const handleSignUp = async (event: FormEvent) => {
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

      const userCredential = await createUserWithEmailAndPassword(
        getAuth(app),
        formState.email,
        formState.password
      );

      const res: Response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: formState.email,
          firstName: formState.firstName,
          lastName: formState.lastName,
          dob: formState.dob,
          sex: formState.sex
        })
      }
      )

      if (!res.ok) {
        throw new Error("An error occurred during sign-up.");
      }

      console.log("User created successfully");

      await sendEmailVerification(userCredential.user);

      toast({
        title: "Verification email sent!",
        description: "Please check your email to verify your account.",
      });

      console.log("Verification email sent!");
      router.push("/auth/login");
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


  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/pictures/sportsfitness.jpg')" }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex justify-center">
          {["Register", "Information"].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full ${step === index + 1
                  ? "border-2 border-gray-900 text-gray-900 font-bold"
                  : "border border-gray-300 text-gray-400"
                  }`}
              >
                <span className="text-xs">{index + 1}</span>
              </div>
              <span
                className={`ml-2 text-sm ${step === index + 1 ? "text-gray-900 font-medium" : "text-gray-400"
                  }`}
              >
                {label}
              </span>
              {index < 1 && <span className="mx-2 text-gray-400">→</span>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 flex flex-col">
            <h2 className="text-center text-xl font-semibold">Sign up to Sports and Fitness</h2>
            <InputText
              id="email"
              label="Email"
              type="email"
              value={formState.email}
              onChange={handleChange("email")}
            />
            <InputText
              id="password"
              label="Password"
              type="password"
              value={formState.password}
              onChange={handleChange("password")}
            />
            <InputText
              id="confirmation"
              label="Confirm Password"
              type="password"
              value={formState.confirmation}
              onChange={handleChange("confirmation")}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Next"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignUp} className="space-y-4 flex flex-col">
            <h2 className="text-center text-xl font-semibold">Enter Your Details</h2>
            <InputText
              id="firstName"
              label="First Name"
              value={formState.firstName}
              onChange={handleChange("firstName")}
            />
            <InputText
              id="lastName"
              label="Last Name"
              value={formState.lastName}
              onChange={handleChange("lastName")}
            />
            <InputText
              id="dob"
              label="Date of Birth"
              type="date"
              value={formState.dob}
              onChange={handleChange("dob")}
            />
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                Sex
              </label>
              <select
                id="sex"
                value={formState.sex}
                onChange={handleChange("sex")}
                className="w-full rounded-md border p-2"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
