"use client"

import React from 'react'
import { Button } from './ui/button'
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebaseClient";
import { User } from '@/auth/AuthProvider';

export default function LogoutButton({ user }: { user: User }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(getAuth(app));

    await fetch("/api/logout");

    router.push("/auth/login");
  }

  return (
    <>
      {user ? (
        <Button
          variant={"default"}
          onClick={handleLogout}
          className="text-white font-semibold bg-red-600 text-lg md:text-base"
        >
          Logout
        </Button>
      ) : (
        <Button
          variant={"default"}
          onClick={() => router.push("/auth/login")}
          className="text-gray-300 bg-green-600 px-5 hover:bg-green-700 text-lg md:text-base"
        >
          Login
        </Button>
      )}
    </>
  )
}