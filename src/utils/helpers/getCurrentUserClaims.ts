"server-only";

import { clientConfig, serverConfig } from "@/lib/config";
import { getFirebaseAuth, getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const { getUser } = getFirebaseAuth({
  serviceAccount: serverConfig.serviceAccount,
  apiKey: serverConfig.apiKey,
});

export async function getCurrentUserCustomClaims() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    redirect("/auth/login");
  }

  const user = await getUser(tokens.decodedToken.uid);
  console.log("customClaim", user);
  return user;
}
