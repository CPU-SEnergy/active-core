export const kpis: KPI[] = [
  {
    title: "Current MRR",
    value: "42.7k",
    change: 17,
    prefix: "P",
  },
  {
    title: "Current Customers",
    value: 30,
    change: -1,
  },
  {
    title: "Active Customer",
    value: "73.70%",
    change: 16,
  },
];

export const recentCustomers: Customer[] = [
  {
    id: "1",
    name: "William King",
    status: "New Customer",
    membershipType: "Monthly",
    availedPlan: "With Coach",
    time: "1 min ago",
    amount: 2200,
  },
  {
    id: "2",
    name: "John Davis",
    status: "Signed up",
    membershipType: "walk-in",
    availedPlan: "Basic",
    time: "3 hr ago",
    amount: 100,
  },
  {
    id: "3",
    name: "Elizabeth Hall",
    status: "Signed up",
    membershipType: "Monthly",
    availedPlan: "With Coach",
    time: "10 hr ago",
    amount: 40000,
  },
];

export const timeFilters: TimeFilter[] = [
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7d" },
  { value: "30d", label: "Last 30d" },
];
