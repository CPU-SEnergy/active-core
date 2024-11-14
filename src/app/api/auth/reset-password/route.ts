import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdminConfig';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    console.log(token);

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const usersRef = adminFirestore.collection('users');
    const snapshot = await usersRef.where('resetToken', '==', token).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const userDoc = snapshot.docs[0];
    const { resetTokenExpiry } = userDoc.data();

    if (Date.now() > resetTokenExpiry) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    await userDoc.ref.update({
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return NextResponse.json({ message: 'Password has been reset successfully' });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'An error occurred while resetting the password' }, { status: 500 });
  }
}
