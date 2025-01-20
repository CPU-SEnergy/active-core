import { NextResponse } from 'next/server';
import { getFirebaseAdminApp } from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import { ProductType } from '@/lib/types/product';

const db = getFirestore(getFirebaseAdminApp());

export async function GET() {
  try {
    const classesCollection = db.collection(ProductType.CLASSES);

    const querySnapshot = await classesCollection.get();

    const classes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(classes)
    return NextResponse.json(classes)
  } catch (error) {
    console.error("Error fetching classes: ", error);
    return NextResponse.json({ error: "Failed to fetch classes" });
  }
}