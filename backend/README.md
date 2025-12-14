# PhishGuard Backend API

Advanced Phishing Detection System with PostgreSQL Database

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up PostgreSQL database:**

Choose one of the following options:

#### Option A: Local PostgreSQL
```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb phishguard
```

#### Option B: Cloud PostgreSQL (Recommended)
Use a free managed PostgreSQL service:
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Free tier available
- [Railway](https://railway.app) - Free tier available
- [Render](https://render.com) - Free tier available

3. **Configure environment variables:**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the DATABASE_URL
# For local PostgreSQL:
DATABASE_URL=postgresql://username:password@localhost:5432/phishguard

# For Supabase:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# For Neon:
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require
```

4. **Set up the database:**
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# OR create a migration (recommended for production)
npx prisma migrate dev --name init
```

5. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   └── analysisController.js
│   ├── middleware/            # Express middleware
│   │   └── auth.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   └── analysisRoutes.js
│   ├── services/              # Business logic
│   │   ├── phishingDetection.js
│   │   └── pdfService.js
│   ├── utils/                 # Utility functions
│   │   ├── prisma.js
│   │   └── userHelpers.js
│   └── server.js              # Express app entry point
├── .env                       # Environment variables (not in git)
├── .env.example               # Example environment variables
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Analysis

#### Analyze Text
```http
POST /api/analysis/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "inputText": "Urgent! Your account will be suspended. Click here immediately..."
}
```

#### Get Analysis History
```http
GET /api/analysis/history?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Analysis
```http
GET /api/analysis/:id
Authorization: Bearer <token>
```

#### Download PDF Report
```http
GET /api/analysis/:id/download
Authorization: Bearer <token>
```

#### Delete Analysis
```http
DELETE /api/analysis/:id
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /api/analysis/stats
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User
- `id` (UUID) - Primary key
- `name` (String) - User's full name
- `email` (String) - Unique email address
- `password` (String) - Hashed password
- `isVerified` (Boolean) - Email verification status
- `otp` (String) - One-time password for verification
- `otpExpire` (DateTime) - OTP expiration time
- `resetPasswordToken` (String) - Password reset token
- `resetPasswordExpire` (DateTime) - Reset token expiration
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp
- `lastLogin` (DateTime) - Last login timestamp
- `analysisCount` (Integer) - Total analyses performed

### Analysis
- `id` (UUID) - Primary key
- `userId` (UUID) - Foreign key to User
- `inputText` (Text) - Text being analyzed
- `riskScore` (Float) - Risk score (0-100)
- `threatLevel` (Enum) - Safe, LowRisk, MediumRisk, HighRisk, Critical
- `recommendations` (String[]) - Security recommendations
- `createdAt` (DateTime) - Analysis timestamp
- `updatedAt` (DateTime) - Last update timestamp

### DetectedThreat
- `id` (UUID) - Primary key
- `analysisId` (UUID) - Foreign key to Analysis
- `type` (String) - Threat type
- `description` (String) - Threat description
- `severity` (Enum) - low, medium, high, critical
- `count` (Integer) - Number of occurrences
- `keywords` (String[]) - Detected keywords

### SuspiciousElement
- `id` (UUID) - Primary key
- `analysisId` (UUID) - Foreign key to Analysis
- `text` (String) - Suspicious text
- `startIndex` (Integer) - Start position
- `endIndex` (Integer) - End position
- `type` (String) - Element type
- `riskLevel` (String) - Risk level
- `explanation` (Text) - Why it's suspicious
- `recommendation` (Text) - What to do about it

### UrlAnalysis
- `id` (UUID) - Primary key
- `analysisId` (UUID) - Foreign key to Analysis
- `url` (String) - URL being analyzed
- `domain` (String) - Domain name
- `status` (Enum) - safe, questionable, suspicious, malicious
- `issues` (String[]) - Detected issues
- `riskScore` (Float) - URL risk score

### PhishingTactic
- `id` (UUID) - Primary key
- `analysisId` (UUID) - Foreign key to Analysis
- `name` (String) - Tactic name
- `description` (Text) - Tactic description
- `confidence` (Float) - Detection confidence

### AnalysisMetadata
- `id` (UUID) - Primary key
- `analysisId` (UUID) - Foreign key to Analysis (unique)
- `analysisTime` (Integer) - Analysis duration in ms
- `version` (String) - Detection engine version
- `detectionEngine` (String) - Engine name

## 🛠️ Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Initialize database with sample data
npm run init-db

# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create a new migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate
```

### Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/phishguard

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=PhishGuard <noreply@phishguard.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# OTP Configuration
OTP_EXPIRE_MINUTES=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **OTP Verification** - Email-based account verification
- **Rate Limiting** - Prevent abuse and DDoS attacks
- **Helmet** - Security headers
- **CORS** - Cross-Origin Resource Sharing protection
- **Input Validation** - Express-validator for request validation

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📊 Prisma Studio

Prisma Studio is a visual database browser. To open it:

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555` where you can:
- Browse all tables
- View and edit data
- Run queries
- Manage relationships

## 🚀 Deployment

### Deploying to Production

1. **Set up production database** (e.g., Supabase, Neon, Railway)

2. **Set environment variables** in your hosting platform

3. **Run migrations:**
```bash
npx prisma migrate deploy
```

4. **Start the server:**
```bash
npm start
```

### Recommended Hosting Platforms
- **Railway** - Easy deployment with PostgreSQL
- **Render** - Free tier with PostgreSQL
- **Heroku** - Classic PaaS platform
- **DigitalOcean** - App Platform
- **AWS** - Elastic Beanstalk or EC2

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🔄 Migration from MongoDB

If you're migrating from MongoDB, see [POSTGRESQL_MIGRATION.md](./POSTGRESQL_MIGRATION.md) for detailed instructions.

## 📝 License

MIT

## 👨‍💻 Author

PhishGuard Team

---

**Need help?** Check out the [POSTGRESQL_MIGRATION.md](./POSTGRESQL_MIGRATION.md) guide for detailed setup instructions and troubleshooting.
