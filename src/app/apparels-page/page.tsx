import { app } from '@/lib/firebaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { collection, query, where, getDocs, limit, startAfter, getFirestore } from 'firebase/firestore';

const db = getFirestore(app)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, type, pageSize = 20, lastDoc } = req.query;

  const productsRef = collection(db, 'products');
  let q = query(productsRef);

  if (name) q = query(q, where('name', '==', name));
  if (type) q = query(q, where('type', '==', type));

  if (lastDoc) {
    const snapshot = await getDocs(query(q, startAfter(lastDoc), limit(Number(pageSize))))
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } else {
    const snapshot = await getDocs(query(q, limit(Number(pageSize))));
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  }
}