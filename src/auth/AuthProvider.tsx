"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { Claims } from "next-firebase-auth-edge/lib/auth/claims";
import { fireauth } from "@/lib/firebaseClient";
export interface User extends UserInfo {
  idToken: string;
  emailVerified: boolean;
  customClaims: Claims;
}

export const useAuth = () => useContext(AuthContext);

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireauth, (firebaseUser) => {
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
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
