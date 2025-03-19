import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

interface Customer {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  dob: Date;
  membershipPlan: string;
}

export async function POST(req: Request) {
  try {
    getFirebaseAdminApp();

    const data: Customer = await req.json();

    if (!data.uid || !data.firstName || !data.lastName || !data.email || !data.sex || !data.dob || !data.membershipPlan) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newCustomer = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustomer: true,
      
    }

    await db.users.add(newCustomer);
  } catch (error) {
    console.error("Error fetching document: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json"},
    })
  }
}