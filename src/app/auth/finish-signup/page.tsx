"use client";

import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { InputText } from "@/components/InputText";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { useToast } from "@/hooks/use-toast";
import { createUserInDatabase } from "@/utils/crud/createUser";
import Link from "next/link";
import { useState } from "react";

export default function FinishSignup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { step, formState, error, handleChange, handleNextStep, handleSignUp } =
    useRegisterForm();

  const router = useRouter();

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      router.push("/auth/expired-link");
    }
  }, [auth, router]);

  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const result = await handleSignUp(event);
    if (!result) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const { formState: formResult } = result;

    try {
      const userCredential = await signInWithEmailLink(
        auth,
        formResult.email,
        window.location.href
      );
      await updatePassword(userCredential.user, formResult.password);
      await createUserInDatabase({
        uid: userCredential.user.uid,
        email: formResult.email,
        firstName: formState.firstName,
        lastName: formResult.lastName,
        dob: formResult.dob,
        sex: formResult.sex,
      });

      const idToken = await userCredential.user.getIdToken();
      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      toast({
        title: "Sign Up Successful",
        description: "You will be redirected shortly",
      });

      setLoading(false);
      router.refresh();
      router.push("/");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/pictures/sportsfitness.jpg')" }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 flex flex-col">
            <h2 className="text-center text-xl font-semibold">
              Sign up to Sports and Fitness
            </h2>
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
          <form
            onSubmit={handleSignUpSubmit}
            className="space-y-4 flex flex-col"
          >
            <h2 className="text-center text-xl font-semibold">
              Enter Your Details
            </h2>
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
              <label
                htmlFor="sex"
                className="block text-sm font-medium text-gray-700"
              >
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
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-5 mb-3">
          Already have an account?{" "}
          <Link
            className="text-blue-500 hover:text-blue-600"
            href="/auth/login"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
