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
  
export interface Product{
    id: number;
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
    size?: ProductSize;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  count: number;
  category: string;
}

export interface NewArrival {
    id: number;
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
    size?: ProductSize;
}
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
