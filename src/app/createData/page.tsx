"use client";

import createPayment from "@/actions/createPayment";
import { Schema } from "@/lib/schema/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Schema["payments"]["Data"]>();
  const onSubmit = async (data: Schema["payments"]["Data"]) => {
    const payments = await createPayment(data);

    console.log(payments);
  };

  console.log(watch("user.name"));
  console.log(watch("isNewCustomer"), "types", typeof watch("isNewCustomer"));
  console.log(watch("availedPlan.amount"), typeof watch("availedPlan.amount"));

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}` as unknown as Date; // Returns the date in yyyy-mm-dd format
  };

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const today = new Date();
      const durations = [1, 7, 30];
      const randomDuration =
        durations[Math.floor(Math.random() * durations.length)];

      const startDate = today as Date;
      const expiryDate = new Date(today) as Date;
      expiryDate.setDate(
        expiryDate.getDate() + (randomDuration ?? 0)
      ) as unknown as Date;

      console.log(formatDate(startDate), formatDate(expiryDate), "date");
      console.log(typeof startDate, typeof expiryDate, "types");

      setValue("availedPlan.duration", randomDuration ?? 0);
      setValue("availedPlan.startDate", formatDate(startDate));
      setValue("availedPlan.expiryDate", formatDate(expiryDate));
      setInitialized(true);
    }
  }, [setValue, initialized]);

  const startDateValue = watch("availedPlan.startDate") || "";
  const expiryDateValue = watch("availedPlan.expiryDate") || "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col gap-3"
    >
      <input
        defaultValue={crypto.randomUUID()}
        {...register("id", { required: true })}
        placeholder="Payment ID"
      />
      {errors.id && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue={"cash"}
        {...register("paymentMethod", { required: true })}
        placeholder="Payment Method"
      />
      {errors.paymentMethod && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue="M4eOJ2D6nhdJ2z6ZKMsF4HLwQzo1"
        {...register("user.userId", { required: true })}
        placeholder="User ID"
      />
      {errors.user?.userId && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue="Ian Clyde Tejada"
        {...register("user.name", { required: true })}
        placeholder="User Name"
      />
      {errors.user?.name && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue="/pictures/Clyde.png"
        {...register("user.imageUrl", { required: true })}
        placeholder="User Image URL"
      />
      {errors.user?.imageUrl && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue={crypto.randomUUID()}
        {...register("availedPlan.membershipPlanId", { required: true })}
        placeholder="Membership Plan ID"
      />
      {errors.availedPlan?.membershipPlanId && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue="testPlanName"
        {...register("availedPlan.name", { required: true })}
        placeholder="Plan Name"
      />
      {errors.availedPlan?.name && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue={Number(Math.floor(Math.random() * 1000))}
        type="number"
        {...register("availedPlan.amount", { required: true })}
        placeholder="Amount"
        min="0"
        step="any"
      />
      {errors.availedPlan?.amount && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue={31}
        type="number"
        {...register("availedPlan.duration", { required: true })}
        placeholder="Duration (days)"
      />
      {errors.availedPlan?.duration && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        defaultValue={"pending"}
        type="text"
        {...register("status", { required: true })}
        placeholder="Duration (days)"
      />
      {errors.availedPlan?.duration && (
        <span className="text-red-500">This field is required</span>
      )}
      <input
        type="checkbox"
        {...register("isNewCustomer", { required: true })}
        defaultChecked={true}
        placeholder="Is New Customer"
      />
      {errors.availedPlan?.duration && (
        <span className="text-red-500">This field is required</span>
      )}
      <label>Start Date</label>
      <input
        type="date"
        {...register("availedPlan.startDate", { required: true })}
        value={
          startDateValue ? formatDate(new Date(startDateValue)).toString() : ""
        }
        onChange={(e) =>
          setValue("availedPlan.startDate", new Date(e.target.value))
        }
      />
      {errors.availedPlan?.startDate && (
        <span className="text-red-500">This field is required</span>
      )}
      <label>Expiry Date</label>
      <input
        type="date"
        {...register("availedPlan.expiryDate", { required: true })}
        value={
          expiryDateValue
            ? formatDate(new Date(expiryDateValue)).toString()
            : ""
        }
        onChange={(e) =>
          setValue("availedPlan.expiryDate", new Date(e.target.value))
        }
      />
      {errors.availedPlan?.expiryDate && (
        <span className="text-red-500">This field is required</span>
      )}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
        Submit
      </button>
    </form>
  );
}
