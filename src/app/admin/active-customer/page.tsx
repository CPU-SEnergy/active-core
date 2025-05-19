"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserSearch from "@/components/UserSearch";

function CustomerTableSkeleton() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-72" />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-32" /></TableHead>
              <TableHead><Skeleton className="h-4 w-32" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-32" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface ActiveCustomer {
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

export default function CustomerTable() {
  const [customers, setCustomers] = useState<ActiveCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveCustomers = async () => {
      try {
        const response = await fetch("/api/admin/active-customers");
        if (!response.ok) {
          throw new Error("Failed to fetch active customers");
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

    fetchActiveCustomers();
  }, []);

  if (loading) {
    return <CustomerTableSkeleton />
  }

  if (error) {
    return (
    <div className="p-6 text-center">
      <div className="text-red-500 font-medium">Error: {error}</div>
    </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Customers</h2>
        <UserSearch />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-bold">Customer</TableHead>
              <TableHead className="text-black font-bold">Status</TableHead>
              <TableHead className="text-black font-bold">
                Request Number
              </TableHead>
              <TableHead className="text-black font-bold">
                Time Approved
              </TableHead>
              <TableHead className="text-black font-bold">
                Subscription
              </TableHead>
              <TableHead className="text-black font-bold">
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
                <TableCell>Active</TableCell>
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
