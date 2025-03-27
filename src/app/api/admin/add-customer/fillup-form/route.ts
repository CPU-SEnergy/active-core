import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

interface Customer {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: "male" | "female" | "other";
  dob: Date;
  membershipPlan: string;
  type: "regular" | "student" | "senior";
}

export async function POST(req: Request) {
  try {
    getFirebaseAdminApp();

    const data: Customer = await req.json();

    if (!data.uid || !data.firstName || !data.lastName || !data.email || !data.sex || !data.dob || !data.membershipPlan || !data.type) {
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

    await db.users.add(newCustomer, {as: "server"});

    return new Response(JSON.stringify({ message: "Customer added successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error adding customer: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json"},
    })
  }
}