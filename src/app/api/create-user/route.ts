import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      email,
      uid,
      role = "customer",
      firstName,
      lastName,
      dob,
      sex,
    } = data;

    const adminFirestore = getFirebaseAdminApp().firestore();

    const userRef = adminFirestore.collection("users").doc(uid);

    await userRef.set({
      uid,
      email,
      role,
      firstName,
      lastName,
      dob,
      sex,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log("User added to Firestore" + firstName);

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error storing user in Firestore:", error);

    return new Response(JSON.stringify({ message: "Failed to create user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
