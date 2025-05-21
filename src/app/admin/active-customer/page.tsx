"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  Clock,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  UserCheck,
  Calendar,
} from "lucide-react";

interface ActiveCustomer {
  id: string;
  customerId: string | null;
  firstName: string;
  lastName: string;
  price: number;
  requestNumber: string;
  timeApproved: string;
  subscription: string;
  remainingTime: string;
}

function CustomerTableSkeleton() {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-72" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
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
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [sortField, setSortField] =
    useState<keyof ActiveCustomer>("timeApproved");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  const {
    data: customers,
    error,
    isLoading,
    mutate,
  } = useSWR<ActiveCustomer[]>("/api/admin/active-customers", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleSort = useCallback(
    (field: keyof ActiveCustomer) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const filteredAndSortedCustomers = customers
    ? customers
        .filter((customer) => {
          const matchesSearch =
            searchQuery === "" ||
            `${customer.firstName} ${customer.lastName}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (customer.customerId &&
              customer.customerId
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            customer.requestNumber
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesSubscription =
            subscriptionFilter === "all" ||
            customer.subscription === subscriptionFilter;

          return matchesSearch && matchesSubscription;
        })
        .sort((a, b) => {
          if (sortField === "price") {
            return sortDirection === "asc"
              ? a.price - b.price
              : b.price - a.price;
          } else if (sortField === "timeApproved") {
            return sortDirection === "asc"
              ? new Date(a.timeApproved).getTime() -
                  new Date(b.timeApproved).getTime()
              : new Date(b.timeApproved).getTime() -
                  new Date(a.timeApproved).getTime();
          } else {
            const aValue = a[sortField]?.toString().toLowerCase() || "";
            const bValue = b[sortField]?.toString().toLowerCase() || "";
            return sortDirection === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
        })
    : [];

  const subscriptionTypes = customers
    ? [
        "all",
        ...Array.from(
          new Set(customers.map((customer) => customer.subscription))
        ),
      ]
    : ["all"];

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / itemsPerPage
  );
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) return <CustomerTableSkeleton />;

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          <span>
            Error: {error.message || "Failed to load active customers"}
          </span>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    );

  if (!customers || customers.length === 0)
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Customers</h2>
          <div className="flex gap-2">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleRefresh} size="icon">
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
        <div className="border rounded-lg p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-gray-100 p-4 rounded-full">
              <UserCheck size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No active customers found</h3>
            <p className="text-gray-500 max-w-md">
              There are currently no active customers in the system. Customers
              will appear here when they have an active subscription.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Active Customers</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={subscriptionFilter}
            onValueChange={setSubscriptionFilter}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              {subscriptionTypes
                .filter((type) => type !== "all")
                .map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            size="icon"
            className="flex-shrink-0"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead
                  className="font-semibold text-black cursor-pointer"
                  onClick={() => handleSort("firstName")}
                >
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    Customer
                    {sortField === "firstName" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Status
                </TableHead>
                <TableHead
                  className="font-semibold text-black cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortField === "price" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-black cursor-pointer"
                  onClick={() => handleSort("requestNumber")}
                >
                  <div className="flex items-center gap-1">
                    Request #
                    {sortField === "requestNumber" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-black cursor-pointer"
                  onClick={() => handleSort("timeApproved")}
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Time Approved
                    {sortField === "timeApproved" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-black cursor-pointer"
                  onClick={() => handleSort("subscription")}
                >
                  <div className="flex items-center gap-1">
                    <Tag size={14} />
                    Subscription
                    {sortField === "subscription" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-black cursor-pointer"
                  onClick={() => handleSort("remainingTime")}
                >
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    Remaining Time
                    {sortField === "remainingTime" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-black text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {getInitials(customer.firstName, customer.lastName)}
                      </div>
                      <div>
                        <div>
                          {customer.firstName} {customer.lastName}
                        </div>
                        {!customer.customerId && (
                          <div className="text-xs text-gray-500">Walk-in</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₱{customer.price.toLocaleString()}
                  </TableCell>
                  <TableCell>{customer.requestNumber}</TableCell>
                  <TableCell>{customer.timeApproved}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {customer.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {customer.remainingTime}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination controls */}
      {filteredAndSortedCustomers.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {Math.min(
              filteredAndSortedCustomers.length,
              (currentPage - 1) * itemsPerPage + 1
            )}{" "}
            to{" "}
            {Math.min(
              filteredAndSortedCustomers.length,
              currentPage * itemsPerPage
            )}{" "}
            of {filteredAndSortedCustomers.length} customers
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
