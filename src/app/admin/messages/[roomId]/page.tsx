/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ChatRoom from "@/components/ChatRoom";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

interface PageProps {
  params: {
    roomId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ChatRoomPage({ params }: PageProps) {
  const auth = getFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user)
    return (
      <h2 className="h-screen w-screen text-center flex justify-center items-center">
        No Chats Selected
      </h2>
    );

  return (
    <div className="flex-grow h-full bg-gray-50 ">
      {user && <ChatRoom roomId={params.roomId} user={user} />}
    </div>
  );
}
