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

interface Class {
  sports_id: string;
  image: string;
  description: string;
  title: string;
  coach: string;
}