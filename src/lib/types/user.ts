import { Timestamp } from "firebase/firestore";

export interface UserData {
  email: string;
  uid: string;
  role: string;
  sex?: string;
  dob?: Date | string;
  updatedAt?: Date | string;
  createdAt: Date | string;
  lastName?: string;
  firstName?: string;
}

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: "male" | "female" | "other";
  dob: Date;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: "regular" | "student" | "senior";
  isCustomer: boolean;
}
