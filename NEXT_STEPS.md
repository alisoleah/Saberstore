# Saber Store - Implementation Roadmap

## ✅ COMPLETED PHASES

### Phase 1: Navigation Improvements
- [x] Back navigation in CheckoutFlow
- [x] Breadcrumb navigation
- [x] Mobile hamburger menu

### Phase 2: PRD Features
- [x] Budget Filter with EGP ranges
- [x] Product Comparison (side-by-side)
- [x] SMS OTP Verification (Egyptian phones)

### Phase 3: ERD Implementation
- [x] TypeScript interfaces for all entities
- [x] Mock data (plans, branches, KYC applications)

### Phase 4: Admin Dashboard
- [x] KYC approval dashboard
- [x] Interest rate management

### Phase 5: Authentication & Deployment
- [x] Login/Register modal
- [x] Vercel deployment configuration

---

## 🗄️ PHASE 6: BACKEND & DATABASE (CRITICAL - NEXT PRIORITY)

Transform the frontend prototype into a production-ready full-stack application.

### 6.1 Technology Stack

**Backend:**
- Framework: Node.js + Express OR NestJS
- Database: PostgreSQL + Redis (caching)
- ORM: Prisma (type-safe)
- Auth: JWT + Refresh Tokens
- File Storage: AWS S3 / Cloudinary
- SMS: Twilio / Egyptian provider
- Payment: Paymob / Fawry / Accept Payment

### 6.2 Database Schema (Prisma)

Create `backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  fullName     String    @map("full_name")
  phoneNumber  String    @unique @map("phone_number")
  email        String?   @unique
  passwordHash String    @map("password_hash")
  isVerified   Boolean   @default(false)
  governorate  String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  profile   Profile?
  creditLimit CreditLimit?
  orders    Order[]
  contracts InstallmentContract[]

  @@map("users")
}

model Profile {
  id             String    @id @default(uuid())
  userId         String    @unique @map("user_id")
  nationalId     String    @unique @map("national_id")
  scannedIdUrl   String?   @map("scanned_id_url")
  utilityBillUrl String?   @map("utility_bill_url")
  monthlySalary  Decimal   @map("monthly_salary") @db.Decimal(10, 2)
  employer       String
  address        String?
  kycStatus      String    @default("Pending")
  kycSubmittedAt DateTime?
  kycApprovedAt  DateTime?
  approvedBy     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model CreditLimit {
  id             String    @id @default(uuid())
  userId         String    @unique @map("user_id")
  totalLimit     Decimal   @db.Decimal(10, 2)
  currentBalance Decimal   @default(0) @db.Decimal(10, 2)
  remainingLimit Decimal   @db.Decimal(10, 2)
  status         String    @default("Active")
  approvedBy     String?
  approvedAt     DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credit_limits")
}

model Category {
  id           String   @id @default(uuid())
  name         String   @unique
  icon         String
  productCount Int      @default(0)
  createdAt    DateTime @default(now())

  products Product[]

  @@map("categories")
}

model Product {
  id          String   @id @default(uuid())
  name        String
  sku         String   @unique
  cashPrice   Decimal  @db.Decimal(10, 2)
  oldPrice    Decimal? @db.Decimal(10, 2)
  stockQty    Int      @map("stock_qty")
  brand       String
  categoryId  String   @map("category_id")
  warranty    String?
  rating      Decimal  @default(0) @db.Decimal(3, 2)
  reviewCount Int      @default(0)
  specs       Json?
  badges      Json?
  imageUrl    String   @map("image_url")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category   Category    @relation(fields: [categoryId], references: [id])
  orderItems OrderItem[]

  @@map("products")
}

model InstallmentPlan {
  id                   String    @id @default(uuid())
  name                 String
  durationMonths       Int       @map("duration_months")
  interestRate         Decimal   @db.Decimal(5, 2)
  minDownPayment       Decimal   @db.Decimal(5, 2)
  isActive             Boolean   @default(true)
  applicableCategories Json?
  promotionalUntil     DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  contracts InstallmentContract[]

  @@map("installment_plans")
}

model Order {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  orderDate       DateTime @default(now())
  totalAmount     Decimal  @db.Decimal(10, 2)
  status          String   @default("Pending")
  deliveryMethod  String   @map("delivery_method")
  deliveryAddress String?
  governorate     String?
  pickupBranch    String?
  paymentMethod   String   @map("payment_method")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user     User                 @relation(fields: [userId], references: [id])
  items    OrderItem[]
  contract InstallmentContract?

  @@map("orders")
}

model OrderItem {
  id              String   @id @default(uuid())
  orderId         String   @map("order_id")
  productId       String   @map("product_id")
  quantity        Int
  priceAtPurchase Decimal  @db.Decimal(10, 2)
  warrantyMonths  Int
  createdAt       DateTime @default(now())

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model InstallmentContract {
  id                   String    @id @default(uuid())
  orderId              String    @unique @map("order_id")
  userId               String    @map("user_id")
  installmentPlanId    String    @map("installment_plan_id")
  totalFinancedAmount  Decimal   @db.Decimal(10, 2)
  downPaymentAmount    Decimal   @db.Decimal(10, 2)
  monthlyPaymentAmount Decimal   @db.Decimal(10, 2)
  startDate            DateTime
  endDate              DateTime
  contractSignedAt     DateTime?
  otpVerified          Boolean   @default(false)
  otpCodeHash          String?
  phoneNumber          String
  status               String    @default("Active")
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  order           Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)
  user            User              @relation(fields: [userId], references: [id])
  installmentPlan InstallmentPlan   @relation(fields: [installmentPlanId], references: [id])
  paymentSchedule PaymentSchedule[]

  @@map("installment_contracts")
}

model PaymentSchedule {
  id                String    @id @default(uuid())
  contractId        String    @map("contract_id")
  installmentNumber Int
  dueDate           DateTime
  amount            Decimal   @db.Decimal(10, 2)
  status            String    @default("Pending")
  paidAt            DateTime?
  paidAmount        Decimal?  @db.Decimal(10, 2)
  lateFee           Decimal?  @db.Decimal(10, 2)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  contract InstallmentContract @relation(fields: [contractId], references: [id], onDelete: Cascade)

  @@map("payment_schedule")
}

model StoreBranch {
  id           String   @id @default(uuid())
  name         String
  city         String
  address      String
  phone        String
  workingHours String   @map("working_hours")
  latitude     Decimal? @db.Decimal(10, 8)
  longitude    Decimal? @db.Decimal(11, 8)
  hasStock     Boolean  @default(true)
  createdAt    DateTime @default(now())

  @@map("store_branches")
}
```

### 6.3 Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── config.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── kyc.controller.ts
│   │   └── admin.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── sms.service.ts
│   │   ├── payment.service.ts
│   │   └── storage.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── products.routes.ts
│   │   └── admin.routes.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── package.json
└── .env
```

### 6.4 API Endpoints

**Auth:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-phone
POST /api/auth/confirm-otp
```

**Products:**
```
GET  /api/products
GET  /api/products/:id
GET  /api/products/search
GET  /api/categories
```

**KYC:**
```
POST /api/kyc/submit
GET  /api/kyc/status
POST /api/kyc/upload-document
```

**Orders:**
```
POST /api/orders
GET  /api/orders/:id
GET  /api/orders/user/:userId
```

**Admin:**
```
GET  /api/admin/kyc/pending
PUT  /api/admin/kyc/approve
PUT  /api/admin/kyc/reject
GET  /api/admin/analytics
```

### 6.5 Setup Commands

```bash
# Create backend
mkdir backend && cd backend
npm init -y

# Install dependencies
npm install express @prisma/client bcryptjs jsonwebtoken cors dotenv multer
npm install twilio @aws-sdk/client-s3 node-cron redis

# Install dev dependencies
npm install -D typescript @types/express @types/node prisma ts-node-dev

# Initialize
npx tsc --init
npx prisma init
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "migrate": "npx prisma migrate dev",
    "studio": "npx prisma studio"
  }
}
```

### 6.6 Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/saberstore"
REDIS_URL="redis://localhost:6379"

JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"

AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET_NAME="saberstore-kyc"

PAYMOB_API_KEY="your-paymob-key"

NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### 6.7 Frontend Integration

Create `frontend/src/config/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });

  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}

export const authAPI = {
  register: (data: any) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) })
};

export const productsAPI = {
  getAll: () => apiCall<Product[]>('/products'),
  getById: (id: string) => apiCall<Product>(`/products/${id}`)
};
```

Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 6.8 Implementation Roadmap

**Week 1: Database & Core**
- [ ] Setup PostgreSQL
- [ ] Implement Prisma schema
- [ ] Create migrations
- [ ] Setup Express server
- [ ] Authentication (JWT)

**Week 2: Products & Orders**
- [ ] Product CRUD endpoints
- [ ] Search and filtering
- [ ] Order management
- [ ] Installment calculations

**Week 3: KYC & Admin**
- [ ] File upload (KYC)
- [ ] KYC submission
- [ ] Admin dashboard APIs
- [ ] Credit approval workflow

**Week 4: Integrations**
- [ ] SMS gateway (Twilio)
- [ ] Payment gateway (Paymob)
- [ ] S3 storage
- [ ] API testing

**Week 5: Deployment**
- [ ] Deploy backend
- [ ] Database backups
- [ ] Monitoring
- [ ] Cron jobs
- [ ] Performance testing

### 6.9 Deployment Options

**Backend:**
- DigitalOcean App Platform (easiest)
- AWS EC2/ECS (full control)
- Heroku (simple MVP)

**Database:**
- AWS RDS
- DigitalOcean Managed DB
- Supabase

**Redis:**
- Redis Cloud
- AWS ElastiCache

---

## 🏪 PHASE 7: Enhanced Checkout

### 7.1 Down Payment Logic
- Calculate down payment from plan
- Split payment processing
- Payment schedule preview

### 7.2 Store Pickup Enhancement
- Branch details
- Google Maps integration
- Stock availability per branch

---

## 🎨 PHASE 8: UX Polish

### 8.1 Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support

### 8.2 Loading States
- Spinners
- Skeleton screens
- Error boundaries

---

## ⚡ PHASE 9: Performance

### 9.1 Optimization
- Code splitting (lazy load)
- Image optimization (WebP)
- Memoization (useMemo)

---

## 🔐 PHASE 10: Security

### 10.1 Validation
- Egyptian phone validation
- National ID (14 digits)
- Input sanitization

### 10.2 File Security
- File type validation
- Size limits (5MB)
- Secure storage

---

## 📱 PHASE 11: Additional Features

### 11.1 User Account
- Profile page
- Order history
- Payment tracking

### 11.2 Notifications
- Payment reminders (SMS)
- Order updates
- KYC notifications

---

## 🛠️ Quick Reference

### Completed Files
```
✅ src/components/Header.tsx
✅ src/components/Footer.tsx
✅ src/components/LoginModal.tsx
✅ src/components/BudgetFilter.tsx
✅ src/components/ProductComparison.tsx
✅ src/components/SMSOTPVerification.tsx
✅ src/components/admin/KYCReviewCard.tsx
✅ src/components/admin/InterestRateConfig.tsx
✅ src/pages/AdminDashboard.tsx
✅ src/types/index.ts
✅ src/data/mockData.ts
✅ vercel.json
```

### Priority Order
1. **Phase 6** - Backend & Database (CRITICAL)
2. **Phase 7** - Enhanced checkout
3. **Phases 8-11** - Polish & optimization

---

**Last Updated:** 2024-12-24
**Version:** 2.0
**Maintained by:** alisoleah
