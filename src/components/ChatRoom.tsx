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
} from "firebase/database";
import { database } from "@/lib/firebaseClient";
import { User } from "firebase/auth";
import { useRead } from "@typesaurus/react";
import { db, Schema } from "@/lib/schema/firestore";

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

const PAGE_SIZE = 20;

export function ChatRoom({ roomId, user }: ChatRoomProps) {
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Sports and Fitness Chat</h2>
      <div
        ref={containerRef}
        className="h-80 overflow-y-scroll border border-gray-300 p-4 mb-4 rounded bg-white shadow-sm"
      >
        {loadingMore && (
          <div className="text-center">Loading older messages...</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold text-blue-600">{msg.senderName}:</span>{" "}
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
