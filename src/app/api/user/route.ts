import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    getFirebaseAdminApp();

    const userDocs = await db.users.all({ as: "server" });
    const users: Schema["users"]["Data"][] = userDocs.map((doc) => doc.data);

    if (!users) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
