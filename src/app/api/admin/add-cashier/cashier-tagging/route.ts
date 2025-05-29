import { getFirebaseAdminApp } from '@/lib/firebaseAdmin';
import { db } from '@/lib/schema/firestore';
import { getFirebaseAuth, getTokens } from 'next-firebase-auth-edge';
import { serverConfig } from '@/lib/config';
import { toUser } from '@/utils/helpers/user';
import { cookies } from 'next/headers';

const { setCustomUserClaims, getUser } = getFirebaseAuth({
  serviceAccount: serverConfig.serviceAccount,
  apiKey: serverConfig.apiKey,
});

export async function POST(request: Request) {
  try {
    // Initialize Firebase Admin
    getFirebaseAdminApp();
    // Get and validate token
    const tokens = await getTokens(cookies(), serverConfig);
    const tokenUser = tokens ? toUser(tokens) : null;

    if (!tokenUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (tokenUser.customClaims.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get request body
    const { targetUid } = await request.json();

    if (!targetUid) {
      return new Response(JSON.stringify({ error: 'Target UID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update user claims
    await setCustomUserClaims(targetUid, {
      role: 'cashier',
    });

    // Add to cashier collection
    await db.cashier.set(targetUid, {
      userId: targetUid,
      createdAt: new Date(),
    }, {as: 'server'});

    // Get updated user data
    const updatedUser = await getUser(targetUid);

    return new Response(JSON.stringify({
      success: true,
      customClaims: updatedUser?.customClaims
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error adding cashier:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}