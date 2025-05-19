export enum ProductAndServicesType {
  APPARELS = "apparels",
  COACHES = "coaches",
  CLASSES = "classes",
  MEMBERSHIPS = "memberships",
}

export interface APPARELDATA {
  id: string;
  name: string;
  type: string;
  discount?: number;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface COACHDATA {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  contactInfo: string;
  dob: Date;
  experience: number;
  certifications: string[];
  bio: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MEMBERSHIPDATA {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  planType: "individual" | "package" | "walk-in";
  createdAt: Date;
}
export interface CLASSDATA {
  id: string;
  name: string;
  schedule: string;
  description: string;
  imageUrl: string;
  coaches: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
