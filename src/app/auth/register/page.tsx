"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const registrationSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(1, "Email is required."),
  password: z
    .string().min(8, "Password must be at least 8 characters long."),
  confirmation: z
    .string()
    .min(8, "Confirmation password must be at least 8 characters long."),
}).refine((data) => data.password === data.confirmation, {
  message: "Passwords don't match",
  path: ["confirmation"],
});

const userInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  dob: z.string().min(1, "Date of birth is required."),
  sex: z.string().min(1, "Sex is required."),
});

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNextStep = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      registrationSchema.parse({ email, password, confirmation });
      setStep(2);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(" "));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      userInfoSchema.parse({ firstName, lastName, dob, sex });
      alert(`Last Name: ${lastName}, First Name: ${firstName}, Date of Birth: ${dob}, Sex: ${sex}, Email: ${email}, Password: ${password}`);

      await createUserWithEmailAndPassword(getAuth(app), email, password);
      router.push("/login");
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(" "));
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
        {/* Step indicators */}
        <div className="mb-4 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${step === 1
                    ? "border-2 border-gray-900 text-gray-900 font-bold"
                    : "border border-gray-300 text-gray-400"
                    }`}
                >
                  <span className="text-xs">1</span>
                </div>
                <span
                  className={`ml-2 text-sm ${step === 1 ? "text-gray-900 font-medium" : "text-gray-400"
                    }`}
                >
                  Register
                </span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${step === 2
                    ? "border-2 border-gray-900 text-gray-900 font-bold"
                    : "border border-gray-300 text-gray-400"
                    }`}
                >
                  <span className="text-xs">2</span>
                </div>
                <span
                  className={`ml-2 text-sm ${step === 2 ? "text-gray-900 font-medium" : "text-gray-400"
                    }`}
                >
                  Information
                </span>
              </div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-2 text-center text-xl font-semibold">Sign up to Sports and Fitness</h2>
            <p className="mb-4 text-center text-sm text-gray-500">Create your account</p>
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full rounded-md focus:outline-none focus:ring-2"
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
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Next"
                )}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-center text-xl font-semibold">Sign up to Sports and Fitness</h2>
            <p className="mb-4 text-center text-sm text-gray-500">Enter your details</p>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="dob" className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="sex" className="mb-1 block text-sm font-medium text-gray-700">
                  Sex
                </label>
                <select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full rounded-md text-white focus:outline-none focus:ring-2"
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
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
