import { NextRequest, NextResponse } from 'next/server';
import { refreshNextResponseCookies } from 'next-firebase-auth-edge/lib/next/cookies';
import { getFirebaseAuth, getTokens } from 'next-firebase-auth-edge';
import { serverConfig } from '@/lib/config';

const { setCustomUserClaims, getUser } = getFirebaseAuth({
  serviceAccount: serverConfig.serviceAccount,
  apiKey: serverConfig.apiKey,
});

export async function POST(request: NextRequest) {
  const tokens = await getTokens(request.cookies, serverConfig);

  if (!tokens) {
    throw new Error('Cannot update custom claims of unauthenticated user');
  }

  const { targetUid } = await request.json()

  if (!targetUid) {
    return new NextResponse(
      JSON.stringify({ error: 'Target UID is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      } 
    );
  }

  await setCustomUserClaims(targetUid, {
    role: 'cashier',
  });

  const user = await getUser(targetUid);
  console.log('User custom claims updated', user!.customClaims);
  const response = new NextResponse(
    JSON.stringify({
      customClaims: user!.customClaims,
    }), {
      status: 200,
      headers: { 'content-type': 'application/json'}
    }
  );

  console.log(await getUser(targetUid));

  return refreshNextResponseCookies(request, response, serverConfig);
}