import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

type Params = {
  year: string;
};

export async function GET(request: Request, context: { params: Params }) {
  try {
    getFirebaseAdminApp();

    if (!context.params) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { year } = context.params;

    if (!year) {
      return new Response(JSON.stringify({ error: "Invalid parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const earnings = await getEarningsForYear(year);
    const memberships = await getMembershipsForYear(year);

    const result = {
      earnings,
      memberships,
    };

    return new Response(JSON.stringify(result), {
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

async function getEarningsForYear(year: string): Promise<number[]> {
  const earnings: number[] = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(
      `${year}-${month.toString().padStart(2, "0")}-01T00:00:00Z`
    );
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const paymentsCollection = await db.payments.query(($) => [
      $.field("createdAt").gte(startDate),
      $.field("createdAt").lt(endDate),
    ]);

    const totalAmount = paymentsCollection.reduce((total, doc) => {
      return total + doc.data.availedPlan.amount;
    }, 0);

    earnings.push(totalAmount);
  }

  return earnings;
}

async function getMembershipsForYear(
  year: string
): Promise<{ regular: number; student: number }> {
  let regularCount = 0;
  let studentCount = 0;

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(
      `${year}-${month.toString().padStart(2, "0")}-01T00:00:00Z`
    );
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const paymentsCollection = await db.payments.query(($) => [
      $.field("createdAt").gte(startDate),
      $.field("createdAt").lt(endDate),
    ]);

    regularCount += paymentsCollection.filter(
      (doc) => doc.data.customer.type === "regular"
    ).length;
    studentCount += paymentsCollection.filter(
      (doc) => doc.data.customer.type === "student"
    ).length;
  }

  return { regular: regularCount, student: studentCount };
}
