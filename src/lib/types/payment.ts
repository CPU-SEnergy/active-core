import { Timestamp } from "firebase/firestore";

export interface payments {
  id: string;
  paymentMethod: string;
  status: string;
  isNewCustomer: boolean;
  createdAt: Timestamp;
  user: {
    userId: string;
    name: string;
    imageUrl: string;
  };
  availedPlan: {
    membershipPlanId: string;
    name: string;
    amount: number;
    duration: number;
  };
}
