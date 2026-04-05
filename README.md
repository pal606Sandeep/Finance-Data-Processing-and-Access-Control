# Finance Data Processing & Access Control Backend

A robust, production-ready REST API built with **Node.js**, **Express**, and **MongoDB**. This project was developed to manage financial records with strict Role-Based Access Control (RBAC) and real-time dashboard analytics.

## 🚀 Key Features

- **Dual-Token Authentication**: Implemented JWT Access & Refresh token rotation for enhanced security.
- **RBAC (Role-Based Access Control)**: Custom middleware to enforce specific permissions for `Admin`, `Analyst`, and `Viewer`.
- **Advanced Data Aggregation**: Dashboard insights (Income, Expense, Net Balance, and Category totals) calculated using high-performance MongoDB Aggregation Pipelines.
- **Dynamic Filtering & Search**: API supports filtering by `type`, `category`, and `date range`, along with regex-based search for descriptions.
- **Optimization & Scalability**:
    - **Pagination**: Efficiently handles large datasets using `limit` and `skip`.
    - **Soft Delete**: Preserves data integrity by flagging records as deleted instead of removing them from the DB.
    - **Rate Limiting**: Protects against brute-force attacks and API abuse.

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES6+ Modules)
- **Framework**: Express.js (v5)
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (jsonwebtoken), BcryptJS (Password Hashing)
- **Utilities**: express-rate-limit, cors, dotenv

## 📂 Project Architecture

The project follows a **Layered Architecture** to ensure separation of concerns and maintainability:

- **`src/config`**: Database connection and CORS configurations.
- **`src/controllers`**: Handles request processing and response formatting.
- **`src/middleware`**: Centralized logic for Authentication, RBAC, Rate Limiting, and Global Error Handling.
- **`src/models`**: Mongoose schemas with pre-save hooks for data security.
- **`src/routes`**: API endpoint definitions with versioning (`/api/v1`).
- **`src/utils`**: Global helpers like `catchAsync` (to eliminate try-catch blocks) and custom `AppError` class.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd zorvyn

2. **Install dependencies:**
   npm install

3. **Configure Environment Variables:**
Create a .env file in the root directory:
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

4.**Run the application:**
  # Development mode (with nodemon)
   npm run dev

Action                            Admin      Analyst       Viewer
Create/Update/Delete Records       ✅         ❌           ❌
View All Records                   ✅         ✅           ✅
Filter/Search Records              ✅         ✅           ✅
View Dashboard Summary             ✅         ✅           ✅
Manage Users/Status                ✅         ❌           ❌

**API Endpoints (v1)**
**Auth**
--POST /api/v1/auth/register - Create a new account.

--POST /api/v1/auth/login - Authenticate and receive Access/Refresh tokens.

--POST /api/v1/auth/refresh - Get a new Access Token.

**Records**
--GET /api/v1/records - Fetch records (Supports ?page=1&limit=10&type=Income&search=Salary).

--POST /api/v1/records - Add a new record (Admin only).

--PATCH /api/v1/records/:id - Update a record (Admin only).

--DELETE /api/v1/records/:id - Soft delete a record (Admin only).

**Dashboard**
GET /api/v1/dashboard/summary - Get aggregated financial stats.
