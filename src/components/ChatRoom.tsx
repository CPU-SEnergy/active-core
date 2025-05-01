"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  ref,
  query,
  orderByChild,
  limitToLast,
  get,
  endAt,
  startAt,
  onChildAdded,
  push,
  set,
  onDisconnect,
  getDatabase,
} from "firebase/database";
import { app } from "@/lib/firebaseClient";
import { User } from "firebase/auth";
import { useRead } from "@typesaurus/react";
import { db, Schema } from "@/lib/schema/firestore";
import { Send } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatRoomProps {
  roomId: string;
  user: User;
}

const PAGE_SIZE = 15;

export function ChatRoom({ roomId, user }: ChatRoomProps) {
  const database = getDatabase(app);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [userData] = useRead(db.users.get(user.uid as Schema["users"]["Id"]));
  const userDisplayName =
    userData?.data.firstName && userData?.data.lastName
      ? `${userData.data.firstName} ${userData.data.lastName}`
      : "Anonymous";

  const loadInitialMessages = async () => {
    const messagesRef = ref(database, `systemChats/${roomId}/messages`);
    const messagesQuery = query(
      messagesRef,
      orderByChild("timestamp"),
      limitToLast(PAGE_SIZE)
    );
    const snapshot = await get(messagesQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const messagesList: Message[] = Object.entries(data).map(
        ([key, value]) => ({
          ...(value as Message),
          id: key,
        })
      );
      messagesList.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(messagesList);
      if (messagesList.length < PAGE_SIZE) {
        setHasMore(false);
      }
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    } else {
      setMessages([]);
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadInitialMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const loadOlderMessages = async () => {
    if (messages.length === 0) return;
    setLoadingMore(true);
    const oldestTimestamp = messages[0]?.timestamp || 0;
    const messagesRef = ref(database, `systemChats/${roomId}/messages`);
    const olderQuery = query(
      messagesRef,
      orderByChild("timestamp"),
      endAt(oldestTimestamp - 1),
      limitToLast(PAGE_SIZE)
    );
    const snapshot = await get(olderQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const olderMessages: Message[] = Object.entries(data).map(
        ([key, value]) => ({
          ...(value as Message),
          id: key,
        })
      );
      olderMessages.sort((a, b) => a.timestamp - b.timestamp);
      setMessages((prev) => [...olderMessages, ...prev]);
      if (olderMessages.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !loadingMore) {
        loadOlderMessages();
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, messages]);

  useEffect(() => {
    const messagesRef = ref(database, `systemChats/${roomId}/messages`);
    const lastTimestamp =
      messages.length > 0 ? (messages[messages.length - 1]?.timestamp ?? 0) : 0;
    const newMessagesQuery = query(
      messagesRef,
      orderByChild("timestamp"),
      startAt(lastTimestamp + 1)
    );
    const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
      const newMsg = snapshot.val() as Message;
      setMessages((prev) => {
        if (prev.find((m) => m.id === snapshot.key)) return prev;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = newMsg;
        return [...prev, { id: snapshot.key || "", ...rest }];
      });
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    });
    return () => unsubscribe();
  }, [roomId, messages]);

  useEffect(() => {
    if (!userDisplayName) return;
    const userRef = ref(database, `systemChats/${roomId}/users/${user.uid}`);
    set(userRef, {
      name: userDisplayName,
      online: true,
      lastActive: Date.now(),
    });
    onDisconnect(userRef).remove();
  }, [roomId, user, userDisplayName]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const messageRef = push(ref(database, `systemChats/${roomId}/messages`));
    await set(messageRef, {
      senderId: user.uid,
      senderName: userDisplayName || "Anonymous",
      text: input,
      timestamp: Date.now(),
    });
    setInput("");
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    userData && (
      <div className="flex flex-col h-full">
        <div className="p-4 bg-gray-50 pt-10 pb-5">
          <h2 className="text-lg font-bold">
            Chat with{" "}
            {userData?.data.firstName + " " + userData?.data.lastName || ""}
          </h2>
        </div>
        <div
          ref={containerRef}
          className="flex-grow overflow-y-auto border border-gray-300 p-4 mx-5 rounded bg-gray-50 shadow-sm"
        >
          {loadingMore && (
            <div className="text-center">Loading older messages...</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded w-full ${
                msg.senderId === user.uid
                  ? "text-right"
                  : "self-start text-left"
              }`}
            >
              {msg.senderId !== user.uid && (
                <span className="font-bold text-blue-black"></span>
              )}{" "}
              <span
                className={`mb-2 p-2 rounded max-w-xs ${
                  msg.senderId === user.uid
                    ? "bg-gray-300 text-right"
                    : "self-start text-left"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 mx-4 border-t border-gray-300 bg-white rounded shadow-sm">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="absolute right-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ChatRoom;
