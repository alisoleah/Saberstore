export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badges?: string[];
  specs?: { [key: string]: string };
  warranty?: string;
  lowStock?: boolean;
}

export interface InstallmentPlan {
  months: number;
  monthlyPayment: number;
  downPayment: number;
  totalAmount: number;
  interestRate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  installmentPlan?: InstallmentPlan;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  creditLimit?: number;
  kycVerified: boolean;
  loyaltyPoints: number;
}
