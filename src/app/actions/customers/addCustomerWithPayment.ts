"use server";

import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, type Schema } from "@/lib/schema/firestore";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";

type CustomerData = {
  userId: Schema["users"]["Id"];
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  sex: "male" | "female" | "other";
  type: "regular" | "student" | "senior";
};

export async function addCustomerWithPayment(
  customerData: CustomerData,
  membershipPlanId: Schema["membershipPlans"]["Id"],
  paymentMethod: string,
  isWalkIn = false
) {
  try {
    getFirebaseAdminApp();
    
    const user = await getCurrentUserCustomClaims();
    if (
      !user ||
      (user?.customClaims?.role !== "admin" &&
        user?.customClaims?.role !== "cashier")
    ) {
      return {
        success: false,
        error: "Unauthorized. User role must be admin or cashier.",
      };
    }

    const membershipPlanRef = await db.membershipPlans.get(membershipPlanId);
    if (!membershipPlanRef) {
      return { success: false, error: "Membership plan not found" };
    }

    const membershipPlan = membershipPlanRef.data;

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + membershipPlan.duration);

    let customerId;

    if (isWalkIn) {
      const walkInCustomerData = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        type: customerData.type,
        createdAt: new Date(),
      };

      const customerRef = await db.walkInCustomers.add(walkInCustomerData, {
        as: "server",
      });
      customerId = customerRef.id;
    } else {

      const customerDataForFirestore = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        sex: customerData.sex,
        phone: customerData.phone || "",
        type: customerData.type,
        userId: customerData.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const customerRef = await db.customer.add(customerDataForFirestore, {
        as: "server",
      });
      customerId = customerRef.id;
    }

    const paymentData = {
      id: `PAY-${Date.now()}`,
      paymentMethod: paymentMethod,
      isNewCustomer: true,
      createdAt: new Date(),
      isWalkIn: isWalkIn,
      customer: {
        customerId: isWalkIn ? null : customerData.userId,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        type: customerData.type === "senior" ? "regular" : customerData.type,
      },
      availedPlan: {
        membershipPlanId: membershipPlanId,
        name: membershipPlan.name,
        amount: membershipPlan.price,
        duration: membershipPlan.duration,
        startDate: startDate,
        expiryDate: expiryDate,
      },
    };

    await db.payments.add(paymentData, { as: "server" });

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

    const yearDoc = await db.kpis.get(db.kpis.id(year));
    if (!yearDoc) {
      await db.kpis.set(db.kpis.id(year), { year }, { as: "server" });
    }

    const monthRef = db.kpis(db.kpis.id(year)).months;
    const monthDoc = await monthRef.get(monthRef.id(month));

    if (monthDoc) {
      await monthRef.update(monthRef.id(month), {
        revenue: monthDoc.data.revenue + membershipPlan.price,
        customers: monthDoc.data.customers + 1,
      }, { as: "server" });
    } else {
      await monthRef.set(monthRef.id(month), {
        revenue: membershipPlan.price,
        customers: 1,
      }, { as: "server" });
    }

    const customersDoc = await db.customers.get(db.customers.id('stats'));
    if (customersDoc) {
      await db.customers.update(db.customers.id('stats'), {
        totalCustomers: !isWalkIn 
          ? (customersDoc.data.totalCustomers || 0) + 1 
          : (customersDoc.data.totalCustomers || 0),
        totalWalkInCustomers: isWalkIn 
          ? (customersDoc.data.totalWalkInCustomers || 0) + 1 
          : (customersDoc.data.totalWalkInCustomers || 0)
      }, { as: "server" });
    } else {
      await db.customers.set(db.customers.id('stats'), {
        totalCustomers: !isWalkIn ? 1 : 0,
        totalWalkInCustomers: isWalkIn ? 1 : 0
      }, { as: "server" });
    }

    return {
      success: true,
      customerId: customerId,
      paymentId: paymentData.id,
      message: `${isWalkIn ? "Walk-in customer" : "Customer"} added successfully with payment.`,
    };
  } catch (error) {
    console.error("Error adding customer with payment:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while processing.",
    };
  }
}
