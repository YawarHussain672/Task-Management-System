# Task Management System

A full-stack task management application built with **Node.js/TypeScript** backend and **Next.js** frontend.

## ✨ Features

- 🔐 **Authentication** - JWT-based login/register with access & refresh tokens
- ✅ **Task Management** - Create, edit, delete, and toggle task status
- 🔍 **Search & Filter** - Search by title and filter by status (Pending, In Progress, Completed)
- 📱 **Responsive Design** - Modern UI that works on all devices
- 🎨 **Beautiful UI** - Gradient design with smooth animations and glassmorphism effects
- 🐘 **PostgreSQL** - Production-ready database integration

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- Prisma ORM + PostgreSQL (Neon DB)
- JWT Authentication
- bcrypt for password hashing

### Frontend
- Next.js 14 (App Router)
- TypeScript
- CSS Modules
- React Context for state management

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use Neon/Supabase)

### Backend Setup

```bash
cd backend
npm install
# Create a .env file with DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
npx prisma generate
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev
```

The frontend will run on http://localhost:3000

## ☁️ Deployment Guide

### 1. Deploy Backend (Render.com)

1. Create a new **Web Service** on Render connected to this repo (Root Directory: `backend`)
2. Use these settings:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
3. Add **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Neon/Supabase)
   - `JWT_SECRET`: A long random string
   - `JWT_REFRESH_SECRET`: Another long random string
   - `FRONTEND_URL`: Your Vercel frontend URL (add this after deploying frontend)

### 2. Deploy Frontend (Vercel)

1. Import this repo into Vercel (Root Directory: `frontend`)
2. Add **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render Backend URL (e.g., `https://task-management-api.onrender.com`)
3. Deploy!

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (pagination, filtering, search) |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/toggle` | Toggle task status |

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & validation
│   │   ├── routes/         # API routes
│   │   └── utils/          # JWT & password helpers
│   └── prisma/             # Database schema
│
└── frontend/
    └── src/
        ├── app/            # Next.js pages
        ├── components/     # React components
        ├── lib/            # API client & auth context
        └── types/          # TypeScript interfaces
```

## 📝 License

MIT
