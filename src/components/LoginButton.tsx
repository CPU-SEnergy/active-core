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
      className="text-black-600 bg-white border border-gray-900 px-5 text-lg md:text-base hover:bg-black hover:text-white transition-colors duration-300"
    >
      Login
    </Button>
  );
}