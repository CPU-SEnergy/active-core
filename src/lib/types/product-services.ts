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
  createdAt: Date;
  updatedAt: Date;
}
