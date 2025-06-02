import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Audiowide } from "next/font/google"
import "./globals.css"
import { getTokens } from "next-firebase-auth-edge"
import { cookies, headers } from "next/headers"
import { serverConfig, clientConfig } from "@/lib/config"
import { AuthProvider } from "@/auth/AuthProvider"
import { toUser } from "@/utils/helpers/user"
import Navbar from "@/components/navbar"
import ChatWidget from "../components/ChatWidget"
import { Toaster } from "sonner"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
  display: "swap",
})

export const metadata: Metadata = {
  title: "IMAA - Iloilo Martial Arts Association",
  description:
    "A platform for martial arts enthusiasts in Iloilo City - Ilonggo Martial Artists Association",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IMAA",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "IMAA - Iloilo Martial Arts Association",
    title: "IMAA - Iloilo Martial Arts Association",
    description:
      "A platform for martial arts enthusiasts in Iloilo City - Ilonggo Martial Artists Association",
  },
  twitter: {
    card: "summary",
    title: "IMAA - Iloilo Martial Arts Association",
    description:
      "A platform for martial arts enthusiasts in Iloilo City - Ilonggo Martial Artists Association",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const tokens = await getTokens(cookies(), {
    ...serverConfig,
    apiKey: clientConfig.apiKey,
    headers: headers(),
  })
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const user = tokens ? toUser(tokens) : null;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${audiowide.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        suppressHydrationWarning
      >
        <AuthProvider user={user}>
          <Navbar />
          {children}

          {/* Render ChatWidget for all users, passing user info when available */}
          <ChatWidget
            userId={user?.uid || null}
            role={user ? (tokens?.decodedToken?.role as "admin" | "cashier") : undefined}
          />

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
