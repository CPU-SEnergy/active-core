"use client";

import ChatRoom from "@/components/ChatRoom";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { notFound } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

type PageProps = {
  params: {
    roomId: string;
  };
};

export default function ChatRoomPage(props: PageProps) {
  const { params } = props;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user || params.roomId !== user.uid) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <ChatRoom roomId={user.uid} user={user} />
    </div>
  );
}