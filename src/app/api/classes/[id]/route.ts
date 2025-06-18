import { NextRequest, NextResponse } from "next/server";
import { db, Schema } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";


export async function GET(req: NextRequest,
  { params }: { params: { id: string } }) {
  try {
    getFirebaseAdminApp();

  const id = params.id as Schema["classes"]["Ref"]["id"];

  if (!id) {
    return NextResponse.json(
      { error: "Class ID is required" },
      { status: 400 }
    );
  }

    const classData = await db.classes.get(id);

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const cleanClassData = {
      id: classData.ref.id,
      ...classData.data
    }

    return NextResponse.json(cleanClassData, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes: ", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}