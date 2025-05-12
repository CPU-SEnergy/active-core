"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { timeFilters } from "@/lib/mock_data/overviewMockData"

interface KPI {
  title: string;
  value: string | number;
  change: number;
  prefix?: string;
}

interface KPIData {
  yearly: {
    totalRevenue: number;
    totalMonthlyCustomers: number;
    activeCustomers: string;
    revenueComparison: string;
    customerComparison: string;
    activeCustomersComparison: string;
  };
  monthly: {
    totalRevenue: number;
    totalMonthlyCustomers: number;
    activeCustomers: string;
    monthlyRevenueComparison: string;
  };
}

interface Payment {
  id: string;
  customerId: string;
  amount: number;
  status: string;
  membershipType: string;
  planType: string;
  createdAt: string;
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


function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Membership Type</TableHead>
          <TableHead>Availed Plan</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              {customer.name}
            </TableCell>
            <TableCell>{customer.status}</TableCell>
            <TableCell>{customer.membershipType}</TableCell>
            <TableCell>{customer.availedPlan}</TableCell>
            <TableCell>{customer.time}</TableCell>
            <TableCell>P {customer.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter["value"]>("24h")
  const [searchQuery, setSearchQuery] = useState("")
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch KPI data
        const currentYear = new Date().getFullYear()
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')
        
        const [yearResponse, monthResponse, paymentsResponse] = await Promise.all([
          fetch(`/api/admin/overview/kpi/${currentYear}`),
          fetch(`/api/admin/overview/kpi/${currentYear}/${currentMonth}`),
          fetch('/api/admin/overview/recent-activity')
        ]);

        if (!yearResponse.ok) throw new Error('Failed to fetch yearly data')
        if (!monthResponse.ok) throw new Error('Failed to fetch monthly data')
        if (!paymentsResponse.ok) throw new Error('Failed to fetch payments data')

        const yearData = await yearResponse.json()
        const monthData = await monthResponse.json()
        const paymentsData = await paymentsResponse.json()

        if (!monthData || typeof monthData.monthlyRevenue === 'undefined') {
          throw new Error('Invalid monthly data structure')
        }

        setKpiData({
          yearly: {
            totalRevenue: yearData.totalRevenue || 0,
            totalMonthlyCustomers: yearData.totalMonthlyCustomers || 0,
            activeCustomers: yearData.activeCustomers || '0',
            revenueComparison: yearData.revenueComparison,
            customerComparison: yearData.customerComparison,
            activeCustomersComparison: yearData.activeCustomersComparison,
          },
          monthly: {
            totalRevenue: monthData.monthlyRevenue || 0,
            totalMonthlyCustomers: monthData.monthlyCustomers || 0,
            activeCustomers: monthData.monthlyActive?.toString() || '0',
            monthlyRevenueComparison: monthData.monthlyRevenueComparison,
          }
        })

        setPayments(paymentsData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    
    // Filter by time
    const paymentDate = new Date(payment.createdAt)
    const now = new Date()
    const hoursDiff = (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60)
    
    switch (timeFilter) {
      case "24h":
        return matchesSearch && hoursDiff <= 24
      case "7d":
        return matchesSearch && hoursDiff <= 168 // 7 * 24
      case "30d":
        return matchesSearch && hoursDiff <= 720 // 30 * 24
      default:
        return matchesSearch
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const kpis: KPI[] = kpiData ? [
    {
      title: "Total Revenue (Year)",
      value: kpiData.yearly.totalRevenue,
      change: parseFloat(kpiData.yearly.revenueComparison),
      prefix: "₱"
    },
    {
      title: "Monthly Customers",
      value: kpiData.yearly.totalMonthlyCustomers,
      change: parseFloat(kpiData.yearly.customerComparison)
    },
    {
      title: "Active Customers",
      value: kpiData.yearly.activeCustomers,
      change: parseFloat(kpiData.yearly.activeCustomersComparison)
    }
  ] : [];

  return (
    <div className="flex h-screen bg-gray-50 w-full flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-white p-6 border-r">
        <nav className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              KPIs
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
              placeholder="Search"
              className="pl-10 bg-gray-100 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-lg border">
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
            <CustomerTable customers={filteredPayments.map(payment => ({
              id: payment.id,
              name: payment.customerId,
              status: payment.status,
              membershipType: payment.membershipType,
              availedPlan: payment.planType,
              time: new Date(payment.createdAt).toLocaleString(),
              amount: payment.amount
            }))} />
          </div>
        </div>
      </div>
    </div>
  )
}

