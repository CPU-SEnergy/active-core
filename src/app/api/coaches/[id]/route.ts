import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { ProductType } from "@/lib/types/product";

const db = getFirestore(getFirebaseAdminApp());

type Params = {
  id: string;
};

export async function GET(req: NextRequest,context: { params: Params }) {
  try {
  const { id } = context.params;
  const numericId = Number(id);
  console.log(`Fetching coach with ID: ${numericId}`); // Log the ID
  const coachDoc = db.collection(ProductType.COACHES);
  const querySnapshot = await coachDoc.where("id", "==", numericId).get();

  if (querySnapshot.empty) {
    console.log(`Coach with ID ${numericId} not found`); // Log the ID
    return NextResponse.json({ error: "Coach not found" }, { status: 404});
  }

  const coaches = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))[0];

  console.log(coaches);
  return NextResponse.json(coaches);

  } catch (error) {
   console.error("Error fetching coaches: ", error);
   return NextResponse.json({ error: "Failed to fetch coaches" }); 
  }
}