"use client"

import React from 'react'
import { Button } from './ui/button'
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebaseClient";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(getAuth(app));

    await fetch("/api/logout");

    router.push("/auth/login");
  }

  return (
    <Button
      variant={"default"}
      onClick={handleLogout}
      className="text-gray-300"
    >
      Logout
    </Button>
  )
}