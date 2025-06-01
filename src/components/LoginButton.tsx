"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.push("/auth/login")}
      className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-300 px-6 py-2 text-lg font-medium"
    >
      Login
    </Button>
  );
}