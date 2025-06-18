/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/InputText";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Eye, EyeOff, Loader2, LogIn, ArrowLeft } from "lucide-react";
import { useRedirectParam } from "@/app/shared/useRedirectParam";
import { appendRedirectParam } from "@/app/shared/redirect";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { loginWithCredential } from "../../../../not-api";
import { loginSchema } from "@/lib/schema/auth/loginSchema";

export default function LoginPageClient() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const redirect = useRedirectParam();

  const handleChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        const formattedErrors = result.error.format();
        const firstError =
          formattedErrors.email?._errors?.[0] ||
          formattedErrors.password?._errors?.[0] ||
          "Please check your form inputs";

        setError(firstError);
        setLoading(false);
        return;
      }

      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        formData.email,
        formData.password
      );
      await loginWithCredential(credential);

      toast({
        title: "Welcome back! 🎉",
        description: "You have been successfully signed in.",
      });

      router.push(redirect ?? "/");
      router.refresh();
    } catch (e: any) {
      setLoading(false);

      let errorMessage = "An unexpected error occurred";

      if (e.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email address. Please check your email or sign up.";
      } else if (e.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (e.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (e.code === "auth/user-disabled") {
        errorMessage =
          "This account has been disabled. Please contact support.";
      } else if (e.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (e.code === "auth/invalid-credential") {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (e.message) {
        errorMessage = e.message;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 bg-gray-50 overflow-auto">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-5xl h-full max-h-[95vh] flex flex-col lg:flex-row overflow-hidden rounded-lg sm:rounded-2xl shadow-xl bg-white border border-gray-200">
        <CardContent className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
          <div className="w-full max-w-sm mx-auto h-full flex flex-col">
            {/* Back to Home button */}
            <div className="flex-shrink-0 mb-3 sm:mb-4">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                  className="p-0 h-auto flex items-center text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="font-medium text-xs sm:text-sm">
                    Back to Home
                  </span>
                </Button>
              </Link>
            </div>
            {/* Header with icon */}
            <div className="text-center space-y-2 sm:space-y-3 flex-shrink-0">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-black rounded-xl sm:rounded-2xl shadow-lg">
                <LogIn className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-black">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                  Sign in to your account
                </p>
              </div>
            </div>

            {/* Spacer to match stepper height on register page */}
            <div className="flex-shrink-0 my-3 sm:my-4 h-[60px] sm:h-[70px]"></div>

            {/* Form - Centered vertically like register page */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <InputText
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                />

                <div className="relative">
                  <InputText
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
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

                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <label
                      htmlFor="remember"
                      className="text-xs sm:text-sm text-gray-600 font-medium cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href={appendRedirectParam("/auth/reset-password", redirect)}
                    className="text-xs sm:text-sm font-semibold text-black hover:text-gray-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
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
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </div>

            {/* Sign up link - Fixed position at bottom */}
            <div className="text-center mt-8  pt-2 sm:pt-3 border-t border-gray-200 flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-black hover:text-gray-700 transition-colors duration-200"
                  href={appendRedirectParam("/auth/register", redirect)}
                >
                  Sign up here
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
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Welcome Back</h3>
            <p className="text-white/80 text-sm lg:text-base">
              Continue your fitness journey with us.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
