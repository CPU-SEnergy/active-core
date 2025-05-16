import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import CustomTrigger from "./customTrigger";
import { getTokens } from "next-firebase-auth-edge";
import { cookies, headers } from "next/headers";
import { clientConfig, serverConfig } from "@/lib/config";

interface UserRole {
  role: "admin" | "cashier";
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(cookies(), {
    ...serverConfig,
    apiKey: clientConfig.apiKey,
    headers: headers(),
  });
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const userRole = tokens?.decodedToken.role as UserRole["role"];

  if (!tokens) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
      </div>
    );
  }

  return (
    <SidebarProvider>

      <AdminSidebar role="cashier" />

      <AdminSidebar role={userRole} />

      <main className="w-full h-full">
          <CustomTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
