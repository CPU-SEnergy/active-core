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

    const previousMonth = monthId === "01" ? "12" as MonthId : (Number(month)- 1).toString().padStart(2, "0") as MonthId;
    const previousMonthDoc = await monthsCollection.get(previousMonth, { as: "server" });

    const totalCustomers = await db.customers.all({ as: "server" });
    const totalCustomer = totalCustomers[0];
    
    
    if (previousMonth === "12") {
      const previousYear = year - 1;
      const previousYearId: YearId = previousYear.toString() as YearId;
      const previousMonthDoc = await db.kpis(previousYearId).months.get(previousMonth, { as: "server" });

      if (monthDoc && previousMonthDoc && totalCustomer) {
        compareKpiMonths(monthDoc, previousMonthDoc);
        console.log(compareKpiCurrentCustomers(monthDoc, previousMonthDoc));
        console.log(compareActiveCustomers(monthDoc, totalCustomer));
      } else if (monthDoc && totalCustomer){
        compareKpiMonths(monthDoc, null);
        console.log(compareKpiCurrentCustomers(monthDoc, previousMonthDoc));
        console.log(compareActiveCustomers(monthDoc, totalCustomer));
      }
    } else {
      if (monthDoc && previousMonthDoc && totalCustomer) {
        compareKpiMonths(monthDoc, previousMonthDoc);
        console.log(compareKpiCurrentCustomers(monthDoc, previousMonthDoc));
        console.log(compareActiveCustomers(monthDoc, totalCustomer));
      } else if (monthDoc && totalCustomer){
        compareKpiMonths(monthDoc, null);
        console.log(compareKpiCurrentCustomers(monthDoc, previousMonthDoc));
        console.log(compareActiveCustomers(monthDoc, totalCustomer));
      }
    }

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

function compareKpiMonths (currentMonth: Schema["kpis"]["sub"]["months"]["Doc"], previousMonth: Schema["kpis"]["sub"]["months"]["Doc"] | null) {
  if (!currentMonth && !previousMonth) {
    return null;
  } else if (!previousMonth) {
    return 0
  } else {
    return currentMonth.data.revenue / previousMonth.data.revenue;
  }
}

function compareKpiCurrentCustomers (currentMonth: Schema["kpis"]["sub"]["months"]["Doc"], previousMonth: Schema["kpis"]["sub"]["months"]["Doc"] | null) {
  if (!currentMonth && !previousMonth) {
    return null;
  } else if (!previousMonth) {
    return 0
  } else {
    return currentMonth.data.customers / previousMonth.data.customers;
  }
}

function compareActiveCustomers (currentMonth: Schema["kpis"]["sub"]["months"]["Doc"], totalCustomers: Schema["customers"]["Doc"]) {
  if (!currentMonth && !totalCustomers) {
    return null;
  } else {
    return currentMonth.data.customers / totalCustomers.data.totalCustomers;
  }
}