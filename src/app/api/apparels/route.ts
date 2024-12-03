import { app } from '@/lib/firebaseClient';
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';

const db = getFirestore(app)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");
    const name = searchParams.get("name");

    const apparelsCollection = collection(db, "products", "apparels");

    let q = query(apparelsCollection);

    if (maxPrice) {
      q = query(q, where("price", "<=", parseFloat(maxPrice)));
    };

    if (minPrice) {
      q = query(q, where("price", ">=", parseFloat(minPrice)));
    }

    if (name) {
      q = query(q, where("name", "==", name));
    }

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