# EcoTrace — Smart Household Carbon Footprint Tracker

> **Final-Year Engineering & Environmental Informatics Demonstration Platform**  
> A full-stack, responsive environmental analytics platform featuring real-time carbon calculation, personal daily targets, and gamified Google Pay-inspired rewards and scratch cards.

---

## 🌍 Executive Summary

**EcoTrace** bridges consumer behavior and environmental sustainability. It enables households to track electricity and cooking fuel consumption, calculates precise CO₂ emissions based on national baseline factors, benchmarks daily performance against personalized carbon targets, and incentivizes conservation through **EcoCredits**, streaks, redeemable demo rewards, and a fair per-capita competitive leaderboard.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts, Canvas-Confetti |
| **Backend** | Python 3, FastAPI, Pydantic v2, SQLAlchemy 2, PyJWT, Bcrypt |
| **Database** | SQLite (zero-config local dev) / Supabase PostgreSQL (production-ready) |
| **Auth** | JWT Bearer Tokens with persistent browser sessions and Supabase Auth compatibility |
| **Architecture** | Decoupled RESTful API, centralized scientific calculation engine, transaction-safe credit redemptions |

---

## 📐 Scientific Calculation Engine & Carbon Standards

### 1. Grid Electricity Emissions
$$\text{Electricity Consumption (kWh)} = \frac{\text{Power (Watts)} \times \text{Hours Used} \times \text{Quantity} \times \text{Mode Factor}}{1000}$$

$$\text{CO}_2 \text{ Emissions (kg)} = \text{Electricity (kWh)} \times \text{Grid Emission Factor}$$

- **Emission Factor:** `0.82 kg CO₂/kWh` (derived from the **Central Electricity Authority (CEA) of India Baseline Database** for the National Grid).
- **Mode Multipliers:** `Eco: 0.75x`, `Low: 0.70x`, `Medium: 1.00x`, `High/Turbo: 1.30x`.

### 2. Gas Cooking Fuel (LPG) Stoichiometry
$$\text{LPG Consumed (kg)} = \text{Active Hours} \times \text{Burners} \times 0.15 \text{ kg/hr} \times \text{Flame Factor}$$

$$\text{CO}_2 \text{ Emissions (kg)} = \text{LPG (kg)} \times 2.983 \text{ kg CO}_2\text{/kg LPG}$$

$$\text{Equivalent Thermal Energy} \approx \text{LPG (kg)} \times 12.8 \text{ kWh/kg}$$

> *Note:* Gas stoves calculate direct fuel stoichiometric combustion as mandated by **IPCC Guidelines for National Greenhouse Gas Inventories**, strictly avoiding false electrical watt conversions.

### 3. Fair Household-Normalized EcoScore Model (0–100)
$$\text{EcoScore} = (45\% \times \text{Budget Adherence}) + (30\% \times \text{Streak Consistency}) + (25\% \times \text{Logging Completeness})$$
- Normalized per capita so multi-generational households are evaluated on efficiency relative to benchmark rather than raw gross emissions.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

### 2. Run the Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
- Interactive Swagger API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- API Health check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open application: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Demo User Accounts (Pre-Seeded)

| Account | Email | Password | Role / Details |
| :--- | :--- | :--- | :--- |
| **Priya Sharma** | `priya@ecotrace.demo` | `DemoPassword123!` | Leaderboard Rank #1 (94.6 EcoScore, 14-day streak) |
| **Aarav Patel** | `aarav@ecotrace.demo` | `DemoPassword123!` | Leaderboard Rank #2 (91.2 EcoScore, 9-day streak) |
| **One-Click Demo** | Button on Login Page | Auto-fills Priya Sharma | Instant demonstration access |

---

## 🗄 Supabase PostgreSQL Schema

The production-ready database DDL and Row Level Security policies are located in:
`backend/supabase_schema.sql`

To deploy to Supabase:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `backend/supabase_schema.sql` and run.
4. Copy your PostgreSQL connection string into `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

---

## 📱 Features Walkthrough

1. **Landing Page:** Headline, live interactive carbon calculator simulator, 3-step workflow, features grid.
2. **First-Time Household Onboarding:** 4-step wizard capturing user details, dwelling parameters (1BHK–4BHK, sq.ft, city), appliance inventory selection, and live benchmark daily target calculation.
3. **Main Dashboard:** Real-time KPI stat cards, circular progress ring with status indicators, dual-axis and pie visualizations, recent activities table, and personalized energy-saving recommendations.
4. **Manual Activity Tracker:** Quick-add cards with presets, custom appliance creator, live pre-save CO₂ preview, and historical activity ledger.
5. **Analytics & CSV Export:** Date filtering (today, 7d, 30d, year, custom), top energy-consuming appliances ranking, category breakdown, and one-click downloadable CSV.
6. **Rewards Marketplace & Scratch Cards:** GPay-inspired marketplace with Nykaa, McDonald's, and Amazon vouchers; interactive tap-to-reveal scratch cards with confetti celebrations; and transactional credit ledger.
7. **Competitive Leaderboard:** Top 3 podium with gold, silver, and bronze pedestals, weekly/monthly/all-time views, and per-capita normalized fair rankings.
8. **Profile & Settings:** Custom target adjustments, appliance inventory management, achievements showcase, and password updates.
