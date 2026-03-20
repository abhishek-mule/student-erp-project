# 🏛️ Enterprise College ERP (Multi-Tenant)

A production-ready, highly-scalable Enterprise Resource Planning (ERP) system for colleges and universities. Built with a modern **Turborepo** monorepo architecture, designed for extreme performance and strict data isolation.

---

## 🚀 Key Features

- **🔐 Robust Multi-Tenancy**: Automated row-level security ensuring each college's data is strictly isolated.
- **⚡ Real-time Updates**: Live attendance and metrics tracking via Socket.io.
- **🏢 Enterprise Modules**:
  - **Student Management**: Profiles, admissions, and academic history.
  - **Teacher Portal**: Class management and result entry.
  - **Financials**: Automated fee record tracking and verification.
  - **Exams & Grading**: Automated result calculation and publication.
- **🛡️ Security First**: JWT-based rotatable authentication with global Role-Based Access Control (RBAC).

---

## 🛠️ Tech Stack

- **Monorepo**: [Turborepo](https://turbo.build/repo)
- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router, TailwindCSS, Framer Motion)
- **Backend**: [NestJS 11](https://nestjs.com/) (Modular architecture, WebSockets)
- **Database**: [Prisma ORM](https://www.prisma.io/) + [Neon Serverless Postgres](https://neon.tech/)
- **Infrastructure**: Render (API), Vercel (Web), Cloudflare R2 (Object Storage)

---

## 📁 Repository Structure

```
college-erp/
├── apps/
│   ├── api/          # NestJS Backend (Modular)
│   └── web/          # Next.js Frontend (Dynamic Tenant Routing)
├── packages/
│   ├── prisma/       # Shared Database Schema & Migrations
│   └── tsconfig/     # Shared TS configurations
└── .github/          # CI/CD Pipelines
```

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL (via Neon or local)

### 2. Installation
```powershell
# Install all dependencies (hoisted)
npm install
```

### 3. Environment Setup
Copy the `.env.local` to each app/package as needed:
- `DATABASE_URL`: Your Postgres connection string.
- `JWT_SECRET`: A secure key for tokens.

### 4. Database Initialization
```powershell
# Generate Prisma Client & Migrate
npm run generate
cd packages/prisma
npx prisma migrate dev
```

### 5. Seeding the Demo
```powershell
# Populate demo tenant & users (password: password)
npx ts-node prisma/seed.ts
```

### 6. Development
```powershell
# Run the entire stack in parallel
npm run dev
```

---

## 🚢 Deployment

The project is configured for automated deployment via **GitHub Actions** and the following platforms:
- **API**: [Render.com](https://render.com) (Check `render.yaml`)
- **Web**: [Vercel](https://vercel.com)
- **Database**: [Neon.tech](https://neon.tech)

---

## ⚖️ Scalability Analysis
The system is built to handle over **1 million students** across multiple college tenants. For a detailed breakdown of the vertical and horizontal scaling strategy, see our [Capacity Analysis](capacity_analysis.md).
