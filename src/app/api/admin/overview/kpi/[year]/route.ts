/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

type Params = {
  year: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    getFirebaseAdminApp();

    const { year } = params;
    const previousYear = (Number.parseInt(year) - 1).toString();

    // This matches exactly how data is written in addCustomerWithPayment
    const yearDoc = await db.kpis.get(db.kpis.id(year));
    if (!yearDoc) {
      return Response.json({
        yearData: {},
        totalRevenue: 0,
        totalMonthlyCustomers: 0,
        activeCustomers: "0.00",
        revenueComparison: "0",
        customerComparison: "0",
        activeCustomersComparison: "0",
        isDataAvailable: false,
        message: `No data available for year ${year}`,
      });
    }

    // Get total customers
    let totalCustomers = { totalCustomers: 1000 }; // Default fallback
    try {
      const customersDoc = await db.customers.get(db.customers.id("stats"));
      if (customersDoc) {
        totalCustomers = customersDoc.data;
      }
    } catch (error) {
      console.error("Error fetching total customers:", error);
    }

    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const yearData: Record<string, any> = {};
    const previousYearData: Record<string, any> = {};
    let totalRevenue = 0;
    let totalMonthlyCustomers = 0;
    let hasAnyData = false;

    let previousTotalRevenue = 0;
    let previousTotalMonthlyCustomers = 0;

    // Get current year data
    for (const month of months) {
      try {
        const monthRef = db.kpis(db.kpis.id(year)).months;
        const monthDoc = await monthRef.get(monthRef.id(month));

        if (monthDoc) {
          yearData[month] = monthDoc.data;
          totalRevenue += monthDoc.data.revenue;
          totalMonthlyCustomers += monthDoc.data.customers;
          hasAnyData = true;
        } else {
          yearData[month] = null;
        }
      } catch (error) {
        yearData[month] = null;
      }
    }

    // Get previous year data
    for (const month of months) {
      try {
        const previousMonthRef = db.kpis(db.kpis.id(previousYear)).months;
        const previousMonthDoc = await previousMonthRef.get(
          previousMonthRef.id(month)
        );

        if (previousMonthDoc) {
          previousYearData[month] = previousMonthDoc.data;
          previousTotalRevenue += previousMonthDoc.data.revenue;
          previousTotalMonthlyCustomers += previousMonthDoc.data.customers;
        } else {
          previousYearData[month] = null;
        }
      } catch (error) {
        previousYearData[month] = null;
      }
    }

    // Calculate active customers percentage
    const activeCustomers =
      totalCustomers.totalCustomers > 0
        ? (
            (totalMonthlyCustomers / totalCustomers.totalCustomers) *
            100
          ).toFixed(2)
        : "0.00";

    const previousActiveCustomers =
      totalCustomers.totalCustomers > 0
        ? (
            (previousTotalMonthlyCustomers / totalCustomers.totalCustomers) *
            100
          ).toFixed(2)
        : "0.00";

    // Calculate comparisons
    const revenueComparison =
      previousTotalRevenue > 0
        ? (
            ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) *
            100
          ).toFixed(2)
        : "100";

    const customerComparison =
      previousTotalMonthlyCustomers > 0
        ? (
            ((totalMonthlyCustomers - previousTotalMonthlyCustomers) /
              previousTotalMonthlyCustomers) *
            100
          ).toFixed(2)
        : "100";

    const activeCustomersComparison = (
      Number.parseFloat(activeCustomers) -
      Number.parseFloat(previousActiveCustomers)
    ).toFixed(2);

    const result = {
      yearData,
      totalRevenue,
      totalMonthlyCustomers,
      activeCustomers,
      revenueComparison,
      customerComparison,
      activeCustomersComparison,
      isDataAvailable: hasAnyData,
      message: hasAnyData ? undefined : `No data available for year ${year}`,
    };

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
