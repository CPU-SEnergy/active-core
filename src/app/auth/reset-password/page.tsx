"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { z, type ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRedirectParam } from "@/app/shared/useRedirectParam";
import { appendRedirectParam } from "@/app/shared/redirect";

const emailSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ZodError | null>(
    null
  );
  const redirect = useRedirectParam();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    setValidationErrors(null);

    // Validate email input using Zod
    const validation = emailSchema.safeParse({ email });

    if (!validation.success) {
      setValidationErrors(validation.error);
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const getValidationError = (field: string) => {
    return validationErrors?.errors.find((err) => err.path.includes(field))
      ?.message;
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(119.97deg, #F3F4F6FF 0%, #D8DBE0FF 78%, #DEE1E6FF 100%)",
      }}
    >
      <Card className="w-full max-w-sm md:max-w-5xl h-auto flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-xl">
        <CardContent className="flex-1 p-6">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <Link href="/auth/login">
              <Button
                type="button"
                variant="ghost"
                className="mb-2 p-0 h-auto flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Login</span>
              </Button>
            </Link>

            <h1 className="text-center text-2xl md:text-4xl font-bold tracking-tighter md:my-6">
              Reset Password
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 mb-6 md:mb-8">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {getValidationError("email") && (
                  <div className="text-red-500 text-sm">
                    {getValidationError("email")}
                  </div>
                )}
              </div>

              {message && (
                <div className="bg-green-50 text-green-800 rounded-md p-4 mb-4">
                  {message}
                </div>
              )}

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button
                className={`w-full py-3 md:py-6 ${loading ? "opacity-50" : ""}`}
                type="submit"
                disabled={loading}
              >
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
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Remember your password?{" "}
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
  );
}
