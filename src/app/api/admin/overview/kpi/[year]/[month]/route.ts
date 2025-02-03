import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";

type MonthId = Schema["kpis"]["sub"]["months"]["Id"];
type YearId = Schema["kpis"]["Id"];

type Params = {
  year: number;
  month: number;
};

export async function GET(request: Request, context: { params: Params}) {
  try {
    getFirebaseAdminApp();

    const { year, month } = context.params;

    const kpiId: YearId = year.toString() as YearId;
    const monthId: MonthId = month.toString() as MonthId;

    const monthsCollection = db.kpis(kpiId).months;

    const monthDoc = await monthsCollection.get(monthId);

    if (!monthDoc || !monthDoc.data) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(monthDoc.data), {
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