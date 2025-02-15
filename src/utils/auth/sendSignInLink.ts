"use client";

import { app } from "@/lib/firebaseClient";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
const auth = getAuth(app);

export default async function sendSignInLink(email: string) {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/finish-signup`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    console.log("Email sent!");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}
