import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";

export async function GET(req: NextRequest,
  { params }: { params: { id: string } }) {
    
  try {
  const id = params.id as Schema["coaches"]["Ref"]["id"];

  if (!id) {
    return NextResponse.json(
      { error: "Coaches ID is required" },
      { status: 400 }
    );
  }

  getFirebaseAdminApp();

  const coachData = await db.coaches.get(id);

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