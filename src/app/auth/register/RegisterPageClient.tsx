"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { InputText } from "@/components/InputText"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRegisterForm } from "@/hooks/useRegisterForm"
import { createFirebaseUser } from "@/utils/firebase/firebaseAuthOperations"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"
import { useRedirectParam } from "@/app/shared/useRedirectParam"
import { appendRedirectParam } from "@/app/shared/redirect"
import { registerSchema } from "@/lib/zod/schemas/register"
import { z } from "zod"
import { checkEmailExists } from "@/utils/firebase/firebaseAuthOperations"

export default function RegisterPageClient() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { step, formState, handleChange, handleNextStep: formHandleNextStep } = useRegisterForm()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const redirect = useRedirectParam();
  const [step1Error, setStep1Error] = React.useState<string | null>(null);
  const [step2Error, setStep2Error] = React.useState<string | null>(null);


  function setError(message: string, step: number) {
    if (step === 1) {
      setStep1Error(message);
      setStep2Error(null); 
    } else {
      setStep2Error(message);
      setStep1Error(null); 
    }
  }


  const handleBackStep = (e: React.MouseEvent) => {
    e.preventDefault()
    formHandleNextStep(e, { backAction: true })
  }


  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Final email existence check before submission
      const { exists, error } = await checkEmailExists(formState.email);
      
      if (error) {
        setError(error, 2);
        setLoading(false);
        return;
      }
      
      if (exists) {
        setError("This email is already registered. Please use a different email.", 2);
        setLoading(false);
        return;
      }

      // Validate all form data
      try {
        await registerSchema.parseAsync(formState)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.errors[0]?.message || "Validation error", 2)
        } else {
          setError("Validation error", 2)
        }
        setLoading(false)
        return
      }
      
      // Create user if all validations pass
      const res = await createFirebaseUser({
        ...formState,
        phoneNumber: formState.phoneNumber || "",
        dob: formState.dob,
      })

      if (!res.success) {
        throw new Error("An error occurred during sign-up.")
      }

      router.push(redirect ?? "/")
      router.refresh()
    } catch (error) {
      setLoading(false)
      console.error('Signup error:', error);
      
      if (error instanceof Error && error.message.includes("auth/email-already-in-use")) {
        setError("This email is already registered. Please use a different email.", 2)
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred during sign-up",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false);
    }
  }

  // Update localHandleNextStep to store email validation result
  const localHandleNextStep = async (event: React.FormEvent, options?: { backAction?: boolean }) => {
    event.preventDefault();
    
    if (options?.backAction) {
      formHandleNextStep(event, { backAction: true });
      return;
    }

    try {
      // First validate email format
      const emailSchema = z.object({
        email: z.string().email("Please enter a valid email address"),
      });

      const emailResult = emailSchema.safeParse({ email: formState.email });
      if (!emailResult.success) {
        setError("Please enter a valid email address", 1);
        return;
      }

      // Double check if email exists before proceeding
      const emailCheck = await checkEmailExists(formState.email);
      if (emailCheck.exists === true) { // Explicit check for true
        setError("This email is already registered. Please use a different email.", 1);
        return;
      }

      // Validate password fields
      const passwordValidation = z.object({
        password: z.string()
          .min(8, "Password must be at least 8 characters")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          ),
        confirmation: z.string()
      }).refine((data) => data.password === data.confirmation, {
        message: "Passwords do not match",
        path: ["confirmation"],
      });

      const passwordResult = passwordValidation.safeParse(formState);
      if (!passwordResult.success) {
        setError(passwordResult.error.errors[0]?.message || "Invalid password", 1);
        return;
      }

      // If all validations pass, proceed to next step
      formHandleNextStep(event);
    } catch (error) {
      console.error("Validation error:", error);
      setError("An unexpected error occurred. Please try again.", 1);
    }
  }

  // Update the handleInputChange function for correct email validation
  const handleInputChange = (field: string) => async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    handleChange(field)(e);

    // Clear errors when input changes
    if (step === 1) {
      setStep1Error(null);
    } else {
      setStep2Error(null);
    }

    // Only validate email when the field is email and has a valid format
    if (field === 'email' && value) {
      try {
        const emailSchema = z.string().email("Please enter a valid email address");
        const emailResult = emailSchema.safeParse(value);
        
        if (emailResult.success) {
          const { exists, error } = await checkEmailExists(value);
          
          if (error) {
            console.error('Email check error:', error);
            return;
          }
          
          if (exists) {
            setStep1Error("This email is already registered. Please use a different email.");
          }
        }
      } catch (error) {
        console.error('Email validation error:', error);
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(119.97deg, #F3F4F6FF 0%, #D8DBE0FF 78%, #DEE1E6FF 100%)",
      }}
    >
      <Card className="w-full max-w-sm md:max-w-5xl h-auto flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-xl">
        <CardContent className="flex-1 p-6">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {step === 2 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackStep}
                className="mb-2 p-0 h-auto flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Button>
            )}

            <h1 className="text-center text-2xl md:text-4xl font-bold tracking-tighter md:my-6">
              {step === 1 ? "Sign Up" : "Your Details"}
            </h1>

            {step === 1 && (
              <form onSubmit={localHandleNextStep} className="space-y-4 flex flex-col">
                {/* Email field */}
                <div className="space-y-2">
                  <InputText
                    id="email"
                    label="Email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange("email")}
                    error={step1Error?.includes("registered") || step1Error?.includes("email") ? step1Error! : ""}
                  />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <div className="relative">
                    <InputText
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={formState.password}
                      onChange={handleInputChange("password")}
                      error={step1Error?.includes("least") || step1Error?.includes("uppercase") ? step1Error! : ""}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowPassword(!showPassword)
                      }}
                      className="absolute right-3 top-11 -translate-y-1 text-gray-500 hover:text-gray-700 z-10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-2 mb-6">
                  <div className="relative">
                    <InputText
                      id="confirmation"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formState.confirmation}
                      onChange={handleInputChange("confirmation")}
                      error={step1Error?.includes("match") ? step1Error! : ""}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowConfirmPassword(!showConfirmPassword)
                      }}
                      className="absolute right-3 top-12 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full py-3 md:py-6">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4 flex flex-col">
                <div className="space-y-2 mb-4">
                  <InputText
                    id="firstName"
                    label="First Name"
                    value={formState.firstName}
                    onChange={handleChange("firstName")}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <InputText
                    id="lastName"
                    label="Last Name"
                    value={formState.lastName}
                    onChange={handleChange("lastName")}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <InputText
                    id="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    placeholder="+1234567890"
                    value={formState.phoneNumber || ""}
                    onChange={handleChange("phoneNumber")}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <InputText
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    value={formState.dob}
                    onChange={handleChange("dob")}
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                    Sex
                  </label>
                  <select
                    id="sex"
                    value={formState.sex}
                    onChange={handleChange("sex")}
                    className="w-full rounded-md border p-2 h-10"
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {step2Error && <p className="text-sm text-red-500">{step2Error}</p>}

                <Button type="submit" disabled={loading} className="w-full py-3 md:py-6">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                className="text-blue-500 hover:text-blue-600"
                href={appendRedirectParam("/auth/login", redirect)}
              >
                Log in
              </Link>
            </p>
          </div>
        </CardContent>
        <div className="relative hidden md:flex bg-zinc-950 w-full md:w-1/2">
          <Image
            src="/pictures/IMAA Official no-bg.png"
            alt="Sports and Fitness"
            width={700}
            height={700}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-6"></div>
        </div>
      </Card>
    </div>
  )
}

