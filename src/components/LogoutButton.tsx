"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import LoginButton from "./LoginButton";
import { User } from "@/auth/AuthContext";
import { logout } from "../../not-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LogoutButton({ user }: { user: User | null }) {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  async function handleLogout() {
    await signOut(getFirebaseAuth());

    await logout();

    router.push("/");
    router.refresh();
  }
  return (
    <>
      {user ? (
        <>
          <Button
            variant="ghost"
            onClick={() => setShowConfirmDialog(true)}
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-300 px-6 py-2 text-lg font-medium"
          >
            Logout
          </Button>
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out of your account?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <LoginButton />
      )}
    </>
  );
}
