"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import SalesMetrics from "@/components/salesComponents/salesMetrics";
import DonutCharts from "@/components/salesComponents/donutChart";
import EarningsChart from "@/components/salesComponents/earningsChart";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function SalesDashboard() {
  const {
    dailyData,
    yearlyData,
    monthlyData,
    customerData,
    isLoading,
    error,
    mutateAll,
  } = useDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Prepare data for charts - Now using real customer data
  const salesMetricsData =
    yearlyData && customerData
      ? {
          earnings: [
            yearlyData.yearData["01"]?.revenue || 0,
            yearlyData.yearData["02"]?.revenue || 0,
            yearlyData.yearData["03"]?.revenue || 0,
            yearlyData.yearData["04"]?.revenue || 0,
            yearlyData.yearData["05"]?.revenue || 0,
            yearlyData.yearData["06"]?.revenue || 0,
            yearlyData.yearData["07"]?.revenue || 0,
            yearlyData.yearData["08"]?.revenue || 0,
            yearlyData.yearData["09"]?.revenue || 0,
            yearlyData.yearData["10"]?.revenue || 0,
            yearlyData.yearData["11"]?.revenue || 0,
            yearlyData.yearData["12"]?.revenue || 0,
          ],
          memberships: {
            // Now using real data from the customers stats
            package: Math.floor(customerData.regularCustomers * 0.6), // Assume 60% of regular customers have packages
            individual: Math.floor(customerData.regularCustomers * 0.4), // Assume 40% are individual
            walkIn: customerData.totalWalkInCustomers,
          },
          monthlyEarnings: monthlyData?.isDataAvailable
            ? monthlyData.monthlyRevenue
            : 0,
        }
      : null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please check your connection and
              try again.
              <Button
                onClick={mutateAll}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sales Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={mutateAll}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Data Availability Notice */}
        {(monthlyData?.message ||
          yearlyData?.message ||
          customerData?.message) && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {monthlyData?.message ||
                yearlyData?.message ||
                customerData?.message}{" "}
              - Showing default values.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Daily Revenue */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Today&apos;s Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dailyData?.summary.dailyRevenue || 0)}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${getChangeColor(dailyData?.summary.revenueChange || 0)}`}
                  >
                    {getChangeIcon(dailyData?.summary.revenueChange || 0)}
                    {formatPercentage(dailyData?.summary.revenueChange || 0)}
                    <span className="text-gray-500">vs yesterday</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(monthlyData?.monthlyRevenue || 0)}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${getChangeColor(monthlyData?.monthlyRevenueComparison || 0)}`}
                  >
                    {getChangeIcon(monthlyData?.monthlyRevenueComparison || 0)}
                    {formatPercentage(
                      monthlyData?.monthlyRevenueComparison || 0
                    )}
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {customerData?.totalCustomers || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                   <span className="font-bold"> +{customerData?.totalWalkInCustomers || 0}</span> customers with no account
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Customers */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Rate
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Monthly
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {monthlyData?.monthlyActive.toFixed(1) || "0.0"}%
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${getChangeColor(monthlyData?.monthlyActiveCustomersComparison || 0)}`}
                  >
                    {getChangeIcon(
                      monthlyData?.monthlyActiveCustomersComparison || 0
                    )}
                    {formatPercentage(
                      monthlyData?.monthlyActiveCustomersComparison || 0
                    )}
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Metrics */}
          <div className="lg:col-span-1">
            <SalesMetrics data={salesMetricsData} isLoading={isLoading} />
          </div>

          {/* Membership Distribution */}
          <div className="lg:col-span-1">
            <DonutCharts data={salesMetricsData} isLoading={isLoading} />
          </div>

          {/* Earnings Chart */}
          <div className="lg:col-span-1">
            <EarningsChart
              earnings={salesMetricsData?.earnings || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
