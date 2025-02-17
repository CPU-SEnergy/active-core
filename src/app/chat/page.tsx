/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import UserChatList from "@/components/ChatList";
import { app } from "@/lib/firebaseClient";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getDatabase, ref, set, get } from "firebase/database";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChatRoomPage() {
  const router = useRouter();
  const auth = getAuth(app);
  // const database = getDatabase(app);
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

  // const handleOpenUserChat = async () => {
  //   const roomId = user.uid;
  //   const chatRef = ref(database, `systemChats/${roomId}`);
  //   const snapshot = await get(chatRef);

  //   if (!snapshot.exists()) {
  //     await set(chatRef, {
  //       users: {
  //         [user.uid]: true,
  //       },
  //       adminsAccess: true,
  //       createdAt: new Date().toISOString(),
  //     });
  //   }

  //   router.push(`/chat/${roomId}`);
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row pt-14">
      {/* <div className="flex flex-col p-4 w-[400px]">
        <h2 className="font-semibold text-lg mb-4">Chats</h2>
        <button
          onClick={handleOpenUserChat}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Start Chat
        </button>
      </div> */}
      <UserChatList
        user={user}
        onSelectChat={(roomId) => router.push(`/chat/${roomId}`)}
      />
    </div>
  );
}
