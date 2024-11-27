import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/firebaseClient";

export default async function VerifyEmail() {
  const auth = getAuth(app);
  const continueUrl = window.location.href;
  try {
    const isValid = isSignInWithEmailLink(auth, continueUrl);
    if (!isValid) {
      return false;
    }
    const email = window.localStorage.getItem("emailForAuth") as string;
    if (!email) {
      // you can display a prompt to get user email
      return false;
    }
    const res = await signInWithEmailLink(auth, email, continueUrl);
    window.localStorage.removeItem("emailForAuth");
    return true;
  } catch (error) {
    console.log(error);
    return false;

  };
}