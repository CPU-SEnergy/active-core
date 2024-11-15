"use client";

import { useAuth } from '@/auth/AuthContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to Next.js Firebase Auth Example</h1>
      {user ? (
        <p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          Logged in as: {user.email}
        </p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
