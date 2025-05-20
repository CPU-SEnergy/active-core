import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getTokens } from "next-firebase-auth-edge";
import { cookies, headers } from "next/headers";
import { serverConfig, clientConfig } from "@/lib/config";
import { AuthProvider } from "@/auth/AuthProvider";
import { toUser } from "@/utils/helpers/user";
import Navbar from "@/components/navbar";
import ChatWidget from "../components/ChatWidget";
import { Toaster } from "sonner";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sport and Fitness",
  description: "Sport and Fitness Registration",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokens = await getTokens(cookies(), {
    ...serverConfig,
    apiKey: clientConfig.apiKey,
    headers: headers(),
  });
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const user = tokens ? toUser(tokens) : null;

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        <AuthProvider>
          <Navbar />
          {children}

          {user && <ChatWidget userId={user.uid} />}
          {user &&
            user.customClaims.role !== "admin" &&
            user.customClaims.role !== "cashier" && (
              <ChatWidget userId={user.uid} />
            )}

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
