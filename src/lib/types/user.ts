export interface UserData {
  email: string;
  uid: string;
  role: string;
  sex?: string;
  dob?: Date | string;
  updated_at?: Date | string;
  created_at: Date | string;
  last_name?: string;
  first_name?: string;
}
