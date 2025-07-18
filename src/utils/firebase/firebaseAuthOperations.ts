/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { app, getFirebaseAuth as authClient } from "@/lib/firebaseClient";
import type { RegisterFormProps } from "@/lib/types/registerForm";
import { addUserToAlgolia } from "@/app/actions/AddUserToAlgolia";
import { loginWithCredential } from "../../../not-api";
import { checkAndAssignAdminRole } from "./checkAndAssignAdmin";

export const createFirebaseUser = async (formResult: RegisterFormProps) => {

  try {
    const auth = authClient();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formResult.email,
      formResult.password
    );

    const firestore = getFirestore(app);
    const userRef = doc(
      collection(firestore, "users"),
      userCredential.user.uid
    );

    await setDoc(userRef, {
      uid: userCredential.user.uid,
      email: formResult.email,
      phone: formResult.phoneNumber,
      firstName: formResult.firstName,
      lastName: formResult.lastName,
      dob: formResult.dob,
      sex: formResult.sex,
      createdAt: Timestamp.now(),
    });

    await checkAndAssignAdminRole(userCredential.user.uid, formResult.email);

    const algoliaResult = await addUserToAlgolia({
      uuid: userCredential.user.uid,
      firstName: formResult.firstName,
      lastName: formResult.lastName,
      email: formResult.email,
    });

    if (!algoliaResult.success) {
      console.warn("Failed to add user to Algolia:", algoliaResult.error);
    }

    try {
      await loginWithCredential(userCredential);
    } catch (loginError) {
      console.error("Login error (but user was created):", loginError);
    }

    return {
      success: true,
      userId: userCredential.user.uid,
      email: formResult.email,
    };
  } catch (error: any) {
    console.error("Error creating user: ", error);

    let errorMessage = "An unexpected error occurred";

    if (error.code === "auth/email-already-in-use") {
      errorMessage =
        "This email address is already registered. Please use a different email or try signing in.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please choose a stronger password.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage =
        "Email/password accounts are not enabled. Please contact support.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};
