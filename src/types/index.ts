export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[]; // Array of image URLs for carousel
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
  email: string;
  passwordHash: string;
  isVerified: boolean;
  governorate?: string;
  createdAt: Date;
}

export interface Profile {
  userId: string;
  nationalId: string;
  scannedIdUrl?: string;
  utilityBillUrl?: string;
  monthlySalary: number;
  employer: string;
  address?: string;
  kycStatus: 'Pending' | 'Approved' | 'Rejected';
  kycSubmittedAt?: Date;
  kycApprovedAt?: Date;
  approvedBy?: string;
}

export interface CreditLimit {
  userId: string;
  totalLimit: number;
  currentBalance: number;
  remainingLimit: number;
  status: 'Active' | 'Frozen' | 'Suspended';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface InstallmentPlanConfig {
  id: string;
  name: string;
  durationMonths: number;
  interestRate: number;
  minDownPayment: number;
  isActive: boolean;
  applicableCategories?: string[];
  promotionalUntil?: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: Date;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress?: string;
  governorate?: string;
  pickupBranch?: string;
  paymentMethod: 'card' | 'fawry' | 'wallet' | 'installment';
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  warrantyMonths: number;
}

export interface InstallmentContract {
  id: string;
  orderId: string;
  userId: string;
  installmentPlanId: string;
  totalFinancedAmount: number;
  downPaymentAmount: number;
  monthlyPaymentAmount: number;
  startDate: Date;
  endDate: Date;
  contractSignedAt?: Date;
  otpVerified: boolean;
  otpCode?: string;
  phoneNumber: string;
  status: 'Active' | 'Completed' | 'Defaulted' | 'Cancelled';
}

export interface PaymentSchedule {
  id: string;
  contractId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Late';
  paidAt?: Date;
  paidAmount?: number;
  lateFee?: number;
}

export interface StoreBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  hasStock: boolean;
}
