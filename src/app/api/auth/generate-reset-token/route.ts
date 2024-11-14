import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdminConfig';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const { email } = await req.json();
    console.log(email, "email");

    if (!email) {
      console.log('Email is required');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const usersRef = adminFirestore.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }

    const token = uuidv4();
    const expiration = Date.now() + 3600000;

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      resetToken: token,
      resetTokenExpiry: expiration,
    });

    console.log(`Send email to ${email} with reset link: ${NEXTAUTH_URL}/auth/reset-password?token=${token}`);

    return NextResponse.json({ message: 'Password reset email sent', link: `${NEXTAUTH_URL}/auth/reset-password?token=${token}` });

  } catch (error) {
    console.error('Error in password reset process:', error);
    return NextResponse.json({ error: 'An error occurred while processing the password reset request' }, { status: 500 });
  }
}
