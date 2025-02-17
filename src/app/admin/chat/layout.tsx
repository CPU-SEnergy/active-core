"use client";

import UserChatList from "@/components/ChatList";
import { app } from "@/lib/firebaseClient";
import { getAuth, User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      user
        .getIdTokenResult(true)
        .then((idTokenResult) => {
          console.log("Custom Claims:", idTokenResult.claims);
          if (
            idTokenResult.claims.role === "admin" ||
            idTokenResult.claims.role === "cashier"
          ) {
            console.log("User is an admin");
            setIsAdmin(true);
          }
        })
        .catch((error) => {
          console.error("Error reading token claims:", error);
        });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user)
    return (
      <h2 className="h-screen w-screen text-center flex justify-center items-center">
        No Chats Selected
      </h2>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row">
      <UserChatList
        user={user}
        onSelectChat={(roomId) => router.push(`${roomId}`)}
        isAdmin={isAdmin}
      />
      {children}
    </div>
  );
}
