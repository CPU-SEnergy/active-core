'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, UserInfo } from 'firebase/auth';
import { Claims } from 'next-firebase-auth-edge/lib/auth/claims';
import { app } from '@/lib/firebaseClient';
export interface User extends UserInfo {
  idToken: string;
  emailVerified: boolean;
  customClaims: Claims;
}

export interface AuthContextValue {
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (firebaseUser) => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then(async (idToken) => {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const customClaims = idTokenResult.claims;
          setUser({
            ...firebaseUser,
            idToken,
            emailVerified: firebaseUser.emailVerified,
            customClaims,
          });
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
