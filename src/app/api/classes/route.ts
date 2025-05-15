import { NextResponse } from 'next/server';
import { db } from '@/lib/schema/firestore';
import { getFirebaseAdminApp } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    getFirebaseAdminApp();

    const classesCollection = await db.classes.all();

    const cleanClasses = classesCollection.map((doc) => ({
      id: doc.ref.id,
      ...doc.data,
    }));

    if (!cleanClasses || cleanClasses.length === 0) {
      return NextResponse.json({ error: 'No classes found' }, { status: 404 });
    }

    console.log(cleanClasses);

    return NextResponse.json(cleanClasses, { status: 200 });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}