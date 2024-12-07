import { NextApiResponse, NextApiRequest } from 'next';
import { getFirebaseAdminApp } from '@/lib/firebaseAdmin';
import { getFirestore, Query, CollectionReference, DocumentData } from 'firebase-admin/firestore';

const db = getFirestore(getFirebaseAdminApp());

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { coachId, student } = req.query

    let query: Query<DocumentData> | CollectionReference<DocumentData> = db.collection('classes');

    if (coachId) {
      query = query.where('coach_id', '==', coachId);
    }

    if (student === "true") {
      query = query.where('customer_type.student', '==', true);
    }

    const snapshot = await query.get();

    const classes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes: ", error);
    return res.status(500).json({ error: "Failed to fetch classes" });
  }
}