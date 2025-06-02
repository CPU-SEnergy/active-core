/* eslint-disable @typescript-eslint/no-unused-vars */
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

type Params = {
  year: string;
  month: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    getFirebaseAdminApp();

    const { year, month } = params;
    const monthId = month.padStart(2, "0");

    console.log(`Fetching data for year: ${year}, month: ${monthId}`);

    // This matches exactly how data is written in addCustomerWithPayment
    const yearDoc = await db.kpis.get(db.kpis.id(year));
    if (!yearDoc) {
      console.log(`Year document not found for ${year}`);
      return Response.json({
        monthlyRevenue: 0,
        monthlyCustomers: 0,
        monthlyActive: 0,
        monthlyRevenueComparison: 0,
        monthlyCustomersComparison: 0,
        monthlyActiveCustomersComparison: 0,
        isDataAvailable: false,
        message: `No data available for ${year}-${monthId}`,
      });
    }

    const monthRef = db.kpis(db.kpis.id(year)).months;
    const monthDoc = await monthRef.get(monthRef.id(monthId));

    if (!monthDoc) {
      console.log(`Month document not found for ${year}-${monthId}`);
      return Response.json({
        monthlyRevenue: 0,
        monthlyCustomers: 0,
        monthlyActive: 0,
        monthlyRevenueComparison: 0,
        monthlyCustomersComparison: 0,
        monthlyActiveCustomersComparison: 0,
        isDataAvailable: false,
        message: `No data available for ${year}-${monthId}`,
      });
    }

    console.log(`Found month document for ${year}-${monthId}:`, monthDoc.data);

    // Get previous month data
    let previousMonthDoc = null;
    const previousMonth =
      Number.parseInt(monthId) === 1
        ? "12"
        : (Number.parseInt(monthId) - 1).toString().padStart(2, "0");
    const previousYear =
      Number.parseInt(monthId) === 1
        ? (Number.parseInt(year) - 1).toString()
        : year;

    try {
      const previousMonthRef = db.kpis(db.kpis.id(previousYear)).months;
      previousMonthDoc = await previousMonthRef.get(
        previousMonthRef.id(previousMonth)
      );
      console.log(
        `Previous month document found for ${previousYear}-${previousMonth}:`,
        previousMonthDoc?.data
      );
    } catch (error) {
      console.log(
        `No previous month document found for ${previousYear}-${previousMonth}`
      );
    }

    // Get total customers
    let totalCustomers = { totalCustomers: 1000 }; // Default fallback
    try {
      const customersDoc = await db.customers.get(db.customers.id("stats"));
      if (customersDoc) {
        totalCustomers = customersDoc.data;
        console.log("Total customers found:", totalCustomers);
      }
    } catch (error) {
      console.error("Error fetching total customers:", error);
    }

    // Calculate comparisons
    const revenueComparison = previousMonthDoc
      ? ((monthDoc.data.revenue - previousMonthDoc.data.revenue) /
          previousMonthDoc.data.revenue) *
        100
      : 100;

    const customersComparison = previousMonthDoc
      ? ((monthDoc.data.customers - previousMonthDoc.data.customers) /
          previousMonthDoc.data.customers) *
        100
      : 100;

    const currentActiveRate =
      (monthDoc.data.customers / totalCustomers.totalCustomers) * 100;
    const previousActiveRate = previousMonthDoc
      ? (previousMonthDoc.data.customers / totalCustomers.totalCustomers) * 100
      : 0;
    const activeCustomersComparison = currentActiveRate - previousActiveRate;

    const result = {
      monthlyRevenue: monthDoc.data.revenue,
      monthlyCustomers: monthDoc.data.customers,
      monthlyActive: currentActiveRate,
      monthlyRevenueComparison: Number(revenueComparison.toFixed(2)),
      monthlyCustomersComparison: Number(customersComparison.toFixed(2)),
      monthlyActiveCustomersComparison: Number(
        activeCustomersComparison.toFixed(2)
      ),
      isDataAvailable: true,
    };

    console.log("Returning result:", result);
    return Response.json(result);
  } catch (error: unknown) {
    console.error("Error fetching monthly data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
