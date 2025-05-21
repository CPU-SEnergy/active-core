import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";

type Params = {
  id: string;
};

export async function GET(req: NextRequest,context: { params: Params }) {
  try {
  getFirebaseAdminApp();

  const { id } = context.params;
  const numericId = id as Schema["coaches"]["Ref"]["id"];
  const coachData = await db.coaches.get(numericId);

  if (!coachData) {
    return NextResponse.json({ error: "Coach not found" }, { status: 404});
  }

  const cleanCoachData = {
    id: coachData.ref.id,
    ...coachData.data
  }

  return NextResponse.json(cleanCoachData, { status: 200 });

  } catch (error) {
   console.error("Error fetching coaches: ", error);
   return NextResponse.json({ error: "Failed to fetch coaches" }); 
  }
}