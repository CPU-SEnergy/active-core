import { app } from '@/lib/firebaseClient';
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';

const db = getFirestore(app)

export async function GET(req: Request) {
  try {
    const apparelsCollection = collection(db, 'products', 'apparels');
    const q = query(apparelsCollection, where('price', '<', 50));

    const querySnapshot = await getDocs(q);

    const apparels = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(apparels);
  } catch (error) {
    console.error("Error fetching apparels: ", error);
    return NextResponse.json({ error: "Failed to fetch apparels" }, { status: 500 });
  }
}