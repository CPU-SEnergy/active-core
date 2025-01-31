import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";

type YearId = Schema["kpis"]["Id"];

type Params = {
  year: number;
};

export async function GET(request: Request, context: { params: Params}) {
  try {
    getFirebaseAdminApp();

    const { year } = context.params;

    const kpiId: YearId = year.toString() as YearId;

    const monthsCollection = db.kpis(kpiId).months;

    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const yearData: Record<string, unknown> = {};

    for (const month of months) {
      const monthDoc = await monthsCollection.get(month);

      if (monthDoc && monthDoc.data) {
        yearData[month] = monthDoc.data;
      } else {
        yearData[month] = null;
      }
    }

    return new Response(JSON.stringify(yearData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error fetching document:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}