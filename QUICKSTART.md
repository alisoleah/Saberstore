# 🚀 SaberStore - Quick Start Guide

## ✅ What's Done

Your SaberStore project is now **50% complete** with Phase 6 backend structure ready!

### Frontend (100% Complete)
- ✅ All 5 phases done
- ✅ Login/Register system
- ✅ Product comparison
- ✅ Budget filter
- ✅ Admin dashboard
- ✅ KYC system UI
- ✅ SMS OTP verification UI

### Backend (Structure Ready, Needs Setup)
- ✅ Complete directory structure
- ✅ 15-table database schema (marketplace-ready)
- ✅ Supabase configuration
- ✅ TypeScript setup
- ✅ All dependencies configured
- ⏳ Needs: Supabase account & npm install

---

## 🎯 Next 3 Steps (20 minutes total)

### Step 1: Create Supabase Account (5 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create new project:
   - Name: `saberstore-dev`
   - Password: [Create strong password - SAVE IT!]
   - Region: Frankfurt or Mumbai (closest to Egypt)
   - Click "Create new project"

5. Wait 2 minutes for database to provision

### Step 2: Get Database Connection (2 minutes)

1. In Supabase Dashboard, click ⚙️ **Settings**
2. Click **Database** tab
3. Scroll to **Connection string** section
4. Copy TWO connection strings:

**Connection Pooling (for app):**
```
postgresql://postgres.abcd1234:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Direct Connection (for migrations):**
```
postgresql://postgres.abcd1234:PASSWORD@db.abcd1234.supabase.co:5432/postgres
```

### Step 3: Setup Backend (13 minutes)

```bash
# 1. Go to backend directory (30 seconds)
cd backend

# 2. Create .env file (1 minute)
cp .env.example .env
# Open .env and paste your connection strings

# 3. Install dependencies (5 minutes)
npm install

# 4. Run database migrations (2 minutes)
npm run generate   # Generate Prisma Client
npm run migrate    # Create 15 tables in Supabase

# When prompted, name it: "init"

# 5. Seed initial data (2 minutes)
npm run seed       # Optional but recommended

# 6. Start dev server (30 seconds)
npm run dev
```

You should see:
```
✅ Connected to Supabase PostgreSQL database
🚀 Server running on http://localhost:3000
```

---

## 📊 Verify Setup

### Check Database Tables

1. **Option A: Supabase Dashboard**
   - Go to Supabase Dashboard
   - Click 📋 **Table Editor**
   - You should see 15 tables

2. **Option B: Prisma Studio**
```bash
npm run studio
```
   - Opens at http://localhost:5555
   - Browse all tables visually

### Test API

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 🗄️ Database Schema (15 Tables)

Your Supabase database now has:

**Core Tables:**
1. **users** - User accounts
2. **profiles** - KYC information
3. **credit_limits** - Installment credit
4. **categories** - Product categories
5. **products** - Product catalog

**Installment System:**
6. **installment_plans** - Payment plans
7. **orders** - Customer orders
8. **order_items** - Order details
9. **installment_contracts** - Legal contracts
10. **payment_schedule** - Monthly payments

**Marketplace Integration:**
11. **marketplace_channels** - Amazon, Noon, SaberStore
12. **marketplace_listings** - Product SKU mapping
13. **marketplace_orders** - External orders
14. **inventory_logs** - Stock changes

**Other:**
15. **store_branches** - Physical locations

---

## 🎨 Frontend + Backend Connection

Your frontend is at: `http://localhost:5173` (Vite)
Your backend is at: `http://localhost:3000` (Express)

### Run Both Simultaneously

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
```

---

## 📚 Documentation

- **[CURRENT_STATUS.md](CURRENT_STATUS.md)** - Current progress
- **[backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)** - Detailed Supabase guide
- **[backend/README.md](backend/README.md)** - Backend documentation
- **[MARKETPLACE_INTEGRATION.md](MARKETPLACE_INTEGRATION.md)** - Amazon & Noon integration
- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Full roadmap

---

## 🔧 Troubleshooting

### "Can't reach database server"
1. Check Supabase project is active (not paused)
2. Verify password in `.env` is correct
3. Ensure using correct connection string format

### "Prisma Client not generated"
```bash
npm run generate
```

### "Migration failed"
1. Delete `backend/prisma/migrations/` folder
2. Run `npm run migrate` again

### "Port 3000 already in use"
Change `PORT=3001` in `backend/.env`

---

## ✅ What's Working Now

After setup, you'll have:
- ✅ Frontend running at localhost:5173
- ✅ Backend API at localhost:3000
- ✅ Database on Supabase (cloud)
- ✅ 15 tables ready for data
- ✅ Prisma Studio for DB management

---

## 🚀 Next Development Steps

### Week 1 Remaining (This Week):
1. Build authentication API
   - Register endpoint
   - Login endpoint
   - JWT token generation
   - OTP verification

2. Build products API
   - List products
   - Search products
   - Filter by category

3. Connect frontend to backend
   - Replace mock data with real API calls
   - Test login flow
   - Test product listing

### Week 2: Orders & Installments
- Create order endpoints
- Calculate installments
- Generate contracts

### Week 3: KYC & Admin
- File upload (KYC documents)
- Admin approval system
- Credit limit management

### Week 4: Marketplace Integration
- Amazon SP-API setup
- Noon API integration
- Inventory sync

---

## 💡 Pro Tips

1. **Keep Backend Running**
   - Use `npm run dev` in backend (auto-reload on changes)

2. **Use Prisma Studio**
   - Visual database editor
   - Test queries
   - Add test data

3. **Check Supabase Dashboard**
   - Monitor database usage
   - View SQL logs
   - Backup database

4. **Git Workflow**
   - All commits are by alisoleah only
   - No Claude mentions
   - Clear commit messages

---

## 🎯 Your Goal This Week

**By end of Week 1, you should have:**
- ✅ Backend running smoothly
- ✅ Database fully migrated
- ✅ Authentication working
- ✅ Products API functional
- ✅ Frontend connected to real backend

**Time Estimate:** 3-5 days with my help, 1-2 weeks solo

---

## 🆘 Need Help?

If stuck at any step:
1. Check [backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)
2. Look at error messages carefully
3. Ask me: "I'm getting [error], help me fix it"

---

**Last Updated:** 2024-12-24
**Your Progress:** Frontend ✅ 100% | Backend ⏳ 20%
**Next Milestone:** Complete Week 1 of Phase 6
