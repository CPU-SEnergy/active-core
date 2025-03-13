import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const listAllUsers = async (nextPageToken?: string): Promise<unknown[]> => {
      const users: unknown[] = [];
      const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
      listUsersResult.users.forEach((userRecord) => {
        const user = userRecord.toJSON() as { customClaims?: { role?: string } };
        if (user.customClaims?.role === 'cashier') {
          users.push(user);
        }
      });
      if (listUsersResult.pageToken) {
        users.push(...await listAllUsers(listUsersResult.pageToken));
      }
      return users;
    };

    const cashierUsers = await listAllUsers();

    return new Response(JSON.stringify(cashierUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching document: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}