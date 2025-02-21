/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ChatRoom from "@/components/ChatRoom";
import { app } from "@/lib/firebaseClient";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

interface ChatRoomPageParams {
  params: {
    roomId: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageParams) {
  const auth = getAuth(app);
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
