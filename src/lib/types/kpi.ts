export interface KpiMonth {
  totalRevenue: number;
  totalCustomers: number;
}

export interface KpiYear {
  months: Record<string, KpiMonth>;
}

export interface KpisCollection {
  getYearData: (year: string) => Promise<KpiYear | null>;
  getMonthData: (year: string, monthId: string) => Promise<KpiMonth | null>;
}
