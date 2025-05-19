"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  return (
    <Button
      variant={"default"}
      onClick={() => router.push("/auth/login")}
      className="text-gray-300 bg-green-600 px-5 hover:bg-green-700 text-lg md:text-base"
    >
      Sign In
    </Button>
  );
}