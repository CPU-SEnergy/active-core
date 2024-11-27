

import { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "./RegisterForm"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <main
      className="min-h-screen w-full flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/pictures/sportsfitness.jpg')",
      }}
    >
      <div className="lg:p-8 p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] bg-white rounded-lg p-8 shadow-lg">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
              Create an account
            </h1>
            <p className="text-sm text-gray-600">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-gray-600">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
