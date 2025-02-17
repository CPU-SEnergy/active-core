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
    const memberships = await getMembeshipsForYear(year);

    const result = {
      earnings,
      memberships
    }

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
    const startDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const paymentsCollection = await db.payments.query(($) => [
      $.field("createdAt").gte(startDate),
      $.field("createdAt").lt(endDate)
    ]);

    const totalAmount = paymentsCollection.reduce((total, doc) => {
      return total + doc.data.availedPlan.amount;
    }, 0);

    earnings.push(totalAmount);
  }

  return earnings;
}

async function getMembeshipsForYear(year: string): Promise<number[]> {
  const memberships: number[] = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const membershipPlanCollection = await db.membershipPlan.query(($) =>
      $.field("price").eq({ regular: 0, student: 0, discount: 0 })
    )

    const regularMembership = membershipPlanCollection.reduce((total, doc) => {
      return total + (doc.data.price.regular || 0);
    }, 0);

    memberships.push(regularMembership);

    const studentMembership = membershipPlanCollection.reduce((total, doc) => {
      return total + (doc.data.price.student || 0);
    }, 0);

    memberships.push(studentMembership);

    const discountMembership = membershipPlanCollection.reduce((total, doc) => {
      return total + (doc.data.price.discount || 0);
    }, 0)

    memberships.push(discountMembership);
  }
  return memberships
}