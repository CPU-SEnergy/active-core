import { Timestamp } from "firebase/firestore";

export interface Price {
  regular: number;
  student: number;
  special: number;
}

export interface MembershipPlan {
  name: string;
  description: string;
  duration: number;
  price: Price;
  status: "active" | "archived";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  planDateEnd: Date;
}

export interface MembershipPlansCollection {
  [membershipPlanId: string]: MembershipPlan;
}
