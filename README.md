# PhishGuard

PhishGuard is an advanced, full-stack web application designed to detect and analyze phishing attempts. It combines a robust Express.js backend with a modern, responsive React frontend to provide users with tools for email analysis, URL scanning, and comprehensive reporting.

## 🚀 Features

- **Advanced Phishing Detection**:
  - Utilizes Natural Language Processing (NLP) and sentiment analysis to identify suspicious content.
  - Analyzes URLs for malicious patterns and known threats.
- **User Authentication**:
  - Secure Signup and Login with JWT-based authentication.
  - Email verification via OTP (One-Time Password).
  - Role-based access control (e.g., User, Admin).
- **Interactive Dashboard**:
  - Real-time statistics and analysis history.
  - Visual data representation using Recharts.
- **Reporting**:
  - Generate detailed PDF reports of analysis results.
- **Modern UI/UX**:
  - Built with React and TailwindCSS.
  - Enhanced with Framer Motion animations and glassmorphism design effects.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt
- **Analysis Tools**: Natural (NLP), Compromise, Axios
- **Utilities**: PDFKit (Reports), Nodemailer (Emails)

### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS, Lucide React (Icons)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Data Visualization**: Recharts, D3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

## ⚙️ Installation

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd PhishGuard
   ```

2. **Install Dependencies**
   Install dependencies for both the root, backend, and frontend:
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL="mongodb://localhost:27017/phishguard" # Or your MongoDB Atlas URI
   JWT_SECRET="your_highly_secure_secret_key"
   EMAIL_USER="your_email@example.com"
   EMAIL_PASS="your_email_password"
   FRONTEND_URL="http://localhost:5173"
   ```

   *Note: Frontend environment variables (if any) should be placed in `frontend/.env`.*

4. **Database Initialization**
   Initialize the database schema using Prisma:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   cd ..
   ```

## 🏃‍♂️ Usage

To run the application in development mode (starts both Backend and Frontend concurrently):

```bash
npm run dev
```

- **Backend**: Runs on `http://localhost:5000`
- **Frontend**: Runs on `http://localhost:5173` (or the port assigned by Vite)

## 📄 Scripts

- `npm run dev`: Starts both backend and frontend in development mode.
- `npm run backend`: Starts only the backend server.
- `npm run frontend`: Starts only the frontend development server.
- `npm run install:all`: Installs all dependencies.
- `npm run build`: Builds the frontend for production.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📝 License

This project is licensed under the MIT License.
