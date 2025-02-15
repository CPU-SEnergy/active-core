"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { fireauth } from "@/lib/firebaseClient";
import { User } from "@/auth/AuthProvider";

export default function LogoutButton({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(fireauth);

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
  );
}
