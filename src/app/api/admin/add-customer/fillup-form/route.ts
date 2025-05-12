import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

interface Customer {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  sex: string;
  phone: string;
  type: "regular" | "student" | "senior";
}

export async function POST(req: Request) {
  try {
    getFirebaseAdminApp();

    const data: Customer = await req.json();

    if (!data.firstName || !data.lastName || !data.email || !data.sex || !data.dob || !data.type) {
      console.log("Invalid data: ", data);
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const customerRef = await db.customer.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {as: "server"});

    await db.customer.update(customerRef.id, {
      uid: customerRef.id,
    }, {as: "server"});

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