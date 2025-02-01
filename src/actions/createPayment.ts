"use server";

import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { Schema, db } from "@/lib/schema/firestore";

export default async function createPayment(data: Schema["payments"]["Data"]) {
  getFirebaseAdminApp();

  console.log(data, "actions");

  // db.payments.add(data, createdAt:, { as: "server" });
  const fixedData = {
    ...data,
    availedPlan: {
      ...data.availedPlan,
      amount: parseFloat(data.availedPlan.amount.toString()),
    },
  };

  const payments = await db.payments.add(
    ($) => ({
      ...fixedData,
      createdAt: $.serverDate(),
    }),
    { as: "server" }
  );

  console.log(payments, "server actions payment");
  return { message: "Added successfully" };
}
