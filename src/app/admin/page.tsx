"use client";

import { useState, useCallback } from "react";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Tag,
  User,
  UserCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecentActivity {
  id: string;
  customerId: string | null;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  price: number;
  requestNumber: string;
  timeApproved: string;
  subscription: string;
  remainingTime: string;
  duration: string;
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full flex-col lg:flex-row">
      <aside className="w-full lg:w-80 bg-white p-6 border-r border-gray-200 shadow-sm">
        <nav className="space-y-6">
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-sm">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-6">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 flex flex-col lg:flex-row items-center justify-between border-b border-gray-100">
              <Skeleton className="h-6 w-32 mb-4 lg:mb-0" />
              <Skeleton className="h-10 w-[100px]" />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Customer",
                    "Type",
                    "Payment Method",
                    "Plan",
                    "Date",
                    "Amount",
                  ].map((header, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(8)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
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
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPI {
  title: string;
  value: string | number;
  change: number;
  prefix?: string;
}

function KPICard({ title, value, change, prefix }: KPI) {
  const isPositive = change >= 0;

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-2xl font-bold text-gray-900">
            {prefix}
            <span className={prefix ? "ml-1" : ""}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
          </div>
          <div
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              isPositive
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<
    "yearly" | "monthly" | "daily"
  >("yearly");

  const {
    dailyData,
    yearlyData,
    monthlyData,
    customerData,
    isLoading,
    error,
    mutateAll,
  } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error Loading Dashboard
          </div>
          <div className="text-gray-600 mb-4">
            Failed to load dashboard data. Please check your connection and try
            again.
          </div>
          <button
            onClick={mutateAll}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getRevenueData = () => {
    switch (revenuePeriod) {
      case "yearly":
        return {
          value: yearlyData?.totalRevenue || 0,
          change: parseFloat(yearlyData?.revenueComparison || "0"),
          title: "Total Revenue (Yearly)",
        };
      case "monthly":
        return {
          value: monthlyData?.monthlyRevenue || 0,
          change: monthlyData?.monthlyRevenueComparison || 0,
          title: "Total Revenue (Monthly)",
        };
      case "daily":
        return {
          value: dailyData?.summary.dailyRevenue || 0,
          change: dailyData?.summary.revenueChange || 0,
          title: "Total Revenue (Daily)",
        };
      default:
        return {
          value: yearlyData?.totalRevenue || 0,
          change: parseFloat(yearlyData?.revenueComparison || "0"),
          title: "Total Revenue (Yearly)",
        };
    }
  };

  const revenueData = getRevenueData();

  const kpis: KPI[] = [
    {
      title: revenueData.title,
      value: revenueData.value,
      change: revenueData.change,
      prefix: "₱",
    },
    {
      title: "Total Customers",
      value: customerData?.totalCustomers || 0,
      change: parseFloat(yearlyData?.customerComparison || "0"),
    },
    {
      title: "Active Customers Ratio",
      value: `${monthlyData?.monthlyActive?.toFixed(1) || "0.0"}%`,
      change: monthlyData?.monthlyActiveCustomersComparison || 0,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 w-full flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white p-6 border-r border-gray-200 shadow-sm">
        <nav className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">KPIs</h2>
              <div className="flex items-center gap-2">
                <Select
                  value={revenuePeriod}
                  onValueChange={(value: "yearly" | "monthly" | "daily") =>
                    setRevenuePeriod(value)
                  }
                >
                  <SelectTrigger className="w-[120px] border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={mutateAll}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Data Availability Notice */}
            {(monthlyData?.message ||
          yearlyData?.message ||
          customerData?.message) && (
          <Alert className="mb-4 p-3">
            <AlertDescription>
              {monthlyData?.message ||
                yearlyData?.message ||
                customerData?.message}
            </AlertDescription>
          </Alert>
        )}
            <div className="space-y-4">
              {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <CustomerTable />
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [sortField, setSortField] =
    useState<keyof RecentActivity>("timeApproved");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  const {
    data: customers,
    error,
    isLoading,
    mutate,
  } = useSWR<RecentActivity[]>("/api/admin/overview/recent-activity", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleSort = useCallback(
    (field: keyof RecentActivity) => {
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

  if (isLoading) return <DashboardSkeleton />;

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
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <p className="text-sm text-gray-500">
          Transactions for the last 30 days
        </p>
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
                  onClick={() => handleSort("paymentMethod")}
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Payment Method
                    {sortField === "paymentMethod" && (
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

                  <TableCell className="font-medium">
                    ₱{customer.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.paymentMethod.charAt(0).toUpperCase() +
                      customer.paymentMethod.slice(1)}
                  </TableCell>
                  <TableCell>{customer.timeApproved}</TableCell>
                  <TableCell>
                    
                      <div>
                        <div>{customer.subscription}</div>
                        <div className="text-xs text-gray-500">
                          {customer.duration} days
                        </div>
                      </div>
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
