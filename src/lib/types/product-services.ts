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
