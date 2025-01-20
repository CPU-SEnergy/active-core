import { app } from '@/lib/firebaseClient';
import { NextResponse } from 'next/server';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { ProductType } from '@/lib/types/product';

const db = getFirestore(app);

export async function GET() {
  try {
    const coachCollection = collection(db, ProductType.COACHES);


    const querySnapshot = await getDocs(coachCollection);

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