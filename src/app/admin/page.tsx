"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { kpis, recentCustomers, timeFilters } from "@/lib/mock_data/overviewMockData"

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

  const filteredCustomers = recentCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <CustomerTable customers={filteredCustomers} />
          </div>
        </div>
      </div>
    </div>
  )
}

