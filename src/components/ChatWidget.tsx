/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

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
import { useIsMobile } from "@/hooks/use-mobile"

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
  isBot?: boolean
}

interface ChatWidgetProps {
  userId?: string | null
  role?: "admin" | "cashier" | undefined
}

interface FAQ {
  question: string
  answer: string
  keywords: string[]
}

const PAGE_SIZE = 15

const faqs: FAQ[] = [
  {
    question: "What is your location?",
    answer:
      "We are located at 123 Main Street, Downtown City. Our store is open Monday to Friday from 9 AM to 6 PM, and weekends from 10 AM to 4 PM.",
    keywords: ["location", "address", "where", "store", "office"],
  },
  {
    question: "What are your business hours?",
    answer:
      "Our business hours are Monday to Friday: 9 AM - 6 PM, and weekends: 10 AM - 4 PM. We're closed on major holidays.",
    keywords: ["hours", "time", "open", "close", "schedule", "when"],
  },
  {
    question: "How can I contact you?",
    answer:
      "You can contact us via phone at (555) 123-4567, email at info@company.com, or visit our store during business hours.",
    keywords: ["contact", "phone", "email", "call", "reach"],
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer a wide range of services including product sales, customer support, technical assistance, and consultation services.",
    keywords: ["services", "offer", "provide", "what", "do"],
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Yes, we offer delivery services within the city. Delivery usually takes 2-3 business days and costs $10 for orders under $50.",
    keywords: ["delivery", "shipping", "deliver", "send"],
  },
]

const ChatWidget = ({ userId, role }: ChatWidgetProps) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState<Schema["users"]["Data"] | null>(null)
  const [isConnectedToAdmin, setIsConnectedToAdmin] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const roomId = userId || "anonymous"
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const lastScrollHeightRef = useRef<number>(0)
  const lastScrollTopRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialLoadCompleteRef = useRef<boolean>(false)
  const shouldScrollToBottomRef = useRef<boolean>(true)
  const isLoadingOlderRef = useRef<boolean>(false)
  const messagesRef = useRef<Message[]>([]); // Ref to store messages for comparison

  const {
    user: fetchedUser,
    isLoading,
    isError,
  }: {
    user: Schema["users"]["Data"]
    isError: unknown
    isLoading: boolean
  } = userId ? useGetUserById(userId) : { user: null, isLoading: false, isError: null }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    if (isMobile) {
      return `${hours}:${minutes}`
    }

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

  const findBestFAQ = (userInput: string): FAQ | null => {
    const input = userInput.toLowerCase()
    let bestMatch: FAQ | null = null
    let maxMatches = 0

    for (const faq of faqs) {
      const matches = faq.keywords.filter((keyword) => input.includes(keyword.toLowerCase())).length
      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = faq
      }
    }

    return maxMatches > 0 ? bestMatch : null
  }

  const addBotMessage = (text: string, showAdminOption = false) => {
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      senderId: "bot",
      senderName: "Assistant",
      text,
      timestamp: Date.now(),
      isBot: true,
    }

    setMessages((prev) => [...prev, botMessage])
    setTimeout(scrollToBottom, 100)
  }

  const connectToAdmin = async () => {
    // Redirect to login page if user is not logged in
    if (!user) {
      addBotMessage("You need to be logged in to chat with an admin. Redirecting you to the login page...")

      // Give user time to read the message before redirecting
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 2000)
      return
    }

    // If user is logged in, proceed with connecting to admin
    setIsConnectedToAdmin(true)
    addBotMessage("Connecting you to an admin. Please wait a moment...")

    // Create user session for admin chat
    const database = getDatabase(app)
    const roomRef = ref(database, `systemChats/${roomId}`)

    await set(roomRef, {
      createdAt: Date.now(),
      createdBy: user.uid,
      isAnonymous: false,
    })

    const participantRef = ref(database, `systemChats/${roomId}/participants/${user.uid}`)
    await set(participantRef, {
      uid: user.uid,
      name: `${user.firstName} ${user.lastName}`,
      joinedAt: Date.now(),
    })

    setTimeout(() => {
      addBotMessage("You are now connected to our admin team. They will respond shortly!")
    }, 2000)
  }

  const handleFAQResponse = (userInput: string) => {
    const faq = findBestFAQ(userInput)

    if (faq) {
      setTimeout(() => {
        addBotMessage(faq.answer, true)
      }, 500)
    } else {
      setTimeout(() => {
        addBotMessage(
          "I'm not sure about that. Here are some common questions I can help with:\n\n• Location and business hours\n• Contact information\n• Services we offer\n• Delivery options\n\nOr would you like to chat with an admin directly?",
          true,
        )
      }, 500)
    }
  }

  const loadInitialMessages = async () => {
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
    if (!user || messages.length === 0 || loadingMore || !hasMore) {
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
      const messagesRefDB = ref(database, `systemChats/${roomId}/messages`)
      const newMessagesQuery = query(messagesRefDB, orderByChild("timestamp"), limitToLast(1))
      const unsubscribe = onChildAdded(newMessagesQuery, (snapshot) => {
        const newMsg = snapshot.val() as Message
        const newMessageId = snapshot.key || ""

        // Ensure the message is not already in the state
        setMessages((prev) => {
          if (messagesRef.current.find((m) => m.id === newMessageId)) return prev
          const updatedMessages = [...prev, { ...newMsg, id: newMessageId }]
          messagesRef.current = updatedMessages; // Update the ref
          return updatedMessages
        })

        if (!isLoadingOlderRef.current && shouldScrollToBottomRef.current) {
          setTimeout(scrollToBottom, 100)
        }
      })
      return () => unsubscribe()
    }
  }, [roomId, user]) // Removed messages from dependencies

  useEffect(() => {
    if (!user) return
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
  }, [hasMore, loadingMore, user])

  useEffect(() => {
    if (isOpen && user && initialLoadCompleteRef.current && hasMore && !loadingMore && !isLoadingOlderRef.current) {
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
  }, [isOpen, initialLoadCompleteRef.current, hasMore, loadingMore, user])

  useEffect(() => {
    if (isOpen && messages.length > 0 && !isLoadingOlderRef.current && shouldScrollToBottomRef.current) {
      scrollToBottom()
    }
  }, [isOpen])

  // Show welcome message for non-logged-in users
  useEffect(() => {
    if (isOpen && !user && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Hello! Welcome to our support chat. I can help answer some frequently asked questions, or connect you with an admin for personalized assistance. What would you like to know?",
        )
      }, 500)
    }
  }, [isOpen, user])

  // Don't render if on auth/admin pages or if user is admin/cashier
  if (pathname.startsWith("/auth") || pathname.startsWith("/admin") || role === "admin" || role === "cashier") {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input to 260 characters
    if (e.target.value.length <= 260) {
      setInput(e.target.value)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || input.length > 260) return

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      senderId: user?.uid || "anonymous",
      senderName: user ? `${user.firstName} ${user.lastName}` : "You",
      text: input.slice(0, 260),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])

    const currentInput = input
    setInput("")

    // Handle different scenarios
    if (!user && !isConnectedToAdmin) {
      // Non-logged-in user - handle FAQ
      if (
        currentInput.toLowerCase().includes("admin") ||
        currentInput.toLowerCase().includes("connect") ||
        currentInput.toLowerCase().includes("human")
      ) {
        connectToAdmin()
      } else {
        handleFAQResponse(currentInput)
      }
    } else if (user) {
      // Logged-in user - send to Firebase
      const database = getDatabase(app)
      const roomRef = ref(database, `systemChats/${roomId}`)
      const roomSnapshot = await get(roomRef)

      if (!roomSnapshot.exists()) {
        await set(roomRef, {
          createdAt: Date.now(),
          createdBy: user.uid,
        })
      }

      const participantRef = ref(database, `systemChats/${roomId}/participants/${user.uid}`)
      const participantSnapshot = await get(participantRef)

      if (!participantSnapshot.exists()) {
        await set(participantRef, {
          uid: user.uid,
          name: `${user.firstName} ${user.lastName}`,
          joinedAt: Date.now(),
        })
      }

      const messageRef = push(ref(database, `systemChats/${roomId}/messages`))
      await set(messageRef, {
        senderId: user.uid,
        senderName: `${user.firstName} ${user.lastName}`,
        text: currentInput.slice(0, 260),
        timestamp: Date.now(),
      })
    }

    shouldScrollToBottomRef.current = true
    setTimeout(scrollToBottom, 100)
  }

  if (!isOpen) {
    return (
      <div className={`fixed ${isMobile ? "bottom-4 right-4" : "bottom-5 right-5"} z-50`}>
        <Button onClick={() => setIsOpen(true)} className={`${isMobile ? "p-4" : "p-8"} rounded-full shadow-xl`}>
          <MessageSquare className={`${isMobile ? "w-8 h-8" : "w-16 h-16"}`} />
        </Button>
      </div>
    )
  }

  return (
    <Card
      className={`z-50 fixed ${
        isMobile ? "bottom-2 left-2 right-2 top-20 h-auto" : "bottom-5 right-5 h-[60%] w-96"
      } shadow-xl rounded-2xl bg-white border border-gray-300`}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`${isMobile ? "text-base" : "text-lg"} font-semibold`}>
            {user ? "Chat with us Now!" : "Support Chat"}
          </h3>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div
          ref={containerRef}
          className={`bg-gray-100 overflow-y-auto flex-grow rounded-lg ${
            isMobile ? "px-2 py-1" : "px-2 py-1"
          } space-y-3 w-full`}
        >
          {user && loadingMore && (
            <div className="flex justify-center items-center py-1 w-full sticky top-0 z-10 bg-gray-100/80 backdrop-blur-sm">
              <div
                className={`flex items-center gap-1 ${
                  isMobile ? "text-xs" : "text-xs"
                } text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm`}
              >
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
                {isMobile ? "Loading..." : "Loading previous messages..."}
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
              {user && !hasMore && messages.length > 0 && (
                <div className="text-center py-1 mb-2 w-full">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    Beginning of conversation
                  </span>
                </div>
              )}
              {messages.map((msg) => {
                const isUser = msg.senderId === (user?.uid || "anonymous") && !msg.isBot
                const isBot = msg.isBot || msg.senderId === "bot"
                return (
                  <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
                    <div className={`flex flex-col ${isMobile ? "max-w-[85%]" : "max-w-[75%]"}`}>
                      <div
                        className={`${isMobile ? "px-3 py-2" : "px-3 py-2"} rounded-3xl break-words ${
                          isUser
                            ? "bg-black text-white rounded-br-none"
                            : isBot
                              ? "bg-blue-100 text-blue-900 border border-blue-200 rounded-bl-none"
                              : "bg-white text-black border rounded-bl-none"
                        }`}
                      >
                        <div className={`${isMobile ? "text-sm" : ""} whitespace-pre-line`}>{msg.text}</div>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${isMobile ? "px-1" : "px-2"}`}>
                        {formatTimestamp(msg.timestamp)} • {isBot ? "Assistant" : isUser ? "You" : msg.senderName}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick FAQ buttons for non-logged-in users */}
        {!user && !isConnectedToAdmin && (
          <div className="flex flex-wrap gap-1 py-2 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const userMessage = {
                  id: `user-${Date.now()}`,
                  senderId: "anonymous",
                  senderName: "You",
                  text: "What is your location?",
                  timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, userMessage]);
                handleFAQResponse("What is your location?");
                scrollToBottom();
              }}
            >
              Location?
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const userMessage = {
                  id: `user-${Date.now()}`,
                  senderId: "anonymous",
                  senderName: "You",
                  text: "What are your business hours?",
                  timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, userMessage]);
                handleFAQResponse("What are your business hours?");
                scrollToBottom();
              }}
            >
              Hours?
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const userMessage = {
                  id: `user-${Date.now()}`,
                  senderId: "anonymous",
                  senderName: "You",
                  text: "Connect me to admin",
                  timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, userMessage]);
                connectToAdmin();
                scrollToBottom();
              }}
            >
              Talk to Admin
            </Button>
          </div>
        )}

        <div className={`flex items-center space-x-2 text-black ${isMobile ? "pt-2" : "pt-4"} w-full`}>
          <div className="relative flex items-center w-full">
            <Input
              type="text"
              placeholder={
                user ? "Type a message (max 260 characters)" : "Ask a question or type 'admin' to connect..."
              }
              value={input}
              onChange={handleInputChange}
              maxLength={260}
              className={`flex-1 ${isMobile ? "text-sm" : ""}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            {input.length > 0 && (
              <span className={`absolute right-12 ${isMobile ? "text-xs" : "text-xs"} text-gray-500`}>
                {input.length}/260
              </span>
            )}
          </div>
          <Button onClick={sendMessage} disabled={!input.trim()} className={isMobile ? "px-3" : ""}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatWidget
