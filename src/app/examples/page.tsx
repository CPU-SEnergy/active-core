"use client";

import { Schema } from "@/lib/schema/firestore";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { intlFormatDistance } from "date-fns";

export default function Test() {
  const {
    data,
    error,
    isLoading,
  }: { data: Schema["users"]["Data"][]; error: unknown; isLoading: boolean } =
    useSWR("/api/test", fetcher);
  console.log(data);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      {data &&
        data.map((user) => (
          <li key={user.uid} className="mb-4 border-b pb-2">
            <p>
              <strong>Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {user.dob ? new Date(user.dob).toLocaleDateString() : ""}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {user.createdAt
                ? intlFormatDistance(new Date(user.createdAt), new Date())
                : "..."}
            </p>
            <p>
              <strong>Gender:</strong> {user.sex}
            </p>
          </li>
        ))}
    </div>
  );
}
