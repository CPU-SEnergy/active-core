/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ref, getDatabase, get } from "firebase/database";
import { app } from "@/lib/firebaseClient";
import { User } from "firebase/auth";

interface ChatUser {
  id: string;
  name: string;
}

type Props = {
  user: User;
  isAdmin: boolean;
  onSelectChat: (roomId: string) => void;
};

export default function UserChatList({ user, isAdmin, onSelectChat }: Props) {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const database = getDatabase(app);

  useEffect(() => {
    const usersRef = ref(database, `systemChats`);
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = [] as any;
        Object.entries(data).forEach(([chatListData]: any) => {
          console.log(chatListData, "chatUsers");
          usersList.push({
            id: chatListData,
            name: chatListData,
          });
        });

        setChatUsers(usersList);
        console.log("Users:", usersList);
      }
    });
  }, [database, user.uid, isAdmin]);

  return (
    <div className="h-screen w-[400px] bg-gray-100 p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="overflow-y-auto h-[90%]">
        {chatUsers.length > 0 ? (
          chatUsers.map((chatUser) => (
            <div
              key={chatUser.id}
              className="p-3 border-b cursor-pointer hover:bg-gray-200 transition"
              onClick={() => onSelectChat(chatUser.id)}
            >
              <p className="font-medium">{chatUser.name}</p>
              {/* <p className="text-sm text-gray-500">
                Last active: {new Date(chatUser.lastActive).toLocaleString()}
              </p> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chats available.</p>
        )}
      </div>
    </div>
  );
}
