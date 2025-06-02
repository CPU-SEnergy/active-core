import ChatList from "@/components/ChatList";
import { clientConfig, serverConfig } from "@/lib/config";
import { toUser } from "@/utils/helpers/user";
import { getTokens } from "next-firebase-auth-edge";
import { cookies, headers } from "next/headers";

export default async function Page() {
  const tokens = await getTokens(cookies(), {
    ...serverConfig,
    apiKey: clientConfig.apiKey,
    headers: headers(),
  });

  try {
    if (!tokens) {
      return (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
        </div>
      );
    }

    const isAdmin =
      tokens?.decodedToken?.role === "admin" ||
      tokens?.decodedToken?.role === "cashier";

    const user = toUser(tokens);

    return (
      <div className="flex-1">
        <ChatList user={user} isAdmin={isAdmin} />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }
}
