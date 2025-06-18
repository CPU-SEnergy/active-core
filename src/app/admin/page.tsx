"use client"

import { useEffect, useState, useMemo } from "react"
import { Search, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { timeFilters } from "@/lib/timeFilters"

function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50 w-full flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-white p-6 border-r">
        <nav className="space-y-6">
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
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
        <div className="max-w-4xl">
          <div className="relative mb-6">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="bg-white rounded-lg border">
            <div className="p-4 flex flex-col lg:flex-row items-center justify-between border-b">
              <Skeleton className="h-6 w-32 mb-4 lg:mb-0" />
              <Skeleton className="h-10 w-[100px]" />
            </div>

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
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
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
  )
}

interface KPI {
  title: string
  value: string | number
  change: number
  prefix?: string
}

interface KPIData {
  yearly: {
    totalRevenue: number
    totalMonthlyCustomers: number
    activeCustomers: string
    revenueComparison: string
    customerComparison: string
    activeCustomersComparison: string
  }
  monthly: {
    totalRevenue: number
    totalMonthlyCustomers: number
    activeCustomers: string
    monthlyRevenueComparison: string
  }
}

interface Customer {
  customerId: string | null
  firstName: string
  lastName: string
  type: string
}

interface AvailedPlan {
  membershipPlanId: string
  name: string
  amount: number
  duration: number
  startDate: string
  expiryDate: string
}

interface Payment {
  id: string
  paymentMethod: string
  isNewCustomer: boolean
  createdAt: string
  isWalkIn: boolean
  customer: Customer
  availedPlan: AvailedPlan
}

interface ActivityItem {
  id: string
  customerName: string
  customerType: string
  paymentMethod: string
  planName: string
  planDuration: number
  amount: number
  createdAt: string
  isWalkIn: boolean
  isNewCustomer: boolean
}

function KPICard({ title, value, change, prefix }: KPI) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-2xl font-semibold">
            {prefix && prefix} {value}
          </div>
          <div
            className={`text-xs px-2 py-1 rounded-full ${
              isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityTable({ activities }: { activities: ActivityItem[] }) {
  const [sortField, setSortField] = useState<keyof ActivityItem>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof ActivityItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "createdAt" || field === "amount" ? "desc" : "asc")
    }
  }

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else {
        const valueA = String(a[sortField]).toLowerCase()
        const valueB = String(b[sortField]).toLowerCase()
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }
    })
  }, [activities, sortField, sortDirection])

  const renderSortIndicator = (field: keyof ActivityItem) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1" />
    )
  }

  const formatPaymentMethod = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("customerName")}>
            Customer {renderSortIndicator("customerName")}
          </TableHead>
          <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("customerType")}>
            Type {renderSortIndicator("customerType")}
          </TableHead>
          <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("paymentMethod")}>
            Payment Method {renderSortIndicator("paymentMethod")}
          </TableHead>
          <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("planName")}>
            Plan {renderSortIndicator("planName")}
          </TableHead>
          <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("createdAt")}>
            Date {renderSortIndicator("createdAt")}
          </TableHead>
          <TableHead className="whitespace-nowrap cursor-pointer text-right" onClick={() => handleSort("amount")}>
            Amount {renderSortIndicator("amount")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedActivities.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="whitespace-nowrap text-center py-8 text-gray-500">
              No activity found matching your criteria
            </TableCell>
          </TableRow>
        ) : (
          sortedActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="whitespace-nowrap flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                  {getInitials(activity.customerName)}
                </div>
                <div>
                  <div>{activity.customerName}</div>
                  <div className="flex gap-1 mt-0.5">
                    {activity.isWalkIn && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        Walk-in
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="secondary" className="capitalize">
                  {activity.customerType}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatPaymentMethod(activity.paymentMethod)}</TableCell>
              <TableCell>
                <div>
                  <div>{activity.planName}</div>
                  <div className="text-xs text-gray-500">{activity.planDuration} days</div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{new Date(activity.createdAt).toLocaleString()}</TableCell>
              <TableCell className="whitespace-nowrap text-center font-medium">
                ₱ {activity.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState<string>("24h")
  const [searchQuery, setSearchQuery] = useState("")
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revenuePeriod, setRevenuePeriod] = useState<"yearly" | "monthly" | "daily">("yearly")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear()
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0")

        const [yearResponse, monthResponse, paymentsResponse] = await Promise.all([
          fetch(`/api/admin/overview/kpi/${currentYear}`),
          fetch(`/api/admin/overview/kpi/${currentYear}/${currentMonth}`),
          fetch("/api/admin/overview/recent-activity"),
        ])

        if (!yearResponse.ok) throw new Error("Failed to fetch yearly data")
        if (!monthResponse.ok) throw new Error("Failed to fetch monthly data")
        if (!paymentsResponse.ok) throw new Error("Failed to fetch payments data")

        const yearData = await yearResponse.json()
        const monthData = await monthResponse.json()
        const paymentsData = await paymentsResponse.json()

        if (!monthData || typeof monthData.monthlyRevenue === "undefined") {
          throw new Error("Invalid monthly data structure")
        }

        setKpiData({
          yearly: {
            totalRevenue: yearData.totalRevenue || 0,
            totalMonthlyCustomers: yearData.totalMonthlyCustomers || 0,
            activeCustomers: yearData.activeCustomers || "0",
            revenueComparison: yearData.revenueComparison,
            customerComparison: yearData.customerComparison,
            activeCustomersComparison: yearData.activeCustomersComparison,
          },
          monthly: {
            totalRevenue: monthData.monthlyRevenue || 0,
            totalMonthlyCustomers: monthData.monthlyCustomers || 0,
            activeCustomers: monthData.monthlyActive?.toString() || "0",
            monthlyRevenueComparison: monthData.monthlyRevenueComparison,
          },
        })

        setPayments(paymentsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Transform payments to a consistent format for display
  const activityItems: ActivityItem[] = useMemo(() => {
    return payments.map((payment) => {
      const customerName = `${payment.customer.firstName} ${payment.customer.lastName}`

      return {
        id: payment.id,
        customerName,
        customerType: payment.customer.type,
        paymentMethod: payment.paymentMethod,
        planName: payment.availedPlan.name,
        planDuration: payment.availedPlan.duration,
        amount: payment.availedPlan.amount,
        createdAt: payment.createdAt,
        isWalkIn: payment.isWalkIn,
        isNewCustomer: payment.isNewCustomer,
      }
    })
  }, [payments])

  // Filter activities based on search query and time filter
  const filteredActivities = useMemo(() => {
    return activityItems.filter((activity) => {
      const matchesSearch =
        activity.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.planName.toLowerCase().includes(searchQuery.toLowerCase())

      const activityDate = new Date(activity.createdAt)
      const now = new Date()
      const hoursDiff = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60)

      switch (timeFilter) {
        case "24h":
          return matchesSearch && hoursDiff <= 24
        case "7d":
          return matchesSearch && hoursDiff <= 168
        case "30d":
          return matchesSearch && hoursDiff <= 720
        default:
          return matchesSearch
      }
    })
  }, [activityItems, searchQuery, timeFilter])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  const getRevenueData = () => {
    if (!kpiData) return { value: 0, change: 0, title: "Total Revenue" }

    switch (revenuePeriod) {
      case "yearly":
        return {
          value: kpiData.yearly.totalRevenue,
          change: Number.parseFloat(kpiData.yearly.revenueComparison),
          title: "Total Revenue (Yearly)",
        }
      case "monthly":
        return {
          value: kpiData.monthly.totalRevenue,
          change: Number.parseFloat(kpiData.monthly.monthlyRevenueComparison),
          title: "Total Revenue (Monthly)",
        }
      case "daily":
        return {
          value: Math.round(kpiData.monthly.totalRevenue / 30),
          change: Number.parseFloat(kpiData.monthly.monthlyRevenueComparison),
          title: "Total Revenue (Daily)",
        }
      default:
        return {
          value: kpiData.yearly.totalRevenue,
          change: Number.parseFloat(kpiData.yearly.revenueComparison),
          title: "Total Revenue (Yearly)",
        }
    }
  }

  const revenueData = getRevenueData()

  const kpis: KPI[] = kpiData
    ? [
        {
          title: revenueData.title,
          value: revenueData.value,
          change: revenueData.change,
          prefix: "₱",
        },
        {
          title: "Monthly Customers",
          value: kpiData.yearly.totalMonthlyCustomers,
          change: Number.parseFloat(kpiData.yearly.customerComparison),
        },
        {
          title: "Active Customers",
          value: kpiData.yearly.activeCustomers + "%",
          change: Number.parseFloat(kpiData.yearly.activeCustomersComparison),
        },
      ]
    : []

  return (
    <div className="flex h-screen bg-gray-50 w-full flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-white p-6 border-r">
        <nav className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              KPIs
              <Select
                value={revenuePeriod}
                onValueChange={(value: "yearly" | "monthly" | "daily") => setRevenuePeriod(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </h2>
            <div className="space-y-4 lg:flex lg:flex-wrap flex-col">
              {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by customer or plan"
              className="pl-10 bg-gray-100 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-lg border p-2">
            <div className="p-4 flex flex-col lg:flex-row items-center justify-between border-b">
              <h2 className="text-lg font-semibold mb-4 lg:mb-0">Recent Activity</h2>
              <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ActivityTable activities={filteredActivities} />
          </div>
        </div>
      </div>
    </div>
  )
}
