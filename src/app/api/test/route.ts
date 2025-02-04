import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const usersDocs = await db.users.all({ as: "server" });

    const cleanUsers = usersDocs.map((doc) => ({
      id: doc.ref.id,
      ...doc.data,
    }));

    return NextResponse.json(cleanUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
