"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebaseClient";
import { z, ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Navbar from "@/components/navbar";


const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ZodError | null>(null);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setValidationErrors(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setValidationErrors(validation.error);
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push("/");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const getValidationError = (field: string) => {
    return validationErrors?.errors.find((err) => err.path.includes(field))?.message;
  };

  return (
<>
  <Navbar />
    <div className="min-h-screen w-full flex items-center justify-center p-4"
    style={{background: "linear-gradient(119.97deg, #F3F4F6FF 0%, #D8DBE0FF 78%, #DEE1E6FF 100%)"}}>
      <Card className="w-full max-w-7xl h-auto  flex overflow-hidden rounded-2xl shadow-xl">
        <CardContent className="p-8 flex-1">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tighter mb-24">Login</h1>
            </div>
            <div className="space-y-4">
              <div className="space-y-2 mb-5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="m@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {getValidationError("email") && (
                <div className="text-red-500 text-sm">{getValidationError("email")}</div>
              )}
              </div>
              <div className="space-y-2 mb-10">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {getValidationError("password") && (
                <div className="text-red-500 text-sm">{getValidationError("password")}</div>
              )}
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button className="w-full bg-red-500 hover:bg-red-600 mt-4 py-6" type="submit" onClick={handleSubmit}>
                Sign In
              </Button>
            </div>
            <div className="flex items-center justify-between mt-30 mb-30">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password"
              id="reset"
              className="font-medium text-gray-600 hover:underline dark:text-gray-500">
                Forgot password?
              </Link>
            </div>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 ">
              Don&apos;t have an account?{" "}
              <Link className="text-blue-500 hover:text-blue-600" href="/register">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
        <div className="relative hidden md:block flex-1 bg-zinc-950">
          <Image src='/pictures/loginphoto.jpg' alt="Description" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
          </div>
        </div>
      </Card>
    </div>
    </>
  );
}
