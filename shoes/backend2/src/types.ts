export interface ProductFeatures {
  cashOnDelivery: boolean;
  lowestPrice: boolean;
  fiveDayReturns: boolean;
  freeDelivery: boolean;
}
export interface ProductSize {
  US7: boolean;
  US8: boolean;
  US9: boolean;
  US10: boolean;
  US11: boolean;
  US12: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand:string;
  details:string
  price: number;
  sellingPrice?: number;
  description?: string;
  imageUrls?: string[]; // Assuming you might have multiple image URLs
  brandName?: string;
  category?: string;
  features?: ProductFeatures;
}

export interface Order {
  id: string;
  cUStomerName: string;
  address: string;
  phone: string;
  email: string;
  productId: string;
  quantity: number;
  orderDate: Date;
}
