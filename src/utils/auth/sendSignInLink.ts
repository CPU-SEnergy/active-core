"use client";

import { fireauth } from "@/lib/firebaseClient";
import { sendSignInLinkToEmail } from "firebase/auth";

export default async function sendSignInLink(email: string) {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/finish-signup`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(fireauth, email, actionCodeSettings);
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
