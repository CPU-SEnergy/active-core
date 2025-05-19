"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebaseClient";
import { User } from "@/auth/AuthProvider";
import LoginButton from "./LoginButton";

export default function LogoutButton({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(getAuth(app));

    await fetch("/api/logout");

    router.push("/");
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
        <LoginButton />
      )}
    </>
  );
}
