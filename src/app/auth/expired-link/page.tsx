import { redirect } from "next/navigation";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { clientConfig, serverConfig } from "@/lib/config";
import ExpiredLinkPageServer from "@/app/auth/expired-link/ExpiredLinkPageServer";

export default async function ExpiredLinkPage() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (tokens) {
    redirect("/");
  }

  return (
    <main className={"relative min-h-screen flex items-center bg-black text-white px-4"}>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-600 to-green-600 z-0"></div>
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <ExpiredLinkPageServer />
      </div>
    </main>
  );
}
