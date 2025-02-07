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
    const totalCustomer = totalCustomersDoc[0];

    let revenueComparison: number | null;
    let customersComparison: number | null;
    let activeCustomersComparison: number | null;
    
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

    const totalMMR = (() => {
      const monthlyActiveCustomers = (monthDoc.data.customers / Number(totalCustomer) * 100)


      return {
        monthlyRevenue: monthDoc.data.revenue,
        monthlyCustomers: monthDoc.data.customers,
        monthlyActiveCustomers,
        monthlyRevenueComparison: revenueComparison,
        monthlyCustomersComparison: customersComparison,
        monthlyActiveCustomersComparison: activeCustomersComparison
      }
    })

    return new Response(JSON.stringify(totalMMR), {
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

