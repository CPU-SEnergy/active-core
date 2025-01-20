import { app } from '@/lib/firebaseClient';
import { NextResponse } from 'next/server';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

const db = getFirestore(app);

export async function GET() {
  try {
    const coachCollection = collection(db, "coach");


    const querySnapshot = await getDocs(coachCollection);

    const coaches = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(coaches)
  } catch (error) {
    console.error("Error fetching coaches: ", error);
    return NextResponse.json({ error: "Failed to fetch coaches" });
  }
}