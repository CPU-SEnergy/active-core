import { NextRequest, NextResponse } from "next/server";
import { refreshNextResponseCookies } from "next-firebase-auth-edge/lib/next/cookies";
import { getFirebaseAuth, getTokens } from "next-firebase-auth-edge";
import { serverConfig } from "@/lib/config";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

const { setCustomUserClaims, getUser } = getFirebaseAuth({
  serviceAccount: serverConfig.serviceAccount,
  apiKey: serverConfig.apiKey,
});

export async function POST(request: NextRequest) {
  try {
    getFirebaseAdminApp();

    const tokens = await getTokens(request.cookies, serverConfig);
    if (!tokens) {
      throw new Error("Cannot update custom claims of unauthenticated user");
    }

    const { targetUid } = await request.json();

    if (!targetUid) {
      return new NextResponse(
        JSON.stringify({ error: "Target UID is required" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Remove role claim by setting it to undefined (removes the role)
    await setCustomUserClaims(targetUid, { role: undefined });

    // Remove cashier doc from Firestore
    await db.cashier.remove(targetUid);

    const user = await getUser(targetUid);

    const response = new NextResponse(
      JSON.stringify({
        customClaims: user!.customClaims,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );

    return refreshNextResponseCookies(request, response, serverConfig);
  } catch (error) {
    console.error("Error removing cashier role: ", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
