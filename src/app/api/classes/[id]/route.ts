import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { ProductType } from "@/lib/types/product";

const db = getFirestore(getFirebaseAdminApp());

type Params = {
  id: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const { id } = context.params;
    const numericId = Number(id);
    const classDoc = db.collection(ProductType.CLASSES);

    const querySnapshot = await classDoc.where("sports_id", "==", numericId).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const classes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetchin coaches: ", error);
    return NextResponse.json({ error: "Failed to fetch classes" });
  }
};
