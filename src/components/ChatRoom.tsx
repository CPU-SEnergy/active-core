"use client"

import type React from "react"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
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
} from "firebase/database"
import { app, getFirebaseAuth } from "@/lib/firebaseClient"
import type { User } from "firebase/auth"
import { useRead } from "@typesaurus/react"
import { db, type Schema } from "@/lib/schema/firestore"
import { Send, ArrowDown, ArrowUp, MessageSquare } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
  isAdmin: boolean
  userNumber?: number
}

interface ChatRoomProps {
  roomId: string
  user: User
  onOpenChatList?: () => void
}

const PAGE_SIZE = 15

export function ChatRoom({ roomId, user, onOpenChatList }: ChatRoomProps) {
  const database = getDatabase(app)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const auth = getFirebaseAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(false)
  const [userNumbers, setUserNumbers] = useState<Record<string, number>>({})
  const lastScrollHeightRef = useRef<number>(0)
  const lastScrollTopRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialLoadCompleteRef = useRef<boolean>(false)
  const shouldScrollToBottomRef = useRef<boolean>(true)
  const isLoadingOlderRef = useRef<boolean>(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isNearTop, setIsNearTop] = useState(false)
  const firstMessageKeyRef = useRef<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const checkScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const [userData] = useRead(db.users.get(user.uid as Schema["users"]["Id"]))
  const userDisplayName =
    userData?.data.firstName && userData?.data.lastName
      ? `${userData.data.firstName} ${userData.data.lastName}`
      : "Anonymous"

  // Check user role for admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      const idTokenResult = await auth.currentUser?.getIdTokenResult(true)
      const role = idTokenResult?.claims.role
      setIsAdmin(role === "admin" || role === "cashier")
    }

    checkAdminStatus()
  }, [auth])

  // Function to format timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)

    // Get hours and minutes with leading zeros
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    // Get day, month, and year
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0") // Months are 0-based
    const year = date.getFullYear()

    return isMobile ? `${hours}:${minutes}` : `${day}/${month}/${year} ${hours}:${minutes}`
  }

  // Scroll to bottom function with multiple approaches for reliability
  const scrollToBottom = (force = false) => {
    if (!shouldScrollToBottomRef.current && !force) {
      return
    }

    // Try multiple approaches to ensure scrolling works
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }

    if (containerRef.current) {
      // Approach 1: Direct scrollTop setting
      containerRef.current.scrollTop = containerRef.current.scrollHeight

      // Approach 2: Use requestAnimationFrame for next paint frame
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      })
    }
  }

  // Use layout effect to ensure scroll happens before browser paint
  useLayoutEffect(() => {
    if (initialLoadCompleteRef.current && messages.length > 0) {
      scrollToBottom(true)
    }
  }, [initialLoadCompleteRef.current, messages.length])

  // Track unique users and assign numbers
  useEffect(() => {
    const uniqueUsers = new Set<string>()
    const newUserNumbers: Record<string, number> = {}

    messages.forEach((msg) => {
      if (!uniqueUsers.has(msg.senderId)) {
        uniqueUsers.add(msg.senderId)
        newUserNumbers[msg.senderId] = uniqueUsers.size
      }
    })

    setUserNumbers(newUserNumbers)

    // Update first message key for pagination
    if (messages.length > 0) {
      firstMessageKeyRef.current = messages[0].id
    }
  }, [messages])

  // Load initial messages
  const loadInitialMessages = async () => {
    try {
      const messagesRef = ref(database, `systemChats/${roomId}/messages`)
      const messagesQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(PAGE_SIZE))
      const snapshot = await get(messagesQuery)

      if (snapshot.exists()) {
        const data = snapshot.val()
        const messagesList: Message[] = Object.entries(data).map(([key, value]) => ({
          ...(value as Message),
          id: key,
        }))
        messagesList.sort((a, b) => a.timestamp - b.timestamp)
        setMessages(messagesList)
        setHasMore(messagesList.length >= PAGE_SIZE)

        // Store the first message key for future queries
        if (messagesList.length > 0) {
          firstMessageKeyRef.current = messagesList[0].id
        }
      } else {
        setMessages([])
        setHasMore(false)
      }

      setLoadError(null)
      initialLoadCompleteRef.current = true
      shouldScrollToBottomRef.current = true

      // Force scroll to bottom after initial load with multiple attempts
      setTimeout(() => scrollToBottom(true), 0)
      setTimeout(() => scrollToBottom(true), 100)
      setTimeout(() => scrollToBottom(true), 300)
    } catch (error) {
      console.error("Error loading initial messages:", error)
      setMessages([])
      setHasMore(false)
      setLoadError("Failed to load messages. Please try again.")
    }
  }

  // Load older messages - improved for reliability
  const loadOlderMessages = async () => {
    if (messages.length === 0 || loadingMore || !hasMore || isLoadingOlderRef.current) {
      return
    }

    // Set loading state
    setLoadingMore(true)
    setLoadError(null)
    shouldScrollToBottomRef.current = false
    isLoadingOlderRef.current = true

    try {
      // Save current scroll position BEFORE any DOM changes
      if (containerRef.current) {
        lastScrollHeightRef.current = containerRef.current.scrollHeight
        lastScrollTopRef.current = containerRef.current.scrollTop
      }

      // Try a different approach - use orderByKey instead of orderByChild
      const messagesRef = ref(database, `systemChats/${roomId}/messages`)

      // If we have a first message key, use it to query messages before it
      let olderQuery
      if (firstMessageKeyRef.current) {
        olderQuery = query(
          messagesRef,
          orderByKey(),
          endAt(firstMessageKeyRef.current),
          limitToLast(PAGE_SIZE + 1), // +1 to account for the duplicate we'll filter out
        )
      } else {
        // Fallback to timestamp-based query
        const oldestTimestamp = messages[0]?.timestamp || 0
        olderQuery = query(messagesRef, orderByChild("timestamp"), endAt(oldestTimestamp - 1), limitToLast(PAGE_SIZE))
      }

      const snapshot = await get(olderQuery)

      if (snapshot.exists()) {
        const data = snapshot.val()

        let olderMessages: Message[] = Object.entries(data).map(([key, value]) => ({
          ...(value as Message),
          id: key,
        }))

        // If using orderByKey, filter out the duplicate message (our current first message)
        if (firstMessageKeyRef.current) {
          olderMessages = olderMessages.filter((msg) => msg.id !== firstMessageKeyRef.current)
        }

        if (olderMessages.length === 0) {
          setHasMore(false)
          return
        }

        olderMessages.sort((a, b) => a.timestamp - b.timestamp)

        // Update first message key for next query
        if (olderMessages.length > 0 && olderMessages[0]) {
          firstMessageKeyRef.current = olderMessages[0].id
        }

        // Update messages state
        setMessages((prev) => [...olderMessages, ...prev])
        setHasMore(olderMessages.length >= PAGE_SIZE)

        // Restore scroll position after new messages are added
        // Use multiple attempts with increasing delays for reliability
        const restoreScrollPosition = () => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight
            const heightDifference = newScrollHeight - lastScrollHeightRef.current
            containerRef.current.scrollTop = lastScrollTopRef.current + heightDifference
          }
        }

        requestAnimationFrame(restoreScrollPosition)
        setTimeout(restoreScrollPosition, 50)
        setTimeout(restoreScrollPosition, 150)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading older messages:", error)
      setLoadError("Failed to load older messages. Please try again.")
      setHasMore(true) // Keep this true so user can retry
    } finally {
      setLoadingMore(false)

      // Reset the loading flag after a delay
      setTimeout(() => {
        isLoadingOlderRef.current = false
      }, 500)
    }
  }

  // Load initial messages when component mounts
  useEffect(() => {
    loadInitialMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  // Set up periodic check for scroll position
  useEffect(() => {
    // Check scroll position every 500ms to see if we're near the top
    checkScrollIntervalRef.current = setInterval(() => {
      const container = containerRef.current
      if (container) {
        const isNearTop = container.scrollTop <= 300
        if (isNearTop && hasMore && !loadingMore && !isLoadingOlderRef.current) {
          shouldScrollToBottomRef.current = false
          loadOlderMessages()
        }
      }
    }, 500)

    return () => {
      if (checkScrollIntervalRef.current) {
        clearInterval(checkScrollIntervalRef.current)
      }
    }
  }, [hasMore, loadingMore])

  // Handle scroll to load more messages and track scroll position
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      // Check if we're near the top to load more messages
      // Using an EXTREMELY generous threshold (300px) to ensure it triggers reliably
      const isNearTop = container.scrollTop <= 300

      // Update UI indicator
      setIsNearTop(isNearTop)

      // Immediate check without debounce for better responsiveness
      if (isNearTop && hasMore && !loadingMore && !isLoadingOlderRef.current) {
        shouldScrollToBottomRef.current = false
        loadOlderMessages()
      }

      // Check if we're near the bottom to update auto-scroll behavior
      const { scrollTop, scrollHeight, clientHeight } = container
      const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50

      setIsAtBottom(atBottom)
      shouldScrollToBottomRef.current = atBottom
    }

    container.addEventListener("scroll", handleScroll)

    // Initial check when component mounts
    handleScroll()

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore])

  // Listen for new messages
  useEffect(() => {
    const messagesRef = ref(database, `systemChats/${roomId}/messages`)
    const lastTimestamp = messages.length > 0 ? (messages[messages.length - 1]?.timestamp ?? 0) : 0
    const newMessagesQuery = query(messagesRef, orderByChild("timestamp"), startAt(lastTimestamp + 1))

    const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
      const newMsg = snapshot.val() as Message
      setMessages((prev) => {
        if (prev.find((m) => m.id === snapshot.key)) return prev
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = newMsg
        return [...prev, { id: snapshot.key || "", ...rest }]
      })

      // Only scroll to bottom for new messages if we're already near the bottom
      if (shouldScrollToBottomRef.current) {
        setTimeout(scrollToBottom, 100)
      }
    })

    return () => unsubscribe()
  }, [roomId, messages, database])

  // Update user presence and typing status
  useEffect(() => {
    if (!userDisplayName) return
    const userRef = ref(database, `systemChats/${roomId}/users/${user.uid}`)
    set(userRef, {
      name: userDisplayName,
      online: true,
      lastActive: Date.now(),
      isTyping: false,
    })

    onDisconnect(userRef).update({
      online: false,
      lastActive: Date.now(),
      isTyping: false,
    })

    return () => {
      // Update status when component unmounts
      set(userRef, {
        name: userDisplayName,
        online: false,
        lastActive: Date.now(),
        isTyping: false,
      })
    }
  }, [roomId, user.uid, userDisplayName, database])

  // Handle typing indicator
  const updateTypingStatus = (isTyping: boolean) => {
    const userRef = ref(database, `systemChats/${roomId}/users/${user.uid}`)
    set(userRef, {
      name: userDisplayName,
      online: true,
      lastActive: Date.now(),
      isTyping,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    // Update typing status
    if (!isTyping) {
      setIsTyping(true)
      updateTypingStatus(true)
    }

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set a new timeout to clear typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      updateTypingStatus(false)
    }, 2000)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    try {
      // Clear typing status immediately
      setIsTyping(false)
      updateTypingStatus(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      const messageRef = push(ref(database, `systemChats/${roomId}/messages`))
      await set(messageRef, {
        senderId: user.uid,
        senderName: userDisplayName || "Anonymous",
        text: input,
        isAdmin: isAdmin,
        timestamp: Date.now(),
      })

      setInput("")
      shouldScrollToBottomRef.current = true
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    }
  }

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Manual trigger for loading previous messages
  const handleLoadPrevious = () => {
    if (!loadingMore && hasMore && !isLoadingOlderRef.current) {
      shouldScrollToBottomRef.current = false
      loadOlderMessages()
    }
  }

  return (
    userData && (
      <div className="flex flex-col h-full">
        <div className={`p-3 ${isMobile ? "pt-4" : "pt-10"} pb-3 bg-gray-50 flex items-center justify-between`}>
          <h2 className="text-lg font-bold truncate">
            Chat with {userData?.data.firstName + " " + userData?.data.lastName || ""}
          </h2>

          {/* Action buttons in header */}
          <div className="flex items-center gap-2">
            {/* Load previous button */}
            {hasMore && !loadingMore && (
              <button
                onClick={handleLoadPrevious}
                className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-blue-600 transition-colors"
              >
                <ArrowUp className="h-3 w-3" />
                <span className={isMobile ? "hidden" : "inline"}>Load Previous</span>
              </button>
            )}

            {/* Chat list button */}
            <button
              onClick={onOpenChatList}
              className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-green-600 transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              <span className={isMobile ? "hidden" : "inline"}>Chat List</span>
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className={`flex-grow overflow-y-auto border border-gray-300 ${isMobile ? "p-2 mx-2" : "p-4 mx-5"} rounded bg-gray-50 shadow-sm`}
          aria-live="polite"
          style={{ height: "calc(100% - 140px)", maxHeight: "600px" }}
        >
          {/* Loading indicator at the top - only shows when loading */}
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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

          {/* Error message */}
          {loadError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs flex justify-between items-center w-full mb-3">
              <span>{loadError}</span>
              <button onClick={() => setLoadError(null)} className="text-red-700 font-bold">
                ×
              </button>
            </div>
          )}

          {/* No messages state */}
          {messages.length === 0 && !loadingMore && (
            <div className="text-center py-10 text-gray-500">No messages yet. Start the conversation!</div>
          )}

          {/* End of history message */}
          {!hasMore && messages.length > 0 && (
            <div className="text-center py-2 mb-3 w-full">
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                Beginning of conversation
              </span>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            const isSenderAdmin = msg.isAdmin
            const isCurrentUser = msg.senderId === user.uid
            const userNumber = userNumbers[msg.senderId]

            return (
              <div key={msg.id} className={`w-full flex ${isSenderAdmin ? "justify-end" : "justify-start"} mb-2`}>
                <div className={`flex flex-col ${isMobile ? "max-w-[85%]" : "max-w-[75%]"}`}>
                  <div
                    className={`${isMobile ? "px-3 py-2" : "px-4 py-2"} rounded-3xl break-words ${
                      isSenderAdmin
                        ? isCurrentUser
                          ? "bg-blue-700 text-white rounded-br-none"
                          : "bg-blue-500/85 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    <div className={`${isMobile ? "text-sm" : ""}`}>{msg.text}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-gray-500 mt-1 ${isMobile ? "px-1" : "px-2"}`}>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                    <span>
                      {isSenderAdmin
                        ? isMobile
                          ? "Admin"
                          : msg.senderName
                        : isCurrentUser
                          ? "You"
                          : `User ${userNumber}`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* This invisible div helps with scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {!isAtBottom && (
          <button
            onClick={() => {
              shouldScrollToBottomRef.current = true
              scrollToBottom(true)
            }}
            className={`fixed ${isMobile ? "bottom-16 right-4 p-1.5" : "bottom-20 right-8 p-2"} bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all z-10`}
            aria-label="Scroll to bottom"
          >
            <ArrowDown className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
          </button>
        )}

        <div className={`${isMobile ? "p-2 mx-2" : "p-2 mx-4"} border-t border-gray-300 bg-white rounded shadow-sm`}>
          {isTyping && (
            <div className="text-xs text-gray-500 mb-1 ml-2">
              <span className="inline-flex items-center">
                <span className="animate-pulse mr-1">●</span>
                <span className="animate-pulse mr-1" style={{ animationDelay: "0.2s" }}>
                  ●
                </span>
                <span className="animate-pulse mr-1" style={{ animationDelay: "0.4s" }}>
                  ●
                </span>
                Typing...
              </span>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className={`flex-grow ${isMobile ? "p-1.5 text-sm" : "p-2"} border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Message input"
            />
            <button
              type="submit"
              className={`absolute right-2 ${isMobile ? "px-1.5 py-0.5" : "px-2 py-1"} bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center`}
              aria-label="Send message"
              disabled={!input.trim()}
            >
              <Send className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
            </button>
          </form>
        </div>
      </div>
    )
  )
}

export default ChatRoom
