"use client"

import type React from "react"

import ChatList from "@/components/ChatList"
import { app } from "@/lib/firebaseClient"
import { getAuth, type User, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"

export default function Layout({ }: { children: React.ReactNode }) {
  const auth = getAuth(app)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      },
      (error) => {
        setError(error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [auth])

  useEffect(() => {
    if (user) {
      user
        .getIdTokenResult(true)
        .then((idTokenResult) => {
          console.log("Custom Claims:", idTokenResult.claims)
          if (idTokenResult.claims.role === "admin" || idTokenResult.claims.role === "cashier") {
            console.log("User is an admin")
            setIsAdmin(true)
          }
        })
        .catch((error) => {
          console.error("Error reading token claims:", error)
        })
    }
  }, [user])

  if (loading) return <div className="pt-5">Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <h2 className="text-center p-8">Please log in to access chats</h2>

  return <div className="flex-1">{user && <ChatList user={user} isAdmin={isAdmin} />}</div>
}
