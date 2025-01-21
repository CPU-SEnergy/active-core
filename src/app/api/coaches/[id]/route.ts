import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { ProductType } from "@/lib/types/product";

const db = getFirestore(getFirebaseAdminApp());

type Params = {
  id: string
};

export async function GET(context: { params: Params }) {
  try {
  const { id } = context.params;
  const coachDoc = db.collection(ProductType.COACHES).doc(id);

  const docSnapshot = await coachDoc.get();

  if (!docSnapshot.exists) {
    return NextResponse.json({ error: "Coach not found" }, { status: 404});
  }

  const coach = {
    id: docSnapshot.id,
    ...docSnapshot.data(),
  };

  console.log(coach);
  return NextResponse.json(coach);

  } catch (error) {
   console.error("Error fetching coaches: ", error);
   return NextResponse.json({ error: "Failed to fetch coaches" }); 
  }
}