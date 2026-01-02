# PhishGuard

<div align="center">

**Advanced AI-Powered Phishing Detection & Analysis Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192.svg)](https://www.postgresql.org/)

</div>

---

## Overview

PhishGuard is a full-stack web application designed to detect and analyze phishing threats in emails and URLs. Using Natural Language Processing (NLP) and advanced pattern recognition, it provides real-time security analysis with actionable recommendations.

### Key Features

- **AI-Powered Detection**: NLP-based analysis to identify phishing patterns, urgency tactics, and suspicious language
- **URL Analysis**: Deep inspection of links for malicious structures and known threats
- **Secure Authentication**: JWT-based auth with email OTP verification
- **Real-Time Dashboard**: Risk scoring, threat breakdown, and security recommendations
- **Modern UI**: Responsive design built with React, TailwindCSS, and Framer Motion

---

## Tech Stack

**Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, Natural (NLP), JWT  
**Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons  
**Security**: Helmet, bcrypt, Express Rate Limit, Input validation

---

## Project Structure

```
PhishGuard/
├── backend/                # Express.js API
│   ├── prisma/            # Database schema
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth & validation
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic (NLP, detection)
│   │   └── server.js      # Entry point
│   └── package.json
├── frontend/              # React Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Landing, Auth, Dashboard
│   │   ├── context/       # AuthContext
│   │   └── utils/         # API client
│   └── package.json
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js (v20+)
- PostgreSQL (or Supabase)
- npm

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/seetharamdamarla/phishguard.git
   cd phishguard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment**  
   Create `backend/.env`:
   ```env
   PORT=3001
   DATABASE_URL="postgresql://username:password@localhost:5432/phishguard"
   JWT_SECRET="your-secret-key"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   cd ..
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3001](http://localhost:3001)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run install:all` | Install all dependencies |
| `npm run backend` | Start backend only |
| `npm run frontend` | Start frontend only |

---

## API Endpoints

**Base URL**: `http://localhost:3001/api`

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - Verify OTP

### Analysis
- `POST /analysis/analyze` - Analyze email/URL (requires auth)
- `GET /analysis/history` - Get user's analysis history (requires auth)

---

## License

This project is licensed under the MIT License.

---

<div align="center">

Built with ❤️ by [Seetharam Damarla](https://github.com/seetharamdamarla)

**PhishGuard** © 2026

</div>
