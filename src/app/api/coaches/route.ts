import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const $ = db.coaches.query.build();

    $.field("isDeleted").not(true);

    const results = await $.run();

    const coaches = results.map((data) => ({
      id: data.ref.id,
      ...data.data,
    }));

    return NextResponse.json(coaches);
  } catch (error) {
    console.error("Error fetching coaches: ", error);
    return NextResponse.json({ error: "Failed to fetch coaches" });
  }
}
