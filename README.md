# PhishGuard - Advanced Phishing Detection System

A full-stack web application for detecting phishing emails using advanced NLP and machine learning techniques.

## 🏗️ Project Structure

```
PhishGuard/
├── backend/          # Express.js API server
│   ├── src/         # Source code
│   ├── prisma/      # Database schema
│   └── package.json
├── frontend/         # React + Vite frontend
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── package.json
└── package.json      # Root package.json for running both
```

## 🚀 Quick Start

### **Run Both Frontend & Backend Together:**
```bash
npm run dev
```

### **Run Individually:**

#### Frontend Only:
```bash
cd frontend
npm run dev
```
Opens at: http://localhost:3000

#### Backend Only:
```bash
cd backend
npm run dev
```
Runs at: http://localhost:3001

## 📦 Installation

### **Install All Dependencies:**
```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Backend
- Frontend

### **Or Install Manually:**
```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 🗄️ Database Setup

The backend uses **PostgreSQL** with **Supabase**.

### **1. Set up your `.env` file in backend:**
```bash
cd backend
cp .env.example .env
```

### **2. Update DATABASE_URL in `backend/.env`:**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### **3. Initialize the database:**
```bash
cd backend
npx prisma generate
npx prisma db push
```

## 🛠️ Available Scripts

### **Root Level (from project root):**
| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend & backend |
| `npm run backend` | Run backend only |
| `npm run frontend` | Run frontend only |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build frontend for production |

### **Backend (from backend/ directory):**
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx prisma db push` | Push schema to database |

### **Frontend (from frontend/ directory):**
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |

## 🔧 Tech Stack

### **Frontend:**
- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router
- Redux Toolkit
- Axios

### **Backend:**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- Nodemailer
- Natural (NLP)
- PDFKit

## 📚 Documentation

- **Backend Documentation**: See `backend/README.md`
- **Database Migration Guide**: See `backend/POSTGRESQL_MIGRATION.md`
- **Supabase Setup**: See `backend/MIGRATION_SUMMARY.md`

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555 (run `npx prisma studio` in backend/)

## 🔒 Environment Variables

### **Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### **Frontend:**
- Build: `cd frontend && npm run build`
- Deploy the `frontend/dist` folder to Vercel, Netlify, etc.

### **Backend:**
- Deploy to Railway, Render, Heroku, etc.
- Make sure to set environment variables
- Run `npx prisma migrate deploy` after deployment

## 📝 License

MIT

## 👨‍💻 Author

PhishGuard Team

---

**Need help?** Check the documentation in the `backend/` folder or open an issue.
