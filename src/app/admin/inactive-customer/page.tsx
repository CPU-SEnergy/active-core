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

export default function InactiveCustomerTable() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inactive Customers</h2>
        <Search></Search>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers
              .filter((customer) => !customer.isActive)
              .map((customer) => (
                <TableRow key={customer.uid}>
                  <TableCell>
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.requestNumber}</TableCell>
                  <TableCell>{customer.timeApproved}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
