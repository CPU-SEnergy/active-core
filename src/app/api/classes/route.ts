import { NextResponse } from "next/server";
import { db } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const $ = db.classes.query.build();

    $.field("isDeleted").not(true);

    const results = await $.run();

    const cleanClasses = results.map((doc) => ({
      id: doc.ref.id,
      ...doc.data,
    }));

    return NextResponse.json(cleanClasses, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
