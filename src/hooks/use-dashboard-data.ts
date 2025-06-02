/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";

interface DailyData {
  date: string;
  summary: {
    dailyRevenue: number;
    dailyCustomers: number;
    revenueChange: number;
    customerChange: number;
  };
  comparison: {
    previousDayRevenue: number;
    previousDayCustomers: number;
  };
  transactions: Array<{
    id: string;
    amount: number;
    customerType: string;
    planType: string;
    timestamp: Date;
    userId: string;
  }>;
}

interface YearlyData {
  yearData: Record<string, any>;
  totalRevenue: number;
  totalMonthlyCustomers: number;
  activeCustomers: string;
  revenueComparison: string;
  customerComparison: string;
  activeCustomersComparison: string;
  isDataAvailable?: boolean;
  message?: string;
}

interface MonthlyData {
  monthlyRevenue: number;
  monthlyCustomers: number;
  monthlyActive: number;
  monthlyRevenueComparison: number | null;
  monthlyCustomersComparison: number | null;
  monthlyActiveCustomersComparison: number | null;
  isDataAvailable?: boolean;
  message?: string;
}

interface CustomerData {
  totalCustomers: number;
  totalWalkInCustomers: number;
  regularCustomers: number;
  isDataAvailable?: boolean;
  message?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    // Don't throw error for 404s, let the component handle missing data
    if (res.status === 404) {
      const errorData = await res.json();
      return errorData;
    }
    throw new Error(`Failed to fetch data: ${res.status}`);
  }
  return res.json();
};

export function useDashboardData() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const {
    data: dailyData,
    error: dailyError,
    isLoading: dailyLoading,
    mutate: mutateDailyData,
  } = useSWR<DailyData>("/api/admin/overview/kpi", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  const {
    data: yearlyData,
    error: yearlyError,
    isLoading: yearlyLoading,
    mutate: mutateYearlyData,
  } = useSWR<YearlyData>(`/api/admin/overview/kpi/${currentYear}`, fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  const {
    data: monthlyData,
    error: monthlyError,
    isLoading: monthlyLoading,
    mutate: mutateMonthlyData,
  } = useSWR<MonthlyData>(
    `/api/admin/overview/kpi/${currentYear}/${currentMonth}`,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const {
    data: customerData,
    error: customerError,
    isLoading: customerLoading,
    mutate: mutateCustomerData,
  } = useSWR<CustomerData>("/api/admin/overview/customers", fetcher, {
    refreshInterval: 120000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  const isLoading =
    dailyLoading || yearlyLoading || monthlyLoading || customerLoading;

  // Only treat as error if it's not a missing data scenario
  const error =
    (dailyError && !dailyData) ||
    (yearlyError && !yearlyData) ||
    (monthlyError && !monthlyData) ||
    (customerError && !customerData);

  const mutateAll = () => {
    mutateDailyData();
    mutateYearlyData();
    mutateMonthlyData();
    mutateCustomerData();
  };

  return {
    dailyData,
    yearlyData,
    monthlyData,
    customerData,
    isLoading,
    error,
    mutateAll,
  };
}
