"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cashiers } from "@/lib/mock_data/cashierMockData";

export default function CashierManagement() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Cashier</h1>
        <Button className="bg-black hover:bg-gray-800 text-white">
          add cashier
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5} className="bg-white py-4">
                <h2 className="text-xl font-bold px-2 text-black">Current Cashiers</h2>
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[300px]">Customer</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashiers.map((cashier) => (
              <TableRow key={cashier.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={cashier.avatar} alt={cashier.name} />
                      <AvatarFallback>{cashier.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{cashier.name}</span>
                  </div>
                </TableCell>
                <TableCell>{cashier.time}</TableCell>
                <TableCell>{cashier.status}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

