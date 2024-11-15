"use client"

import { useAuth } from '@/auth/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to Next.js Firebase Auth Example</h1>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}