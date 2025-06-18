export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    getFirebaseAdminApp();

    const url = new URL(request.url);
    const idsParam = url.searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "No user IDs provided" },
        { status: 400 }
      );
    }

    const ids = idsParam.split(",");

    const usersData = await Promise.all(
      ids.map(async (id) => {
        const userDoc = await db.users.get(db.users.id(id), { as: "server" });
        if (!userDoc) return null;
        const user = userDoc.data;
        return user
          ? {
              id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            }
          : null;
      })
    );

    const filteredUsers = usersData.filter(Boolean);

    return NextResponse.json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
