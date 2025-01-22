type ProductFormData = {
  name: string;
  price: string;
  product_type: string;
  type: string;
  description: string;
  file: File | null;
};

interface Product {
  id: string;
  name: string;
  price: number;
  product_type: string;
  type: string;
  description: string;
  picture_link: string;
  special_price?: number;
  createdAt?: Date | string;
}

interface Coach {
  id: number;
  name: string;
  specialization: string;
  bio: string;
  image: string;
  age: number;
  experience: string;
  certifications: string[];
  contact: string;
}