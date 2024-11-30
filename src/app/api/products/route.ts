import { app } from '@/lib/firebaseClient';
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore(app)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const category = searchParams.get('name');

  const productsRef = collection(db, 'products');
  let q = query(productsRef, limit(20));

  if (category) q = query(q, where('name', '==', category));
  if (type) q = query(q, where('type', '==', type));

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json(products);
}