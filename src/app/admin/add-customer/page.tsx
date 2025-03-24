"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Customer = {
  id: string;
  name: string;
  status: "New Customer" | "Signed up" | "Content";
  requestNumber: string;
  time: string;
  subscription: "Basic" | "With Trainer";
};
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Brian Scott",
    status: "New Customer",
    requestNumber: "#0000029",
    time: "1 min ago",
    subscription: "Basic",
  },
  {
    id: "2",
    name: "Ryan Smith",
    status: "Signed up",
    requestNumber: "#0000028",
    time: "3 hrs ago",
    subscription: "With Trainer",
  },
  {
    id: "3",
    name: "Anthony White",
    status: "Signed up",
    requestNumber: "#0000027",
    time: "10 hrs ago",
    subscription: "With Trainer",
  },
  {
    id: "4",
    name: "Ashley Adams",
    status: "Content",
    requestNumber: "#0000026",
    time: "12 hrs ago",
    subscription: "Basic",
  },
  {
    id: "5",
    name: "John Robinson",
    status: "Content",
    requestNumber: "#0000025",
    time: "15 hrs ago",
    subscription: "With Trainer",
  },
];

export default function CustomerManagement() {
  const customers = initialCustomers;
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
          >
            Walk-in Customer
          </Button>
          <Button className="bg-zinc-900 hover:bg-zinc-800">
            Add Customer
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recently added</h2>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold text-black">
                  Customer
                </TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
                <TableHead className="font-bold text-black">
                  Request Number
                </TableHead>
                <TableHead className="font-bold text-black">Time</TableHead>
                <TableHead className="font-bold text-black">
                  Subscription
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        {customer.name.charAt(0)}
                      </div>
                      <span>{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.requestNumber}</TableCell>
                  <TableCell>{customer.time}</TableCell>
                  <TableCell>{customer.subscription}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
