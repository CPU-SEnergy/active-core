"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireauth } from "@/lib/firebaseClient";
import { z, ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPageClient() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ZodError | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setValidationErrors(validation.error);
      setLoading(false);
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        fireauth,
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.refresh();
      router.push("/");
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
    <>
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
              <h1 className="text-center text-2xl md:text-4xl font-bold tracking-tighter md:my-6">
                Login
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
                <div className="space-y-2 mb-8 md:mb-10">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {getValidationError("password") && (
                    <div className="text-red-500 text-sm">
                      {getValidationError("password")}
                    </div>
                  )}
                </div>
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
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  id="reset"
                  className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                >
                  Forgot password?
                </Link>
              </div>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-blue-500 hover:text-blue-600"
                  href="/auth/register"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
          <div className="relative hidden md:flex bg-zinc-950 w-full md:w-1/2">
            <Image
              src="/pictures/loginphoto.jpg"
              alt="Login Illustration"
              width={500}
              height={500}
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-6"></div>
          </div>
        </Card>
      </div>
    </>
  );
}
