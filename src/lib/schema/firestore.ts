import { schema, Typesaurus } from "typesaurus";

export const db = schema(
  ($) => ({
    users: $.collection<User>(),
    membershipPlan: $.collection<MembershipPlan>(),
    payments: $.collection<Payment>(),
    membershipHistory: $.collection<MembershipHistory>(),
    kpis: $.collection<KPIs>(),
    customers: $.collection<Customers>(),
    apparels: $.collection<Apparels>(),
  }),
  { server: { preferRest: true } }
);

// Infer schema type helper with shortcuts to types in your database:
//   function getUser(id: Schema["users"]["Id"]): Schema["users"]["Result"]
export type Schema = Typesaurus.Schema<typeof db>;

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: "male" | "female" | "other";
  dob: Date;
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
  type: "regular" | "student" | "senior";
  isCustomer: boolean;
  planExpiry?: Date;
}

interface Price {
  regular: number;
  student: number;
  discount: number;
}

interface MembershipPlan {
  name: string;
  description: string;
  duration: number;
  price: Price;
  status: "active" | "archived";
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
  planDateEnd: Date;
}

interface Payment {
  id: string;
  paymentMethod: string;
  status: string;
  isNewCustomer: boolean;
  createdAt: Typesaurus.ServerDate;
  user: {
    userId: Schema["users"]["Id"];
    name: string;
    imageUrl: string;
  };
  availedPlan: {
    membershipPlanId: Schema["membershipPlan"]["Id"];
    name: string;
    amount: number;
    duration: number;
    startDate: Date;
    endDate: Date;
  };
}

interface MembershipHistory {
  userId: Schema["users"]["Id"];
  membershipPlanId: Schema["membershipPlan"]["Id"];
}

interface KPIs {
  year: string;
  months: Typesaurus.SharedCollection<MonthKPI>;
}

interface MonthKPI {
  monthId: string;
  totalRevenue: number;
  totalCustomers: number;
  newCustomers: number;
  renewals: number;
}

interface Customers {
  overallCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
}

interface Apparels {
  name: string;
  price: number;
  discount?: number;
  imageUrl: string;
  description: string;
  type: "t-shirt" | "short" | "glove" | "headgear";
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}
