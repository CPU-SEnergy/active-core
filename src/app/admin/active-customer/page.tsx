import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customers } from "@/lib/mock_data/customers";
import Search from "../clydetest/search";

export default function CustomerTable() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Customers</h2>
        <Search />
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
            {customers
              .filter((customer) => customer.isActive)
              .map((customer) => (
                <TableRow key={customer.uid}>
                  <TableCell>
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.status}</TableCell>
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
