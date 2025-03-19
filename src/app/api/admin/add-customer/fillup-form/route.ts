import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore"

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      email,
      uid,
      role = "customer",
      firstName,
      lastName,
      dob,
    } = data;
  } catch (error) {
    console.error("Error fetching document: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json"},
    })
  }
}