import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const coachCollection = await db.coaches.all();

    const coaches = coachCollection.map((data) => ({
      id: data.ref.id,
      ...data.data,
    }));

    console.log("coaches api", coaches);
    return NextResponse.json(coaches);
  } catch (error) {
    console.error("Error fetching coaches: ", error);
    return NextResponse.json({ error: "Failed to fetch coaches" });
  }
}
