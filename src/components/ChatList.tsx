"use client";

import { useEffect, useState } from "react";
import { ref, getDatabase, get, onValue } from "firebase/database";
import { app } from "@/lib/firebaseClient";
import type { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatRoom from "@/components/ChatRoom";

interface ChatUser {
  id: string;
  name: string;
  lastMessageTimestamp: number;
  email?: string | undefined;
  lastMessageText?: string | undefined;
}

type Props = {
  user: User;
  isAdmin: boolean;
};

export default function UserChatList({ user, isAdmin }: Props) {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const database = getDatabase(app);
  const firestore = getFirestore(app);
  const isMobile = useIsMobile();

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                  lastMessageText,
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

  useEffect(() => {
    if (isMobile && selectedChatId) {
      setIsSidebarOpen(false);
    }
  }, [selectedChatId, isMobile]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleChatSelect = (roomId: string) => {
    setSelectedChatId(roomId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const renderChatList = () => (
    <div className="h-full w-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>

      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {chatUsers.length > 0 ? (
          <div className="divide-y">
            {chatUsers.map((chatUser) => (
              <div
                key={chatUser.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 transition flex flex-col
                  ${selectedChatId === chatUser.id ? "bg-blue-50" : ""}
                `}
                onClick={() => handleChatSelect(chatUser.id)}
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium truncate flex-1">
                    {chatUser.name || "Loading..."}
                  </p>
                  {chatUser.lastMessageTimestamp && (
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatTimestamp(chatUser.lastMessageTimestamp)}
                    </span>
                  )}
                </div>
                {chatUser.lastMessageText && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chatUser.lastMessageText}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No chats available.
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex h-screen w-full bg-gray-100 relative">
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <ChatRoom
              roomId={selectedChatId}
              user={user}
              onOpenChatList={toggleMobileSidebar}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center p-8">
                <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
                <p className="text-gray-500">
                  Select a conversation to start chatting
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={toggleMobileSidebar}
                >
                  Open Chat List
                </button>
              </div>
            </div>
          )}
        </div>
        <aside
          className={`
            fixed inset-y-0 right-0 z-40
            ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
            bg-white border-l overflow-hidden transition-all duration-300 ease-in-out
            shadow-xl w-64
          `}
        >
          {renderChatList()}
        </aside>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className="w-64 bg-white border-r overflow-hidden">
        {renderChatList()}
      </aside>
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <ChatRoom roomId={selectedChatId} user={user} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}