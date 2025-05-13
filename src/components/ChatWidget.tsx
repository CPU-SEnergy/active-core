"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, X, MessageSquare } from "lucide-react"
import { getDatabase, ref, push, set, query, orderByChild, limitToLast, onChildAdded } from "firebase/database"
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

const ChatWidget = ({ userId }: ChatWidgetProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState<Schema["users"]["Data"] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const roomId = userId

  const {
    user: fetchedUser,
    isLoading,
    isError,
  }: {
    user: Schema["users"]["Data"]
    isError: unknown
    isLoading: boolean
  } = useGetUserById(userId)

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

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser)
    }
  }, [fetchedUser])

  useEffect(() => {
    if (user) {
      const database = getDatabase(app)
      const messagesRef = ref(database, `systemChats/${roomId}/messages`)
      const messagesQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(50))

      const unsubscribe = onChildAdded(messagesQuery, (snapshot) => {
        const newMsg = snapshot.val() as Message
        const newMessageId = snapshot.key || ""

        setMessages((prev) => {
          if (prev.find((m) => m.id === newMessageId)) return prev
          return [...prev, { ...newMsg, id: newMessageId }]
        })

        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      })

      return () => unsubscribe()
    }
  }, [roomId, user])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

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
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5">
        <Button onClick={() => setIsOpen(true)} className="p-8 rounded-full shadow-xl">
          <MessageSquare className="w-16 h-16" />
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300">
        <CardContent className="p-4">
          <p className="text-center">Please log in to chat.</p>
        </CardContent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300">
        <CardContent className="p-4">
          <p className="text-center">Loading...</p>
        </CardContent>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300">
        <CardContent className="p-4">
          <p className="text-center">Error loading chat</p>
        </CardContent>
      </div>
    )
  }

  return (
    <Card className="z-50 fixed bottom-5 right-5 h-[60%] w-96 shadow-xl rounded-2xl bg-white border border-gray-300">
      <CardContent className="p-4 h-full max-w-fit">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Chat with us Now!</h3>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div ref={containerRef} className="bg-gray-100 overflow-y-auto h-[70%] rounded-lg px-2 py-1 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet...</p>
          ) : (
            messages.map((msg) => {
              const isUser = msg.senderId === user.uid
              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
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
            })
          )}
        </div>

        <div className="flex items-center space-x-2 text-black pt-4">
          <Input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatWidget
