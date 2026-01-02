# 🛡️ PhishGuard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748.svg)](https://www.prisma.io/)

**PhishGuard** is a state-of-the-art, full-stack web application engineered to detect, analyze, and mitigate phishing threats. By leveraging advanced Natural Language Processing (NLP) and robust backend security protocols, PhishGuard provides users with a powerful toolset for email and URL analysis, comprehensive reporting, and real-time threat detection.

---

## 🚀 Key Features

*   **🔍 Advanced Phishing Detection**:
    *   **NLP & Sentiment Analysis**: Uses `natural` and `compromise` libraries to detect suspicious language patterns and urgency in emails.
    *   **URL Scanning**: Analyzes links for malicious structures and known threat patterns.
*   **🔒 Secure Authentication**:
    *   **JWT-Based Auth**: Secure, stateless user sessions using JSON Web Tokens.
    *   **OTP Verification**: Email-based One-Time Password verification for robust account security.
    *   **Role-Based Access Control (RBAC)**: Distinct levels of access for Users and Admins.
*   **📊 Interactive Dashboard**:
    *   **Real-Time Analytics**: Visualize analysis history and detection rates.
    *   **Dynamic Charts**: Powered by `recharts` and `d3` for intuitive data representation.
*   **📄 Comprehensive Reporting**:
    *   **PDF Generation**: Instantly generate detailed analysis reports using `pdfkit`.
*   **✨ Modern & Responsive UI**:
    *   **Premium Design**: Built with React, TailwindCSS, and Glassmorphism aesthetics.
    *   **Smooth Animations**: Enhanced user experience with `framer-motion` transitions.

---

## 🛠️ Tech Stack

### **Backend**
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Prisma ORM)
*   **Security**: Helmet, Express-Rate-Limit, BCryptJS, Express-Validator
*   **Analysis**: Natural (NLP), Compromise
*   **Utilities**: PDFKit (Reports), Nodemailer (Email), Dotenv

### **Frontend**
*   **Framework**: React (powered by Vite)
*   **Styling**: TailwindCSS, Tailwind Merge, CLSX
*   **State Management**: Redux Toolkit
*   **Routing**: React Router DOM 6
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Forms**: React Hook Form
*   **Visualization**: Recharts, D3

---

## 📂 Project Structure

```bash
PhishGuard/
├── backend/                # Express.js Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (Analysis, PDF, Email)
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   ├── prisma/             # Prisma schema & migrations
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── redux/          # State management slices
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Static assets
│   ├── public/             # Publicly accessible files
│   └── package.json
├── package.json            # Root configuration
└── README.md               # Project documentation
```

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [npm](https://www.npmjs.com/) (Node Package Manager)
*   [MongoDB](https://www.mongodb.com/) (Local instance or Atlas connection string)
*   [Git](https://git-scm.com/)

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/PhishGuard.git
    cd PhishGuard
    ```

2.  **Install All Dependencies**
    We have a convenience script to install dependencies for root, backend, and frontend at once.
    ```bash
    npm run install:all
    ```

3.  **Backend Configuration**
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=5000
    DATABASE_URL="mongodb://localhost:27017/phishguard" # Or your MongoDB Atlas URI
    JWT_SECRET="your_super_secret_jwt_key"
    EMAIL_USER="your_email@gmail.com" # For sending OTPs
    EMAIL_PASS="your_email_app_password"
    FRONTEND_URL="http://localhost:5173"
    ```

4.  **Database Initialization**
    Push the Prisma schema to your MongoDB database:
    ```bash
    cd backend
    npx prisma generate
    npx prisma db push
    cd ..
    ```

5.  **Run the Application**
    Start both the backend and frontend concurrently with a single command:
    ```bash
    npm run dev
    ```

    *   **Frontend**: http://localhost:5173
    *   **Backend**: http://localhost:5000

---

## 📄 Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts both backend and frontend in development mode.
*   `npm run install:all`: Installs dependencies for all workspaces.
*   `npm run backend`: Starts only the backend server.
*   `npm run frontend`: Starts only the frontend server.
*   `npm run build`: Builds the frontend for production.

---

## 📸 Screenshots

*(Add your screenshots here)*

| Dashboard | Analysis Report |
|:---------:|:---------------:|
| ![Dashboard Placeholder](https://via.placeholder.com/600x400?text=Dashboard+UI) | ![Report Placeholder](https://via.placeholder.com/600x400?text=PDF+Report) |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Seetharam Damarla
</p>
