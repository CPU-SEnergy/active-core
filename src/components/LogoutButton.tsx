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
          className="text-black-600 bg-white border border-gray-900 px-5 text-lg md:text-base hover:bg-black hover:text-white transition-colors duration-300"
        >
          Logout
        </Button>
      ) : (
        <LoginButton />
      )}
    </>
  );
}
