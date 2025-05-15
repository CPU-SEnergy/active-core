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

export default function RegisterPageClient() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { step, formState, error, handleChange, handleNextStep, handleSignUp } = useRegisterForm()

  // Simplified back button handler
  const handleBackStep = (e: React.MouseEvent) => {
    e.preventDefault()

    // Directly call handleNextStep with a back action indicator
    handleNextStep(e, { backAction: true })
  }

  // Update the back button to use handleBackStep
  const backButtonRef = React.useRef<HTMLButtonElement>(null)
  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const result = await handleSignUp(event)
    if (!result) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return
    }
    const { formState: formResult } = result

    setLoading(true)

    try {
      const res = await createFirebaseUser(formResult)

      if (!res.success) {
        throw new Error("An error occurred during sign-up.")
      }

      setLoading(false)

      router.refresh()
      router.push("/")
    } catch (e) {
      setLoading(false)
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

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
                ref={backButtonRef}
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
              <form onSubmit={handleNextStep} className="space-y-4 flex flex-col">
                <div className="space-y-2 mb-6">
                  <InputText
                    id="email"
                    label="Email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange("email")}
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <InputText
                    id="password"
                    label="Password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange("password")}
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <InputText
                    id="confirmation"
                    label="Confirm Password"
                    type="password"
                    value={formState.confirmation}
                    onChange={handleChange("confirmation")}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

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

                {error && <p className="text-sm text-red-500">{error}</p>}

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
              <Link className="text-blue-500 hover:text-blue-600" href="/auth/login">
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
