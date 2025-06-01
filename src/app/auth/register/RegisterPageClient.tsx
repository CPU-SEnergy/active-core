/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/InputText";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { createFirebaseUser } from "@/utils/firebase/firebaseAuthOperations";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRedirectParam } from "@/app/shared/useRedirectParam";
import { appendRedirectParam } from "@/app/shared/redirect";
import { Stepper } from "@/components/stepper";
import { cn } from "@/lib/utils";

export default function RegisterPageClient() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const {
    step,
    formState,
    error,
    handleChange,
    handleNextStep,
    handleSignUp,
    setExternalError,
  } = useRegisterForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const redirect = useRedirectParam();

  // Define steps for the stepper
  const steps = ["Account Setup", "Personal Details"];

  // Simplified back button handler
  const handleBackStep = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNextStep(e, { backAction: true });
  };

  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await handleSignUp(event);
    if (!result) {
      return; // Error is already set in the form
    }
    const { formState: formResult } = result;

    setLoading(true);

    try {
      const res = await createFirebaseUser(formResult);

      if (!res.success) {
        // Handle error from Firebase
        setLoading(false);
        setExternalError(res.error || "An error occurred during sign-up");
        return;
      }

      setLoading(false);

      toast({
        title: "Success! 🎉",
        description: "Your account has been created successfully!",
      });

      router.push(redirect ?? "/");
      router.refresh();
    } catch (e: any) {
      setLoading(false);

      // Extract error message from any error object structure
      const errorMessage =
        e.error ||
        (e instanceof Error ? e.message : "An unexpected error occurred");
      setExternalError(errorMessage);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-2 sm:p-4 bg-gray-50 overflow-hidden">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-5xl h-full max-h-[95vh] flex flex-col lg:flex-row overflow-hidden rounded-lg sm:rounded-2xl shadow-xl bg-white border border-gray-200">
        <CardContent className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
          <div className="w-full max-w-sm mx-auto h-full flex flex-col">
            {/* Back button for step 2 - Fixed at top */}
            {step === 2 && (
              <div className="flex-shrink-0 mb-3 sm:mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackStep}
                  className="p-0 h-auto flex items-center text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="font-medium text-xs sm:text-sm">
                    Back to Account Setup
                  </span>
                </Button>
              </div>
            )}

            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3 flex-shrink-0">
              <div>
                <h1
                  className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-black ${step === 1 ? "pt-7" : ""}`}
                >
                  {step === 1 ? "Create Account" : "Personal Information"}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                  {step === 1
                    ? "Start your journey with us"
                    : "Tell us about yourself"}
                </p>
              </div>
            </div>

            {/* Stepper Component */}
            <div className="flex-shrink-0 my-3 sm:my-4">
              <Stepper steps={steps} currentStep={step} />
            </div>

            {/* Form Container - Different layout for each step */}
            {step === 1 ? (
              /* Step 1 - Centered form */
              <div className="flex-1 flex flex-col justify-center min-h-0">
                <form
                  onSubmit={handleNextStep}
                  className="space-y-3 sm:space-y-4"
                >
                  <InputText
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formState.email}
                    onChange={handleChange("email")}
                  />

                  <div className="relative">
                    <InputText
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={formState.password}
                      onChange={handleChange("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <InputText
                      id="confirmation"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formState.confirmation}
                      onChange={handleChange("confirmation")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in-50 duration-300">
                      <p className="text-xs sm:text-sm text-red-600 font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-9 sm:h-10 lg:h-12 mt-3 sm:mt-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-xs sm:text-sm lg:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Continue to Personal Details"
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              /* Step 2 - Top-aligned form */
              <div className="flex-1 min-h-0">
                <form
                  onSubmit={handleSignUpSubmit}
                  className="space-y-2 sm:space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
                  </div>

                  <InputText
                    id="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={formState.phoneNumber || ""}
                    onChange={handleChange("phoneNumber")}
                  />

                  <InputText
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    value={formState.dob}
                    onChange={handleChange("dob")}
                  />

                  <div className="space-y-1">
                    <label
                      htmlFor="sex"
                      className="block text-xs sm:text-sm font-semibold text-gray-800"
                    >
                      Sex
                    </label>
                    <select
                      id="sex"
                      value={formState.sex}
                      onChange={handleChange("sex")}
                      className={cn(
                        "w-full h-8 sm:h-9 lg:h-11 px-2 sm:px-3 lg:px-4 rounded-lg border-2 transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base",
                        "focus:border-black focus:ring-4 focus:ring-gray-200",
                        "hover:border-gray-400",
                        formState.sex ? "border-gray-800" : "border-gray-300"
                      )}
                    >
                      <option value="">Select Sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in-50 duration-300">
                      <p className="text-xs sm:text-sm text-red-600 font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-9 sm:h-10 lg:h-12 mt-3 sm:mt-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-xs sm:text-sm lg:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create My Account"
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Login link */}
            <div className="text-center pt-2 sm:pt-3 border-t border-gray-200 flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-black hover:text-gray-700 transition-colors duration-200"
                  href={appendRedirectParam("/auth/login", redirect)}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </CardContent>

        {/* Right side image - hidden on mobile and small tablets */}
        <div className="relative hidden lg:flex bg-gray-900 w-full lg:w-1/2 items-center justify-center">
          <Image
            src="/pictures/IMAA Official no-bg.png"
            alt="Sports and Fitness"
            width={400}
            height={400}
            className="object-contain z-10 drop-shadow-2xl"
            priority
          />
          <div className="absolute bottom-8 left-8 right-8 text-white z-10">
            <h3 className="text-xl lg:text-2xl font-bold mb-2">
              Join Our Community
            </h3>
            <p className="text-white/80 text-sm lg:text-base">
              Start your fitness journey with thousands of others.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
