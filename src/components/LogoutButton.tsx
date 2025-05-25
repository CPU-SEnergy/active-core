"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import LoginButton from "./LoginButton";
import { User } from "@/auth/AuthContext";
import { logout } from "../../api";

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
