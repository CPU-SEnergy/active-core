import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { app } from "@/lib/firebaseClient";

export const createFirebaseUser = async (email: string, password: string) => {
  const auth = getAuth(app);
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const idToken = await userCredential.user.getIdToken();
  await fetch("/api/login", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return userCredential;
};

export const sendVerificationEmail = async (user: User) => {
  await sendEmailVerification(user);
};
