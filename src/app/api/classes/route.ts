import { NextResponse } from 'next/server';
import { getFirebaseAdminApp } from '@/lib/firebaseAdmin';
import { getFirestore, Query, CollectionReference, DocumentData } from 'firebase-admin/firestore';

const db = getFirestore(getFirebaseAdminApp());

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coach_id")

    let query: Query<DocumentData> | CollectionReference<DocumentData> = db.collection('classes');

    if (coachId) {
      query = query.where('coach_id', '==', coachId);
    }

    const snapshot = await query.get();

    const classes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(classes)
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes: ", error);
    return NextResponse.json({ error: "Failed to fetch classes" });
  }
}