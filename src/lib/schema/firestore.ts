import { schema, Typesaurus } from "typesaurus";

export const db = schema(
  ($) => ({
    users: $.collection<User>(),
    membershipPlan: $.collection<MembershipPlan>(),
    payments: $.collection<Payment>(),
    membershipHistory: $.collection<MembershipHistory>(),
    kpis: $.collection<KPIs>().sub({ months: $.collection<MonthKPI>() }),
    customers: $.collection<Customers>(),
    apparels: $.collection<Apparels>(),
    coaches: $.collection<Coaches>(),
    classes: $.collection<Classes>(),
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
  planDateEnd?: Date;
}

interface UserBasicInfo {
  userId: Schema["users"]["Id"];
  name: string;
  type: "regular" | "student";
  imageUrl: string;
}

interface AvailedPlan {
  membershipPlanId: Schema["membershipPlan"]["Id"];
  name: string;
  amount: number;
  duration: number;
  startDate: Date;
  expiryDate: Date;
}

interface Payment {
  id: string;
  paymentMethod: string;
  status: string;
  isNewCustomer: boolean;
  createdAt: Typesaurus.ServerDate;
  user: UserBasicInfo;
  availedPlan: AvailedPlan;
}

interface MembershipHistory {
  userId: Schema["users"]["Id"];
  paymentId: Schema["payments"]["Id"];
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
  certifications: string[];
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}

interface Classes {
  name: string;
  description: string;
  imageUrl?: string;
  schedule: string;
  types: string[];
  coachId: Schema["coaches"]["Id"][];
  createdAt: Typesaurus.ServerDate;
  updatedAt: Typesaurus.ServerDate;
}
