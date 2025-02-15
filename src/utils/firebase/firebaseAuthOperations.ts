import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { firestore, fireauth } from "@/lib/firebaseClient";
import { RegisterFormProps } from "@/lib/types/registerForm";
import {
  collection,
  doc,
  Timestamp,
  setDoc,
} from "firebase/firestore";

export const createFirebaseUser = async (formResult: RegisterFormProps) => {
  try {
    const auth = fireauth;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formResult.email,
      formResult.password
    );

    const userRef = doc(
      collection(firestore, "users"),
      userCredential.user.uid
    );

    await setDoc(userRef, {
      uid: userCredential.user.uid,
      email: formResult.email,
      role: "customer",
      firstName: formResult.firstName,
      lastName: formResult.lastName,
      dob: formResult.dob,
      sex: formResult.sex,
      createdAt: Timestamp.now(),
    });

    const idToken = await userCredential.user.getIdToken();

    await fetch("/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user: ", error);
    return { success: false, error: (error as Error).message || error };
  }
};

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error("Error sending verification email: ", error);
  }
};
