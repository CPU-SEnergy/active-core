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
