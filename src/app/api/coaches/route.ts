import { app } from '@/lib/firebaseClient';
import { NextResponse } from 'next/server';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore';

const db = getFirestore(app);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    const coachCollection = collection(db, "coach");

    let q = query(coachCollection);

    if (name) {
      q = query(q, where("coach_name", "==", name))
    }

    const querySnapshot = await getDocs(q);

    const coaches = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(coaches)
  } catch (error) {
    console.error("Error fetching coaches: ", error)
    NextResponse.json({ error: "Failed to fetch coaches" }, { status: 500 }); 
  }
}