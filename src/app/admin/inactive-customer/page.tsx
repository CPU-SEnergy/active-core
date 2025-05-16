"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserSearch from "@/components/UserSearch";

interface InactiveCustomer {
  id: string;
  customer: {
    name: string;
    imageUrl: string;
  };
  requestNumber: string;
  timeApproved: string;
  subscription: string;
  remainingTime: string;
}

export default function InactiveCustomerTable() {
  const [customers, setCustomers] = useState<InactiveCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInactiveCustomers = async () => {
      try {
        const response = await fetch("/api/admin/inactive-customers");
        if (!response.ok) {
          throw new Error("Failed to fetch inactive customers");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInactiveCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inactive Customers</h2>
        <UserSearch />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black">Customer</TableHead>
              <TableHead className="font-bold text-black">Status</TableHead>
              <TableHead className="font-bold text-black">
                Request Number
              </TableHead>
              <TableHead className="font-bold text-black">
                Time Approved
              </TableHead>
              <TableHead className="font-bold text-black">
                Subscription
              </TableHead>
              <TableHead className="font-bold text-black">
                Remaining Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="flex items-center gap-2">
                  <img
                    src={customer.customer.imageUrl}
                    alt={customer.customer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {customer.customer.name}
                </TableCell>
                <TableCell>Inactive</TableCell>
                <TableCell>{customer.requestNumber}</TableCell>
                <TableCell>{customer.timeApproved}</TableCell>
                <TableCell>{customer.subscription}</TableCell>
                <TableCell>{customer.remainingTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
