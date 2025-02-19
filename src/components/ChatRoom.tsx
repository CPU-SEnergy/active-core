/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  update,
} from "firebase/database";
import { app } from "@/lib/firebaseClient";
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
  roomId: string | null;
  user: User;
}

const PAGE_SIZE = 10;

export function ChatRoom({ roomId, user }: ChatRoomProps) {
  const database = getDatabase(app);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLoadedTimestampRef = useRef<number>(0);

  const [userData] = useRead(db.users.get(user.uid as Schema["users"]["Id"]));
  const userDisplayName =
    userData?.data.firstName && userData?.data.lastName
      ? `${userData.data.firstName} ${userData.data.lastName}`
      : "Anonymous";

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const loadInitialMessages = useCallback(async () => {
    if (!roomId) return;
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
      if (messagesList.length > 0) {
        lastLoadedTimestampRef.current =
          messagesList.length > 0 ? messagesList[messagesList.length - 1]?.timestamp ?? 0 : 0;
      }
      setMessages(messagesList);
      setHasMore(messagesList.length === PAGE_SIZE);
      scrollToBottom();
    } else {
      setMessages([]);
      setHasMore(false);
    }
  }, [database, roomId, scrollToBottom]);

  useEffect(() => {
    loadInitialMessages();
  }, [loadInitialMessages]);

  const loadOlderMessages = useCallback(async () => {
    if (!roomId || messages.length === 0) return;
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
  }, [database, roomId, messages]);

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
  }, [hasMore, loadingMore, loadOlderMessages]);

  useEffect(() => {
    if (!roomId) return;
    const messagesRef = ref(database, `systemChats/${roomId}/messages`);
    const newMessagesQuery = query(
      messagesRef,
      orderByChild("timestamp"),
      startAt(lastLoadedTimestampRef.current + 1)
    );
    const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
      const newMsg = snapshot.val() as Message;
      setMessages((prev) => {
        if (prev.find((m) => m.id === snapshot.key)) return prev;
        return [...prev, { ...newMsg, id: snapshot.key || "" }];
      });
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [database, roomId, scrollToBottom]);

  useEffect(() => {
    if (!roomId || !userDisplayName) return;
    const userRef = ref(database, `systemChats/${roomId}/users/${roomId}`);
    set(userRef, {
      name: userDisplayName,
      online: true,
      lastActive: Date.now(),
    });
    onDisconnect(userRef).remove();
  }, [database, roomId, userDisplayName]);

  const sendMessage = useCallback(async () => {
    if (!roomId || !input.trim()) return;
    const newMessage = {
      senderId: user.uid,
      senderName: userDisplayName || "Anonymous",
      text: input,
      timestamp: Date.now(),
    };
    const messagesRef = ref(database, `systemChats/${roomId}/messages`);
    const newMessageRef = push(messagesRef);
    const updates: { [key: string]: any } = {};
    updates[`systemChats/${roomId}/recentMessage`] = newMessage;
    updates[`systemChats/${roomId}/messages/${newMessageRef.key}`] = newMessage;
    await update(ref(database), updates);
    setInput("");
    scrollToBottom();
  }, [database, roomId, input, user.uid, userDisplayName, scrollToBottom]);

  if (!roomId) return null;
  if (!userData) return <div>user Loading...</div>;

  return (
    <div className="w-full mx-auto p-4">
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
