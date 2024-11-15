import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getTokens } from 'next-firebase-auth-edge';
import { cookies, headers } from 'next/headers';
import { serverConfig, clientConfig } from '@/lib/config'; // Make sure to import clientConfig
import { AuthProvider } from '@/auth/AuthProvider';
import { toUser } from '@/utils/helper-functions/user';

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

  const user = tokens ? toUser(tokens) : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
        }}
      >
        <AuthProvider user={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
