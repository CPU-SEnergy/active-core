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

    const previousMonth = monthId === "01" ? "12" as MonthId : (Number(month) - 1).toString().padStart(2, "0") as MonthId;
    const previousMonthDoc = await monthsCollection.get(previousMonth, { as: "server" });

    const totalCustomersDoc = await db.customers.all({ as: "server" });
    const totalCustomer = totalCustomersDoc.length > 0 ? totalCustomersDoc[0] : null;

    if (!totalCustomer) {
      return new Response(JSON.stringify({ error: "Total customers document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let revenueComparison: number | null = 0;
    let customersComparison: number | null = 0;
    let activeCustomersComparison: number | null = 0;
    
    if (previousMonth === "12") {
      const previousYear = year - 1;
      const previousYearId: YearId = previousYear.toString() as YearId;
      const previousMonthDoc = await db.kpis(previousYearId).months.get(previousMonth, { as: "server" });

      if (monthDoc && previousMonthDoc && totalCustomer) {

        revenueComparison = compareKpiMonths(monthDoc, previousMonthDoc);
        customersComparison = compareKpiCurrentCustomers(monthDoc, previousMonthDoc);
        activeCustomersComparison = compareActiveCustomers(monthDoc, totalCustomer, previousMonthDoc);

      } else if (monthDoc && totalCustomer) {

        revenueComparison = compareKpiMonths(monthDoc, previousMonthDoc);
        customersComparison = compareKpiCurrentCustomers(monthDoc, previousMonthDoc);
        activeCustomersComparison = compareActiveCustomers(monthDoc, totalCustomer, previousMonthDoc);

      }
    } else {
      if (monthDoc && previousMonthDoc && totalCustomer) {

        revenueComparison = compareKpiMonths(monthDoc, previousMonthDoc);
        customersComparison = compareKpiCurrentCustomers(monthDoc, previousMonthDoc);
        activeCustomersComparison = compareActiveCustomers(monthDoc, totalCustomer, previousMonthDoc);

      } else if (monthDoc && totalCustomer){

        revenueComparison = compareKpiMonths(monthDoc, previousMonthDoc);
        customersComparison = compareKpiCurrentCustomers(monthDoc, previousMonthDoc);
        activeCustomersComparison = compareActiveCustomers(monthDoc, totalCustomer, previousMonthDoc);

      } else {
        return new Response(JSON.stringify({ error: "Document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (!monthDoc || !monthDoc.data) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const monthlyActiveCustomers = (monthDoc.data.customers / totalCustomer.data.totalCustomers) * 100;

    const result = {
      monthlyRevenue: monthDoc.data.revenue,
      monthlyCustomers: monthDoc.data.customers,
      monthlyActive: monthlyActiveCustomers,
      monthlyRevenueComparison: revenueComparison,
      monthlyCustomersComparison: customersComparison,
      monthlyActiveCustomersComparison: activeCustomersComparison
    }
    
    return new Response(JSON.stringify(result), {
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
    return 100
  } else {
    return Number((((currentMonth.data.revenue - previousMonth.data.revenue) / previousMonth.data.revenue) * 100).toFixed(2));
  }
}

function compareKpiCurrentCustomers (currentMonth: Schema["kpis"]["sub"]["months"]["Doc"], previousMonth: Schema["kpis"]["sub"]["months"]["Doc"] | null) {
  if (!currentMonth && !previousMonth) {
    return null;
  } else if (!previousMonth) {
    return 100
  } else {
    return Number((((currentMonth.data.customers - previousMonth.data.customers) / previousMonth.data.customers) * 100).toFixed(2));
  }
}

function compareActiveCustomers (currentMonth: Schema["kpis"]["sub"]["months"]["Doc"], totalCustomers: Schema["customers"]["Doc"], previousMonth: Schema["kpis"]["sub"]["months"]["Doc"] | null) {
  if (!currentMonth && !totalCustomers) {
    return null;
  } else if (!previousMonth) {
    return 100
  } else {

    const current = getActiveCustomersPercent(currentMonth, totalCustomers);
    const previous = getActiveCustomersPercent(previousMonth, totalCustomers);

    return Number((((current - previous))).toFixed(2)); 
  }
} 

function getActiveCustomersPercent (month: Schema["kpis"]["sub"]["months"]["Doc"], totalCustomers: Schema["customers"]["Doc"]) {
  return ((month.data.customers / totalCustomers.data.totalCustomers) * 100);
}

