export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: 'Fresh Produce' | 'Bakery & Bread' | 'Pantry & Preserves' | 'Eggs & Dairy' | 'Garden & Herbs' | 'Other';
  inStock: boolean;
  stockCount?: number;
  image: string;
  badge?: string; // e.g., "Fresh Today", "Homegrown", "Bestseller"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryMethod = 'pickup' | 'dropoff';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  houseNumber: string;
  customerPhone?: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    unit: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'reserved' | 'ready' | 'completed' | 'cancelled';
}

export interface ShopInfo {
  name: string;
  tagline: string;
  houseAddress: string;
  pickupHours: string;
  contactPhone: string;
  pickupNote: string;
}
