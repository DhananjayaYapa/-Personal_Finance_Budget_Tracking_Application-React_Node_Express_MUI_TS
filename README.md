# 💰 Personal Finance Budget Tracking Application

A full-stack personal finance management system built with **React + TypeScript** frontend and **Express.js + Prisma** backend, following a clean **Controller → Service** architecture.

Track your income & expenses, manage budgets per category, and visualize your financial health through an interactive dashboard with charts and progress indicators.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** + TypeScript | UI framework with type safety |
| **Vite** | Build tool & dev server |
| **Material UI (MUI) v6** | Component library & theming |
| **Redux + Redux-Saga** | State management & async side effects |
| **React Hook Form** | Form handling & validation |
| **React Router v7** | Client-side routing |
| **Recharts** | Data visualization (Pie, Bar charts) |
| **Axios** | HTTP client with JWT interceptors |
| **SCSS** | Custom styling & CSS modules |
| **Day.js** | Date manipulation |
| **ESLint + Prettier** | Code quality & formatting |

### Backend
| Technology | Purpose |
|---|---|
| **Express.js** | Node.js web framework |
| **TypeScript** + ES Modules | Type safety & modern JS |
| **Prisma v7** | ORM with PostgreSQL adapter |
| **PostgreSQL** | Relational database |
| **Zod** | Request validation & type inference |
| **JSON Web Token (JWT)** | Authentication |
| **bcryptjs** | Password hashing |
| **Pino** | Structured logging |
| **Swagger (OpenAPI 3.0)** | Interactive API documentation |
| **json2csv** | CSV export |
| **ESLint + Prettier** | Code quality & formatting |

---

## ✨ Key Features

### 🔐 Authentication
- User registration & login with JWT
- Password hashing with bcrypt
- Protected routes & auto-redirect on token expiry
- Profile management & password change

### 💸 Income & Expense Management
- Add, edit, and delete transactions
- Categorize by income or expense type
- Filter by date range, category, and type
- Paginated & sortable transaction list
- CSV and JSON export

### 📊 Budget Management
- Create monthly budgets per expense category
- Visual progress bars showing spending vs. budget
- Overspending alerts with color-coded indicators
- Budget vs. actual comparison

### 🏷️ Category Management
- Custom income and expense categories
- Delete protection (categories with transactions/budgets cannot be deleted)
- Unique constraint per user per type

### 📈 Dashboard
- Financial summary cards (total income, expenses, balance)
- Expense distribution pie chart by category
- Monthly income vs. expenses bar chart
- Budget progress overview
- Recent transactions list

### 📋 Reports
- Filterable transaction reports
- Budget utilization reports
- Export data as CSV or JSON

---

## 📁 Project Structure

```
├── client/                          # React Frontend
│   ├── src/
│   │   ├── assets/theme/            # MUI theme & SCSS variables
│   │   ├── components/              # Reusable UI components
│   │   │   ├── dashboard/           # StatCard, Charts, BudgetProgress
│   │   │   ├── transactions/        # TransactionTable, Filters, FormDialog
│   │   │   ├── categories/          # CategoryTable, FormDialog
│   │   │   ├── budgets/             # BudgetCard, Filters, FormDialog
│   │   │   ├── reports/             # ReportFilters, Tables, StatCards
│   │   │   ├── profile/             # ProfileForm, PasswordChange
│   │   │   └── shared/              # AlertSnackbar, ConfirmationDialog, etc.
│   │   ├── pages/                   # Route-level page components
│   │   ├── redux/                   # Actions, Reducers, Sagas
│   │   ├── routes/                  # Route definitions & PrivateRoute guard
│   │   ├── services/                # Axios API service layer
│   │   ├── templates/               # AppLayout with header/sidebar
│   │   ├── types/                   # TypeScript type definitions
│   │   └── utilities/               # Constants, helpers, models
│   └── ...
│
├── server/                          # Express Backend
│   ├── prisma/
│   │   └── schema.prisma            # Database schema (4 models)
│   ├── scripts/
│   │   └── seed.ts                  # Database seeding script
│   ├── src/
│   │   ├── config/                  # DB, Logger, Swagger config
│   │   ├── middleware/              # Auth, Error handler, Zod validation
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/                # schema, service, controller, routes
│   │   │   ├── categories/          # schema, service, controller, routes
│   │   │   ├── transactions/        # schema, service, controller, routes
│   │   │   └── budgets/             # schema, service, controller, routes
│   │   ├── shared/                  # Constants, response & export helpers
│   │   ├── routes/                  # Route aggregator
│   │   └── server.ts                # App entry point
│   └── ...
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v22 recommended)
- **PostgreSQL** 14+ (running locally or remote)
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/DhananjayaYapa/-Personal_Finance_Budget_Tracking_Application-React_Node_Express_MUI_TS.git
cd -Personal_Finance_Budget_Tracking_Application-React_Node_Express_MUI_TS
```

### 2. Backend Setup

```bash
cd server

# Install dependencies (also runs prisma generate via postinstall)
npm install

# Copy environment template and configure
cp .env.example .env
# Edit .env with your PostgreSQL credentials:
#   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/expense_tracker_db
#   JWT_SECRET=your-secret-key

# Create the database (in psql or pgAdmin)
# CREATE DATABASE expense_tracker_db;

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed with demo data
npm run seed
# Demo user: john@example.com / Password1

# Start the development server
npm run dev
# Server runs on http://localhost:5000
# Swagger API docs at http://localhost:5000/api-docs
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Default: VITE_API_BASE_URL=http://localhost:5000/api/v1

# Start the development server
npm run dev
# App runs on http://localhost:5173
```

---

## 📜 Available Scripts

### Backend (`/server`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm run seed` | Seed database with demo data |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run prisma:migrate` | Run database migrations |

### Frontend (`/client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |
| GET | `/api/categories` | List categories (filter by type) | ✅ |
| POST | `/api/categories` | Create category | ✅ |
| GET | `/api/categories/:id` | Get category | ✅ |
| PUT | `/api/categories/:id` | Update category | ✅ |
| DELETE | `/api/categories/:id` | Delete category | ✅ |
| GET | `/api/transactions` | List with filters & pagination | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| GET | `/api/transactions/:id` | Get transaction | ✅ |
| PUT | `/api/transactions/:id` | Update transaction | ✅ |
| DELETE | `/api/transactions/:id` | Delete transaction | ✅ |
| GET | `/api/transactions/export/csv` | Export as CSV | ✅ |
| GET | `/api/transactions/export/json` | Export as JSON | ✅ |
| GET | `/api/budgets` | List budgets (filter by month/year) | ✅ |
| POST | `/api/budgets` | Create budget | ✅ |
| GET | `/api/budgets/:id` | Get budget | ✅ |
| PUT | `/api/budgets/:id` | Update budget | ✅ |
| DELETE | `/api/budgets/:id` | Delete budget | ✅ |
| GET | `/api/budgets/progress` | Budget vs actual spending | ✅ |
| GET | `/api/health` | Health check | ❌ |

> **Interactive API Docs:** Visit `http://localhost:5000/api-docs` for Swagger UI.

---

## 🌱 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `LOG_LEVEL` | Pino log level | `info` |

### Frontend (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api/v1` |
| `VITE_APP_ENV` | App environment | `development` |