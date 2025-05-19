import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();

    // Set up date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Fetch payments for today and yesterday
    const [todayPayments, yesterdayPayments] = await Promise.all([
      db.payments.query(($) => [
        $.field("createdAt").gte(startOfToday),
        $.field("createdAt").lt(endOfToday)
      ]),
      db.payments.query(($) => [
        $.field("createdAt").gte(startOfYesterday),
        $.field("createdAt").lt(startOfToday)
      ])
    ]);

    // Calculate daily totals
    const todayRevenue = todayPayments.reduce((sum, payment) => 
      sum + payment.data.availedPlan.amount, 0
    );
    const yesterdayRevenue = yesterdayPayments.reduce((sum, payment) => 
      sum + payment.data.availedPlan.amount, 0
    );

    // Get unique customers count
    const todayCustomers = new Set(todayPayments.map(p => p.data.user.userId)).size;
    const yesterdayCustomers = new Set(yesterdayPayments.map(p => p.data.user.userId)).size;

    // Calculate percentage changes
    const revenueChange = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
      : 100;

    const customerChange = yesterdayCustomers > 0 
      ? ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100 
      : 100;

    const result = {
      date: startOfToday.toISOString().split('T')[0],
      summary: {
        dailyRevenue: todayRevenue,
        dailyCustomers: todayCustomers,
        revenueChange: Number(revenueChange.toFixed(2)),
        customerChange: Number(customerChange.toFixed(2))
      },
      comparison: {
        previousDayRevenue: yesterdayRevenue,
        previousDayCustomers: yesterdayCustomers
      },
      transactions: todayPayments.map(payment => ({
        id: payment.ref.id,
        amount: payment.data.availedPlan.amount,
        customerType: payment.data.user.type,
        planType: payment.data.availedPlan.name,
        timestamp: payment.data.createdAt,
        userId: payment.data.user.userId
      }))
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error fetching daily payments:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch daily payments" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}