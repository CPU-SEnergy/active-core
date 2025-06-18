import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";

interface CustomerInput {
  userId: Schema["users"]["Id"];
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

    const data: CustomerInput = await req.json();

    if (
      !data.userId ||
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.sex ||
      !data.dob ||
      !data.type
    ) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const customerRef = await db.customer.add(
      {
        ...data,
        userId: data.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { as: "server" }
    );

    return new Response(
      JSON.stringify({
        message: "Customer added successfully",
        id: customerRef.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding customer: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
