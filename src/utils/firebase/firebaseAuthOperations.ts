import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { app, getFirebaseAuth } from "@/lib/firebaseClient";
import { RegisterFormProps } from "@/lib/types/registerForm";
import {
  collection,
  doc,
  getFirestore,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { addUserToAlgolia } from "@/app/actions/AddUserToAlgolia";
import { loginWithCredential } from "../../../api";

export const createFirebaseUser = async (formResult: RegisterFormProps) => {
  try {
    const auth = getFirebaseAuth();

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
      phoneNumber: formResult.phoneNumber || null,
      firstName: formResult.firstName,
      lastName: formResult.lastName,
      dob: formResult.dob,
      sex: formResult.sex,
      createdAt: Timestamp.now(),
    });

    await addUserToAlgolia({
      uuid: userCredential.user.uid,
      firstName: formResult.firstName,
      lastName: formResult.lastName,
      email: formResult.email,
    });

    await loginWithCredential(userCredential);
    // await sendVerificationEmail(userCredential.user);

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
