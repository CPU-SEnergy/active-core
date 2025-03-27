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
    const previouYearId: YearId = (year - 1).toString() as YearId;

    const monthsCollection =  db.kpis(kpiId).months;
    const previousYearMonthsCollection =  db.kpis(previouYearId).months;
    console.log(previousYearMonthsCollection)
    const toatlCustomersDoc = await db.customers.all({ as: "server" });
    const totalCustomers = toatlCustomersDoc.length > 0 ? toatlCustomersDoc[0] : null

    if (!totalCustomers) {
      return new Response(JSON.stringify({ error: "Total customers document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] as Schema["kpis"]["sub"]["months"]["Id"][]
    const yearData: Record<string, unknown> = {};
    const previousYearData: Record<string, unknown> = {};
    let totalRevenue = 0;
    let totalMonthlyCustomers = 0;
    let activeCustomers: Schema["kpis"]["Id"] | null = null;

    let previousTotalRevenue = 0;
    let previousTotalMonthlyCustomers = 0;
    let previousActiveCustomers: Schema["kpis"]["Id"] | null = null;

    for (const month of months) {
      const monthDoc = await monthsCollection.get(month, { as: "server" });
      const previousYearMonthsDoc = await previousYearMonthsCollection.get(month, { as: "server" });

      if (monthDoc && monthDoc.data) {
        const { revenue, customers } = monthDoc.data;
        yearData[month] = monthDoc.data;
        totalRevenue += revenue;
        totalMonthlyCustomers += customers;
        activeCustomers = Number((totalMonthlyCustomers / totalCustomers.data.totalCustomers) * 100).toFixed(2) as Schema["kpis"]["Id"];
      } else {
        yearData[month] = null;
      }

      if (previousYearMonthsDoc && previousYearMonthsDoc.data) {
        const { revenue, customers } = previousYearMonthsDoc.data;
        previousYearData[month] = previousYearMonthsDoc.data
        previousTotalRevenue += revenue;
        previousTotalMonthlyCustomers += customers;
        previousActiveCustomers = Number((previousTotalMonthlyCustomers / totalCustomers.data.totalCustomers) * 100).toFixed(2) as Schema["kpis"]["Id"];
      } else {
        previousYearData[month] = null
      }
    }

    const revenueComparison = compareYearlyRevenue(totalRevenue.toString() as Schema["kpis"]["Id"], previousTotalRevenue.toString() as Schema["kpis"]["Id"]);
      const customerComparison = compareYearlyCustomers(totalMonthlyCustomers.toString() as Schema["kpis"]["Id"], previousTotalMonthlyCustomers.toString() as Schema["kpis"]["Id"])
      const activeCustomersComparison = compareYearlyActiveCustomers(activeCustomers, previousActiveCustomers)

    const result = {
      yearData,
      totalRevenue,
      totalMonthlyCustomers,
      activeCustomers,
      revenueComparison,
      customerComparison,
      activeCustomersComparison
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

function compareYearlyRevenue (year: Schema["kpis"]["Id"], previousYear: Schema["kpis"]["Id"] | null) {
  if (!year && !previousYear) {
    return null;
  } else if (!previousYear) {
    return 100;
  } else {
    return Number((Number(year) / Number(previousYear)) * 100).toFixed(2);
  }
}

function compareYearlyCustomers (year: Schema["kpis"]["Id"], previousYear: Schema["kpis"]["Id"] | null) {
  if (!year && !previousYear) {
    return null;
  } else if (!previousYear) {
    return 100;
  } else {
    return Number((Number(year) / Number(previousYear)) * 100).toFixed(2);
  }
}

function compareYearlyActiveCustomers (year: Schema["kpis"]["Id"] | null, previousYear: Schema["kpis"]["Id"] | null) {
  if (!year && !previousYear) {
    return null;
  } else if (!previousYear) {
    return 100;
  } else {
    return Number((Number(year) - Number(previousYear))).toFixed(2);
  }
}
