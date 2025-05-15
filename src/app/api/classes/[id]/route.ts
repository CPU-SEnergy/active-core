import { NextRequest, NextResponse } from "next/server";
import { db, Schema } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

type Params = {
  id: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    getFirebaseAdminApp();

    const { id } = context.params;
    const numericId = id as Schema["classes"]["Ref"]["id"];

    const classData = await db.classes.get(numericId);

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