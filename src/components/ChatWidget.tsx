"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, X, MessageSquare } from "lucide-react"
import {
  getDatabase,
  ref,
  push,
  set,
  query,
  orderByChild,
  limitToLast,
  onChildAdded,
  get,
  endAt,
} from "firebase/database"
import { app } from "@/lib/firebaseClient"
import useGetUserById from "@/utils/helpers/getUserById"
import type { Schema } from "@/lib/schema/firestore"
import { usePathname } from "next/navigation"

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
}

interface ChatWidgetProps {
  userId: string
}

const PAGE_SIZE = 15

const ChatWidget = ({ userId }: ChatWidgetProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState<Schema["users"]["Data"] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const roomId = userId
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const lastScrollHeightRef = useRef<number>(0)
  const lastScrollTopRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialLoadCompleteRef = useRef<boolean>(false)
  const shouldScrollToBottomRef = useRef<boolean>(true)
  const isLoadingOlderRef = useRef<boolean>(false)

  const {
    user: fetchedUser,
    isLoading,
    isError,
  }: {
    user: Schema["users"]["Data"]
    isError: unknown
    isLoading: boolean
  } = useGetUserById(userId)

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const scrollToBottom = () => {
    if (!shouldScrollToBottomRef.current) return
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      })
    }
  }

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser)
    }
  }, [fetchedUser])

  const loadInitialMessages = async () => {
    if (!user) return
    try {
      const database = getDatabase(app)
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
      } else {
        setMessages([])
        setHasMore(false)
      }
      setLoadError(null)
      initialLoadCompleteRef.current = true
      shouldScrollToBottomRef.current = true
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error("Error loading initial messages:", error)
      setLoadError("Failed to load messages")
      setHasMore(false)
    }
  }

  const loadOlderMessages = async () => {
    if (messages.length === 0 || loadingMore || !hasMore) {
      return
    }
    shouldScrollToBottomRef.current = false
    isLoadingOlderRef.current = true
    setLoadingMore(true)
    setLoadError(null)
    try {
      if (containerRef.current) {
        lastScrollHeightRef.current = containerRef.current.scrollHeight
        lastScrollTopRef.current = containerRef.current.scrollTop
      }
      const oldestTimestamp = messages[0]?.timestamp || 0
      const database = getDatabase(app)
      const messagesRef = ref(database, `systemChats/${roomId}/messages`)
      const olderQuery = query(
        messagesRef,
        orderByChild("timestamp"),
        endAt(oldestTimestamp - 1),
        limitToLast(PAGE_SIZE),
      )
      const snapshot = await get(olderQuery)
      if (snapshot.exists()) {
        const data = snapshot.val()
        const olderMessages: Message[] = Object.entries(data).map(([key, value]) => ({
          ...(value as Message),
          id: key,
        }))
        if (olderMessages.length === 0) {
          setHasMore(false)
          return
        }
        olderMessages.sort((a, b) => a.timestamp - b.timestamp)
        setMessages((prev) => [...olderMessages, ...prev])
        setHasMore(olderMessages.length >= PAGE_SIZE)
        setTimeout(() => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight
            const heightDifference = newScrollHeight - lastScrollHeightRef.current
            containerRef.current.scrollTop = lastScrollTopRef.current + heightDifference
          }
        }, 0)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading older messages:", error)
      setLoadError("Failed to load older messages")
      setHasMore(true)
    } finally {
      setLoadingMore(false)
      setTimeout(() => {
        isLoadingOlderRef.current = false
      }, 300)
    }
  }

  useEffect(() => {
    if (user) {
      if (!initialLoadCompleteRef.current) {
        loadInitialMessages()
      }
      const database = getDatabase(app)
      const messagesRef = ref(database, `systemChats/${roomId}/messages`)
      const lastTimestamp = messages.length > 0 ? (messages[messages.length - 1]?.timestamp ?? 0) : 0
      const newMessagesQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(1))
      const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
        const newMsg = snapshot.val() as Message
        const newMessageId = snapshot.key || ""
        if (newMsg.timestamp > lastTimestamp) {
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMessageId)) return prev
            return [...prev, { ...newMsg, id: newMessageId }]
          })
          if (!isLoadingOlderRef.current && shouldScrollToBottomRef.current) {
            setTimeout(scrollToBottom, 100)
          }
        }
      })
      return () => unsubscribe()
    }
  }, [roomId, user, messages])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const isNearTop = container.scrollTop <= 100
      if (isNearTop) {
        if (hasMore && !loadingMore && !isLoadingOlderRef.current) {
          shouldScrollToBottomRef.current = false
          loadOlderMessages()
        }
      }
      const { scrollTop, scrollHeight, clientHeight } = container
      const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20
      if (!isLoadingOlderRef.current) {
        shouldScrollToBottomRef.current = atBottom
      }
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [hasMore, loadingMore])

  useEffect(() => {
    if (isOpen && initialLoadCompleteRef.current && hasMore && !loadingMore && !isLoadingOlderRef.current) {
      const timer = setTimeout(() => {
        if (hasMore && !loadingMore && !isLoadingOlderRef.current) {
          const wasScrollingToBottom = shouldScrollToBottomRef.current
          shouldScrollToBottomRef.current = false
          loadOlderMessages()
          setTimeout(() => {
            shouldScrollToBottomRef.current = wasScrollingToBottom
          }, 500)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, initialLoadCompleteRef.current, hasMore, loadingMore])

  useEffect(() => {
    if (isOpen && messages.length > 0 && !isLoadingOlderRef.current && shouldScrollToBottomRef.current) {
      scrollToBottom()
    }
  }, [isOpen])

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return null
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    if (!user) return
    const database = getDatabase(app)
    const messageRef = push(ref(database, `systemChats/${roomId}/messages`))
    await set(messageRef, {
      senderId: user.uid,
      senderName: `${user.firstName} ${user.lastName}`,
      text: input,
      timestamp: Date.now(),
    })
    setInput("")
    shouldScrollToBottomRef.current = true
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <Button onClick={() => setIsOpen(true)} className="p-8 rounded-full shadow-xl">
          <MessageSquare className="w-16 h-16" />
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300 z-50">
        <CardContent className="p-4">
          <p className="text-center">Please log in to chat.</p>
        </CardContent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300 z-50">
        <CardContent className="p-4">
          <p className="text-center">Loading...</p>
        </CardContent>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300 z-50">
        <CardContent className="p-4">
          <p className="text-center">Error loading chat</p>
        </CardContent>
      </div>
    )
  }

  return (
    <Card className="z-50 fixed bottom-5 right-5 h-[60%] w-96 shadow-xl rounded-2xl bg-white border border-gray-300">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Chat with us Now!</h3>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div ref={containerRef} className="bg-gray-100 overflow-y-auto flex-grow rounded-lg px-2 py-1 space-y-3 w-full">
          {loadingMore && (
            <div className="flex justify-center items-center py-1 w-full sticky top-0 z-10 bg-gray-100/80 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                <svg
                  className="animate-spin h-3 w-3 text-gray-500"
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
                Loading previous messages...
              </div>
            </div>
          )}
          {loadError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs flex justify-between items-center w-full">
              <span>{loadError}</span>
              <button onClick={() => setLoadError(null)} className="text-red-700 font-bold">
                ×
              </button>
            </div>
          )}
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center w-full">No messages yet...</p>
          ) : (
            <>
              {!hasMore && messages.length > 0 && (
                <div className="text-center py-1 mb-2 w-full">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    Beginning of conversation
                  </span>
                </div>
              )}
              {messages.map((msg) => {
                const isUser = msg.senderId === user.uid
                return (
                  <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={`px-3 py-2 rounded-3xl break-words ${
                          isUser ? "bg-black text-white rounded-br-none" : "bg-white text-black border rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 px-2">{formatTimestamp(msg.timestamp)}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div className="flex items-center space-x-2 text-black pt-4 w-full">
          <Input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatWidget
