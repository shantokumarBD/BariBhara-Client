# 🏠 BariBhara — Intelligent Smart Rental & Property Management SaaS

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

> **A next-generation, cloud-native rental ecosystem bridging Landlords, Tenants, and Super Administrators with automated billing, transparent security deposit settlements, mobile-first responsive design, and SaaS subscription tiers.**

---

## 📌 Executive Summary & Core Purpose

In developing and rapidly urbanizing rental markets (particularly Bangladesh), property management is predominantly manual, paper-driven, and prone to disputes. Landlords juggle paper receipts, unrecorded utility expenses, and delayed payments, while tenants struggle with sudden move-out demands, untracked security deposits, and lack of verifiable rent receipts.

**BariBhara (বাড়িভাড়া)** was architected to eliminate these systemic inefficiencies:
1. **100% Digital & Paperless Operation:** Streamlining unit leasing, monthly recurring rent calculations, utility billing, and formal move-out agreements.
2. **Accountability & Trust:** Introducing bidirectional tenant-landlord rating systems, tamper-evident digital payment tracking, and formal 30-day move-out notices.
3. **SaaS-First Monetization Engine:** Providing scalable subscription plans (Free Trial vs. Pro Plan) enabling property owners to grow from a single unit to multi-building residential complexes.

---

## 💡 Key Real-World Problems Solved

| Real-World Problem | Traditional Practice | BariBhara SaaS Solution |
| :--- | :--- | :--- |
| **Delayed & Forgotten Rent Collections** | Manual phone calls, awkward verbal reminders, missed due dates. | **Automated 1st-of-the-month invoice generation**, late fee calculations (`+৳200`), and **1-click WhatsApp instant reminders**. |
| **Security Deposit Disputes** | Clashes upon move-out regarding unpaid bills, wall damages, or unclear deductions. | **Automated Deposit Settlement Engine** calculating gross deposit, unpaid rent, utility dues, damage deductions, and exact net refund. |
| **Sudden & Informal Move-Outs** | Unplanned move-outs leaving landlords with unexpected vacancies and lost revenue. | **Formal 30-day digital move-out notice system** with transparent inspection and handover tracking. |
| **Inefficient Property Hunting & Visits** | Aimless physical searches in neighborhood streets or unreliable middlemen. | **Public To-Let directory** with high-res photo galleries, verified amenities, and **In-App Schedule Visit booking**. |
| **Lack of Tenant/Landlord Verification** | No reliable background or behavioral reference check. | **Bidirectional 5-Star Rating Engine** with verified historical reviews for both parties. |
| **Lost or Disputed Paper Receipts** | Hand-written chits easily lost, water-damaged, or forged. | **One-click high-resolution PDF invoices** with barcodes, breakdowns, and digital audit stamps. |
| **Platform Commercial Sustainability** | High infrastructure costs without a clear recurring revenue model. | **Integrated Tiered Subscription Architecture** (Free vs. Pro Plans) with admin verification engines. |

---

## 👥 Comprehensive Role-Based Feature Suite

### 🏡 1. Landlord Dashboard (Property & Portfolio Owners)
- **Multi-Property & Unit Management:** Add and manage multiple buildings, floor configurations, flat numbers, and real-time occupancy status (Occupied vs. Vacant).
- **Tenant Lifecycle Onboarding:** Securely record tenant identities (NID, emergency contact, profession) and digitally assign units with defined monthly rates and advance deposits.
- **Automated Monthly Invoicing & Billing Engine:** Consolidates house rent, gas, electricity, water, and service charges. Automatically triggers invoices on the 1st of every month.
- **1-Click WhatsApp Reminder:** Instantly send pre-formatted, polite rent reminders containing due amounts and payment instructions directly to the tenant's WhatsApp.
- **Security Deposit Settlement Calculator:** Formally settle lease terminations by inputting utility deductions and damage repairs to produce an audited refund statement.
- **Maintenance Ticketing:** Receive, review, and mark maintenance requests (plumbing, electrical, structural) as resolved.
- **Tenant Performance Rating:** Rate tenants (1 to 5 stars) on timeliness of payment and property care.
- **SaaS Subscription Gating & Renewals:** Monitor plan validity with an active 5-day expiration countdown alert and instant renewal workflows.

---

### 👤 2. Tenant Portal (Residents & Renters)
- **Unified Rent Ledger & Digital Receipts:** View current dues, historical payment logs, and download professional PDF rent slips anytime.
- **Payment Confirmation & Tracking:** Mark invoices as paid and maintain a verified digital payment history.
- **Formal Move-Out Notice Submission:** Select the planned departure date, state the reason, and notify the landlord 30 days in advance per lease terms.
- **Landlord & Property Review:** Rate the landlord's maintenance responsiveness and property condition upon lease completion.
- **Schedule Property Visits:** Explore available units across the platform and request on-site physical tour slots with the landlord.

---

### 🛠️ 3. Super Admin Control Center (Platform Owners)
- **Executive Analytics & KPI Dashboard:** Track aggregate platform revenue, active landlords, total leased units, and monthly subscription growth curves.
- **Subscription Verification Engine:** Review pending bKash / Nagad / Bank transfer subscription upgrades, verify transaction references (TrxID / screenshots), and approve or reject with 1 click.
- **Dynamic Plan & Pricing Engine:** Configure plan names, monthly fees, property and tenant capacity limits, and feature flags dynamically without code redeployment.
- **User & Platform Governance:** Manage user statuses, moderate property listings, and ensure system-wide compliance.

---

## 💻 Technology Stack & Architecture

### Frontend (Client)
- **Framework:** [React 18](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite](https://vitejs.dev/) (Fast HMR & optimized production builds)
- **Styling:** [TailwindCSS 3](https://tailwindcss.com/) with custom CSS utility tokens and dark-mode support
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for auth & modal states
- **Server State & Caching:** [@tanstack/react-query v5](https://tanstack.com/query/latest)
- **Icons & Typography:** [Lucide React](https://lucide.dev/), Material Symbols, Google Fonts
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/) toast system
- **Document Generation:** `html2canvas` and `jspdf` for client-side vector-accurate invoice PDFs
- **Mobile Experience:** Mobile-first responsive layout with native safe-area padding and a floating bottom navigation bar

### Backend (Server)
- **Runtime:** [Node.js](https://nodejs.org/) (LTS) & [Express.js](https://expressjs.com/)
- **Language:** TypeScript executed via `tsx watch`
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication:** JWT (JSON Web Tokens) with password hashing via `bcryptjs`
- **Scheduled Automation:** Background cron jobs for daily subscription expiration audits and monthly rent invoice generation

---

## 📂 Project Architecture

```
BariBhara/
├── BariBhara-Client/              # Frontend Application (React + Vite + TS)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── layout/            # Sidebar, Topbar, BottomNavigation, MainLayout
│   │   │   ├── modals/            # Deposit Settlement, Move-Out, Visit, Rating modals
│   │   │   └── ui/                # Buttons, Cards, Badges, Loaders
│   │   ├── pages/                 # Role-based route views
│   │   │   ├── admin/             # AdminDashboard, AdminPlans, AdminUsers
│   │   │   ├── Dashboard.tsx      # Landlord overview & KPI cards
│   │   │   ├── Properties.tsx     # Property & unit management
│   │   │   ├── RentManagement.tsx # Rent ledgers, late fees & WhatsApp triggers
│   │   │   ├── Tenants.tsx        # Tenant directory & lease details
│   │   │   ├── PaymentPage.tsx    # Subscription checkout & TrxID verification
│   │   │   └── Settings.tsx       # Landlord subscription info & profile
│   │   ├── store/                 # Zustand global stores (auth, confirm modals)
│   │   ├── types/                 # Centralized TypeScript interfaces
│   │   └── main.tsx               # Application bootstrap & router
│   ├── tailwind.config.js
│   └── package.json
│
└── BariBhara-Server/              # Backend REST API (Node + Express + TS)
    ├── src/
    │   ├── controllers/           # Auth, Properties, Rent, Settlement, Admin controllers
    │   ├── models/                # Mongoose Schemas (User, Property, Rent, Subscription)
    │   ├── routes/                # Protected & public API routes
    │   ├── middleware/            # Auth guard, Role verification (RBAC)
    │   └── index.ts               # Express entrypoint & database connection
    └── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- `npm` or `yarn`

---

### Step 1: Start the Backend Server
```bash
cd BariBhara-Server
npm install
npm run dev
```
> The server will start on **`http://localhost:4000`** and connect to your MongoDB database.

---

### Step 2: Start the Frontend Client
```bash
cd BariBhara-Client
npm install
npm run dev
```
> The client development server will start on **`http://localhost:5173`**.

---

## 🔐 Security & Access Control

- **Strict RBAC (Role-Based Access Control):** Granular authorization barriers separate `landlord`, `tenant`, and `admin` interfaces. Unauthorized API queries return 401/403 errors.
- **Subscription Hard Gating:** Landlords with expired subscriptions or pending verification are restricted to the plan selection screen until activated.
- **Sanitized Inputs & Safe Headers:** CORS policies and sanitized payloads prevent injection vulnerabilities.

---

## 📄 License
This project is proprietary and developed for smart urban housing management. All rights reserved.
