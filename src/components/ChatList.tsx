/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ref, getDatabase, get, onValue } from "firebase/database";
import { app } from "@/lib/firebaseClient";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

interface ChatUser {
  id: string;
  name: string;
  lastMessageTimestamp: number;
  email?: string | undefined; // Email is now optional
  lastMessageText?: string | undefined; // Added lastMessageText to store the most recent message
}

type Props = {
  user: User;
  isAdmin: boolean;
  onSelectChat: (roomId: string) => void;
};

export default function UserChatList({ user, isAdmin, onSelectChat }: Props) {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const database = getDatabase(app);
  const firestore = getFirestore(app);
  console.log(chatUsers, "CHATtttttttt");

  const fetchUserDetail = async (roomId: string) => {
    try {
      const userDocRef = doc(firestore, "users", roomId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const name =
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : "Unknown User";
        setChatUsers((prev) =>
          prev.map((chatUser) =>
            chatUser.id === roomId
              ? { ...chatUser, name, email: userData.email }
              : chatUser
          )
        );
      } else {
        setChatUsers((prev) =>
          prev.map((chatUser) =>
            chatUser.id === roomId
              ? { ...chatUser, name: "Unknown User" }
              : chatUser
          )
        );
      }
    } catch (error) {
      console.error("Error fetching Firestore user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribeFunctions: Array<() => void> = [];

    const fetchAndListen = async () => {
      const systemChatsRef = ref(database, "systemChats");
      const snapshot = await get(systemChatsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const roomIds = Object.keys(data);

        roomIds.forEach((roomId) => {
          const messagesRef = ref(database, `systemChats/${roomId}/messages`);
          const unsubscribe = onValue(messagesRef, (snap) => {
            if (snap.exists()) {
              const messages = snap.val();
              const messageIds = Object.keys(messages);

              // Find the latest message (by timestamp)
              const latestMessageId = messageIds.reduce((prev, current) => {
                return messages[prev].timestamp > messages[current].timestamp
                  ? prev
                  : current;
              });

              const latestMessage = messages[latestMessageId];
              const lastMessageTimestamp = latestMessage.timestamp;
              const lastMessageText = latestMessage.text;

              setChatUsers((prev) => {
                const otherRooms = prev.filter((room) => room.id !== roomId);
                const existingRoom = prev.find((room) => room.id === roomId);
                const updatedRoom: ChatUser = {
                  id: roomId,
                  name: existingRoom?.name || "",
                  lastMessageTimestamp,
                  email: existingRoom?.email,
                  lastMessageText, // Store the last message text
                };
                const updatedList = [...otherRooms, updatedRoom];
                updatedList.sort(
                  (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
                );
                return updatedList;
              });

              fetchUserDetail(roomId);
            } else {
              setChatUsers((prev) => prev.filter((room) => room.id !== roomId));
            }
          });

          unsubscribeFunctions.push(() => unsubscribe());
        });
      }
    };

    fetchAndListen();

    return () => {
      unsubscribeFunctions.forEach((unsub) => unsub());
    };
  }, [database, user.uid, isAdmin, firestore]);

  return (
    <aside className="w-full lg:w-64 bg-white p-6 border-r">
      <nav className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          <div className="overflow-y-auto h-[90%] space-y-4">
            {chatUsers.length > 0 ? (
              chatUsers.map((chatUser) => (
                <div
                  key={chatUser.id}
                  className="p-3 border-b cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => onSelectChat(chatUser.id)}
                >
                  
                  <p className="font-medium">{chatUser.name || "Loading..."}</p>
                  {chatUser.lastMessageText && (
                    <p className="text-sm text-gray-500">
                      {chatUser.lastMessageText}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No chats available.</p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
