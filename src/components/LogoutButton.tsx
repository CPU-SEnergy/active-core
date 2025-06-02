"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import LoginButton from "./LoginButton";
import { User } from "@/auth/AuthContext";
import { logout } from "../../not-api";

export default function LogoutButton({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(getFirebaseAuth());

    await logout();

    router.push("/");
    router.refresh();
  }

  return (
    <>
      {user ? (
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-300 px-6 py-2 text-lg font-medium"
        >
          Logout
        </Button>
      ) : (
        <LoginButton />
      )}
    </>
  );
}
