/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
  orderByKey,
} from "firebase/database";
import { app } from "@/lib/firebaseClient";
import { User } from "@/auth/AuthContext";
import { useRead } from "@typesaurus/react";
import { db, type Schema } from "@/lib/schema/firestore";
import { Send, ArrowDown, ArrowUp, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAdmin: boolean;
  userNumber?: number;
}

interface ChatRoomProps {
  roomId: string;
  user: User;
  onOpenChatList?: () => void;
}

const PAGE_SIZE = 15;

export function ChatRoom({ roomId, user, onOpenChatList }: ChatRoomProps) {
  const database = getDatabase(app);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(false);
  const lastScrollHeightRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialLoadCompleteRef = useRef<boolean>(false);
  const shouldScrollToBottomRef = useRef<boolean>(true);
  const isLoadingOlderRef = useRef<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [, setIsNearTop] = useState(false);
  const firstMessageKeyRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [participants, setParticipants] = useState<Record<string, any>>({});
  const isMobile = useIsMobile();

  const [userData] = useRead(db.users.get(user.uid as Schema["users"]["Id"]));
  const userDisplayName =
    userData?.data.firstName && userData?.data.lastName
      ? `${userData.data.firstName} ${userData.data.lastName}`
      : "Anonymous";

  useEffect(() => {
    setIsAdmin(
      user?.customClaims?.role === "admin" ||
        user?.customClaims?.role === "cashier"
    );  
  }, [user?.customClaims?.role]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return isMobile
      ? `${hours}:${minutes}`
      : `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const scrollToBottom = (force = false) => {
    if (!shouldScrollToBottomRef.current && !force) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (initialLoadCompleteRef.current && messages.length > 0) {
      scrollToBottom(true);
    }
  }, [initialLoadCompleteRef.current, messages.length]);

  useEffect(() => {
    const uniqueUsers = new Set<string>();
    const newUserNumbers: Record<string, number> = {};

    messages.forEach((msg) => {
      if (!uniqueUsers.has(msg.senderId)) {
        uniqueUsers.add(msg.senderId);
        newUserNumbers[msg.senderId] = uniqueUsers.size;
      }
    });

    if (messages.length > 0 && messages[0]) {
      firstMessageKeyRef.current = messages[0].id;
    }
  }, [messages]);

  const loadInitialMessages = async () => {
    try {
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
        setHasMore(messagesList.length >= PAGE_SIZE);

        if (messagesList.length > 0 && messagesList[0]) {
          firstMessageKeyRef.current = messagesList[0].id;
        }
      } else {
        setMessages([]);
        setHasMore(false);
      }

      setLoadError(null);
      initialLoadCompleteRef.current = true;
      shouldScrollToBottomRef.current = true;

      setTimeout(() => scrollToBottom(true), 0);
      setTimeout(() => scrollToBottom(true), 100);
      setTimeout(() => scrollToBottom(true), 300);
    } catch (error) {
      console.error("Error loading initial messages:", error);
      setMessages([]);
      setHasMore(false);
      setLoadError("Failed to load messages. Please try again.");
    }
  };

  const loadOlderMessages = async () => {
    if (
      messages.length === 0 ||
      loadingMore ||
      !hasMore ||
      isLoadingOlderRef.current
    ) {
      return;
    }

    setLoadingMore(true);
    setLoadError(null);
    shouldScrollToBottomRef.current = false;
    isLoadingOlderRef.current = true;

    try {
      if (containerRef.current) {
        lastScrollHeightRef.current = containerRef.current.scrollHeight;
        lastScrollTopRef.current = containerRef.current.scrollTop;
      }

      const messagesRef = ref(database, `systemChats/${roomId}/messages`);

      let olderQuery;
      if (firstMessageKeyRef.current) {
        olderQuery = query(
          messagesRef,
          orderByKey(),
          endAt(firstMessageKeyRef.current),
          limitToLast(PAGE_SIZE + 1)
        );
      } else {
        const oldestTimestamp = messages[0]?.timestamp || 0;
        olderQuery = query(
          messagesRef,
          orderByChild("timestamp"),
          endAt(oldestTimestamp - 1),
          limitToLast(PAGE_SIZE)
        );
      }

      const snapshot = await get(olderQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();

        let olderMessages: Message[] = Object.entries(data).map(
          ([key, value]) => ({
            ...(value as Message),
            id: key,
          })
        );

        if (firstMessageKeyRef.current) {
          olderMessages = olderMessages.filter(
            (msg) => msg.id !== firstMessageKeyRef.current
          );
        }

        if (olderMessages.length === 0) {
          setHasMore(false);
          return;
        }

        olderMessages.sort((a, b) => a.timestamp - b.timestamp);

        if (olderMessages.length > 0 && olderMessages[0]) {
          firstMessageKeyRef.current = olderMessages[0].id;
        }

        setMessages((prev) => [...olderMessages, ...prev]);
        setHasMore(olderMessages.length >= PAGE_SIZE);

        const restoreScrollPosition = () => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const heightDifference =
              newScrollHeight - lastScrollHeightRef.current;
            containerRef.current.scrollTop =
              lastScrollTopRef.current + heightDifference;
          }
        };

        requestAnimationFrame(restoreScrollPosition);
        setTimeout(restoreScrollPosition, 50);
        setTimeout(restoreScrollPosition, 150);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading older messages:", error);
      setLoadError("Failed to load older messages. Please try again.");
      setHasMore(true);
    } finally {
      setLoadingMore(false);

      setTimeout(() => {
        isLoadingOlderRef.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    const participantsRef = ref(database, `systemChats/${roomId}/participants`);

    const fetchParticipants = async () => {
      try {
        const snapshot = await get(participantsRef);
        if (snapshot.exists()) {
          setParticipants(snapshot.val());
        } else {
          setParticipants({});
        }
      } catch (error) {
        console.error("Failed to load participants:", error);
        setParticipants({});
      }
    };

    fetchParticipants();
    loadInitialMessages();
  }, [roomId, database]);

  useEffect(() => {
    checkScrollIntervalRef.current = setInterval(() => {
      const container = containerRef.current;
      if (container) {
        const isNearTop = container.scrollTop <= 300;
        if (
          isNearTop &&
          hasMore &&
          !loadingMore &&
          !isLoadingOlderRef.current
        ) {
          shouldScrollToBottomRef.current = false;
          loadOlderMessages();
        }
      }
    }, 500);

    return () => {
      if (checkScrollIntervalRef.current) {
        clearInterval(checkScrollIntervalRef.current);
      }
    };
  }, [hasMore, loadingMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearTop = container.scrollTop <= 300;

      setIsNearTop(isNearTop);

      if (isNearTop && hasMore && !loadingMore && !isLoadingOlderRef.current) {
        shouldScrollToBottomRef.current = false;
        loadOlderMessages();
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;

      setIsAtBottom(atBottom);
      shouldScrollToBottomRef.current = atBottom;
    };

    container.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadingMore]);

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

      if (shouldScrollToBottomRef.current) {
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => unsubscribe();
  }, [roomId, messages, database]);

  useEffect(() => {
    if (!userDisplayName) return;
    const userRef = ref(database, `systemChats/${roomId}/users/${user.uid}`);
    set(userRef, {
      name: userDisplayName,
      online: true,
      lastActive: Date.now(),
      isTyping: false,
    });

    onDisconnect(userRef).update({
      online: false,
      lastActive: Date.now(),
      isTyping: false,
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      set(userRef, {
        name: userDisplayName,
        online: false,
        lastActive: Date.now(),
        isTyping: false,
      });
    };
  }, [roomId, user.uid, userDisplayName, database]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const messageRef = push(ref(database, `systemChats/${roomId}/messages`));
      await set(messageRef, {
        senderId: user.uid,
        senderName: userDisplayName || "Anonymous",
        text: input,
        isAdmin: isAdmin,
        timestamp: Date.now(),
      });

      setInput("");
      shouldScrollToBottomRef.current = true;
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLoadPrevious = () => {
    if (!loadingMore && hasMore && !isLoadingOlderRef.current) {
      shouldScrollToBottomRef.current = false;
      loadOlderMessages();
    }
  };

  const breakLongWords = (text: string, maxLength: number = 20): string => {
    return text.split(' ').map(word => {
      if (word.length > maxLength) {
        return word.match(new RegExp(`.{1,${maxLength}}`, 'g'))?.join(' ') || word;
      }
      return word;
    }).join(' ');
  }; // Added utility function to break long words


  return (
    <div className="flex flex-col h-full">
      <div
        className={`p-4 ${isMobile ? "pt-7" : "pt-10"} pb-1 bg-gray-50 flex items-center justify-between`}
      >
        <h2 className="text-lg font-bold">
          {participants && Object.keys(participants).length > 0 ? (
            <ul>
              {Object.entries(participants).map(([userId, participant]) => (
                <li key={userId}>
                  {participant.name}{" "}
                  {participant.role ? ` (${participant.role})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>No participants found.</p>
          )}
        </h2>

        <div className="flex items-center gap-2">
          {isMobile && hasMore && !loadingMore && (
            <button
              onClick={handleLoadPrevious}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-600 transition-colors"
            >
              <ArrowUp className="h-5 w-5" />
              <span className="hidden sm:inline">Load Previous</span>
            </button>
          )}

          {isMobile && onOpenChatList && (
            <button
              onClick={onOpenChatList}
              className="text-xs bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-green-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline">Chat List</span>
            </button>
          )}
        </div>
      </div>

      {!isMobile && hasMore && !loadingMore && (
        <div className="mx-5 mb-2 flex justify-end">
          <button
            onClick={handleLoadPrevious}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-600"
          >
            <ArrowUp className="h-3 w-3" />
            Load Previous Messages
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`flex-grow overflow-y-auto border border-gray-300 ${isMobile ? "p-2 mx-2" : "p-4 mx-5"} rounded bg-gray-50 shadow-sm`}
        aria-live="polite"
      >
        {loadingMore && (
          <div className="flex justify-center items-center py-2 mb-2 sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm">
            <div
              className={`flex items-center gap-2 bg-blue-100 text-blue-800 ${isMobile ? "px-2 py-1 text-xs" : "px-4 py-2"} rounded-full shadow-sm`}
            >
              <svg
                className={`animate-spin ${isMobile ? "h-3 w-3" : "h-4 w-4"} text-blue-600`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isMobile ? "Loading..." : "Loading previous messages..."}
            </div>
          </div>
        )}

        {loadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs flex justify-between items-center w-full mb-3">
            <span>{loadError}</span>
            <button
              onClick={() => setLoadError(null)}
              className="text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {messages.length === 0 && !loadingMore && (
          <div className="text-center py-10 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}

        {!hasMore && messages.length > 0 && (
          <div className="text-center py-2 mb-3 w-full">
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              Beginning of conversation
            </span>
          </div>
        )}

        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === user.uid;
          const isSenderAdmin = msg.isAdmin;

          const alignmentClass = isSenderAdmin
            ? "justify-end"
            : "justify-start";

          const bubbleColorClass =
            isCurrentUser && isSenderAdmin
              ? "bg-black text-white rounded-br-none"
              : isSenderAdmin
                ? "bg-gray-800/85 text-white rounded-br-none"
                : "bg-gray-200 text-black rounded-bl-none";

          const senderLabel = isCurrentUser
            ? "You"
            : isSenderAdmin
              ? isMobile
                ? "Admin"
                : msg.senderName
              : msg.senderName;

          return (
            <div key={msg.id} className={`w-full flex ${alignmentClass} mb-2`}>
              <div
                className={`flex flex-col ${isMobile ? "max-w-[85%]" : "max-w-[75%]"}`}
              >
                <div
                  className={`${isMobile ? "px-3 py-2" : "px-4 py-2"} rounded-3xl break-words ${bubbleColorClass}`}
                >
                  <div className={`text ${isMobile ? "text-sm" : ""}`}>
                    {breakLongWords(msg.text)}
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs text-gray-500 mt-1 ${isMobile ? "px-1" : "px-2"}`}
                >
                  <span>{formatTimestamp(msg.timestamp)}</span>
                  <span>{senderLabel}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {!isAtBottom && (
        <button
          onClick={() => {
            shouldScrollToBottomRef.current = true;
            scrollToBottom(true);
          }}
          className={`fixed ${isMobile ? "bottom-16 right-4 p-1.5" : "bottom-20 right-8 p-2"} bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all z-10`}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
        </button>
      )}

      <div
        className={`${isMobile ? "p-2 mx-2" : "p-2 mx-4"} border-t border-gray-300 bg-white rounded shadow-sm`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
            }}
            className="relative flex items-center w-full"
          >
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className={`w-full ${isMobile ? "p-1.5 text-sm" : "p-2"} border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
            aria-label="Message input"
            />
          <button
            type="submit"
            className={`absolute right-2 ${isMobile ? "px-1.5 py-0.5" : "px-2 py-1"} bg-black text-white rounded hover:bg-gray-700 transition flex items-center justify-center`}
            aria-label="Send message"
            disabled={!input.trim()}
          >
            <Send className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
