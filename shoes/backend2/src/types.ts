export interface ProductFeatures {
  cashOnDelivery: boolean;
  lowestPrice: boolean;
  fiveDayReturns: boolean;
  freeDelivery: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sellingPrice?: number;
  description?: string;
  imageUrl?: string;
  brandName?: string;
  category?: string;
  features?: ProductFeatures;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  productId: string;
  quantity: number;
  orderDate: Date;
}