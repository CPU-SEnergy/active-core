import { schema, Typesaurus } from "typesaurus";

export const db = schema(
  ($) => ({
    users: $.collection<User>(),
    membershipPlans: $.collection<MembershipPlan>(),
    payments: $.collection<Payment>(),
    kpis: $.collection<KPIs>().sub({ months: $.collection<MonthKPI>() }),
    customers: $.collection<Customers>(),
    apparels: $.collection<Apparels>(),
    coaches: $.collection<Coaches>(),
    classes: $.collection<Classes>(),
    customer: $.collection<Customer>(),
    walkInCustomers: $.collection<WalkInCustomer>(),
  }),
  { server: { preferRest: true } }
);

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
  phone?: string;
}

interface MembershipPlan {
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  planType: "individual" | "package" | "walk-in";
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}

interface AvailedPlan {
  membershipPlanId: Schema["membershipPlans"]["Id"];
  name: string;
  amount: number;
  duration: number;
  startDate: Date;
  expiryDate: Date;
}

interface Payment {
  id: string;
  paymentMethod: string;
  isNewCustomer: boolean;
  createdAt: Typesaurus.ServerDate;
  isWalkIn: boolean;
  customer: CustomerBasicInfo;
  availedPlan: AvailedPlan;
}

interface CustomerBasicInfo {
  customerId:
    | Schema["walkInCustomers"]["Data"]["userId"]
    | Schema["customer"]["Data"]["userId"];
  firstName: string;
  lastName: string;
  type: "regular" | "student";
}

interface KPIs {
  year: string;
}

interface MonthKPI {
  revenue: number;
  customers: number;
}

interface Customers {
  totalCustomers: number;
}

export interface Apparels {
  name: string;
  price: number;
  discount?: number;
  imageUrl: string;
  description: string;
  type: string;
  isActive: boolean;
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}

interface Coaches {
  name: string;
  specialization: string;
  bio: string;
  dob: Date;
  experience: number;
  imageUrl: string;
  contactInfo: string;
  certifications?: string[];
  isActive: boolean;
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}

interface Classes {
  name: string;
  description: string;
  imageUrl?: string;
  schedule: string;
  coaches: Schema["coaches"]["Id"][];
  isActive: boolean;
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}

interface Customer {
  userId: Schema["users"]["Id"];
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  phone: string;
  type: "regular" | "student" | "senior";
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}

interface WalkInCustomer {
  firstName: string;
  lastName: string;
  email: string;
  type: "regular" | "student" | "senior";
  createdAt: Typesaurus.ServerDate;
  userId?: Schema["users"]["Id"];
}
