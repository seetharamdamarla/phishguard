#!/bin/bash

echo "🛡️  PhishGuard - Setup Verification"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Please install Node.js from https://nodejs.org"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} Found: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo -e "${GREEN}✓${NC} Found"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo -e "  ${GREEN}✓${NC} MongoDB is running"
    else
        echo -e "  ${YELLOW}⚠${NC} MongoDB is not running"
        echo "    Start with: brew services start mongodb-community"
        echo "    Or: mongod"
    fi
else
    echo -e "${YELLOW}⚠${NC} Not found (Optional if using MongoDB Atlas)"
fi

echo ""
echo "Checking Project Files..."
echo "-------------------------"

# Check backend dependencies
echo -n "Backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${RED}✗${NC} Not installed"
    echo "  Run: cd backend && npm install"
fi

# Check frontend dependencies
echo -n "Frontend dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${RED}✗${NC} Not installed"
    echo "  Run: npm install"
fi

# Check backend .env
echo -n "Backend .env file... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Found"
    
    # Check if EMAIL_USER is configured
    if grep -q "your-email@gmail.com" backend/.env; then
        echo -e "  ${YELLOW}⚠${NC} EMAIL_USER needs configuration"
    fi
    
    # Check if EMAIL_PASSWORD is configured
    if grep -q "your-gmail-app-password" backend/.env; then
        echo -e "  ${YELLOW}⚠${NC} EMAIL_PASSWORD needs configuration"
    fi
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Run: cp backend/.env.example backend/.env"
fi

# Check frontend .env
echo -n "Frontend .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Found"
else
    echo -e "${YELLOW}⚠${NC} Not found (will use defaults)"
fi

echo ""
echo "Port Availability..."
echo "-------------------"

# Check port 3000
echo -n "Port 3000 (Frontend)... "
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} In use"
    echo "  Kill with: lsof -ti:3000 | xargs kill -9"
else
    echo -e "${GREEN}✓${NC} Available"
fi

# Check port 3001
echo -n "Port 3001 (Backend)... "
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} In use"
    echo "  Kill with: lsof -ti:3001 | xargs kill -9"
else
    echo -e "${GREEN}✓${NC} Available"
fi

echo ""
echo "Configuration Summary..."
echo "-----------------------"

# Read backend .env if exists
if [ -f "backend/.env" ]; then
    MONGODB_URI=$(grep "MONGODB_URI=" backend/.env | cut -d '=' -f2)
    EMAIL_USER=$(grep "EMAIL_USER=" backend/.env | cut -d '=' -f2)
    
    echo "MongoDB: $MONGODB_URI"
    echo "Email: $EMAIL_USER"
fi

echo ""
echo "===================================="
echo ""

# Final recommendation
if [ -d "backend/node_modules" ] && [ -d "node_modules" ] && [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ Setup looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure backend/.env with your email credentials"
    echo "2. Ensure MongoDB is running"
    echo "3. Run: ./start.sh"
    echo ""
else
    echo -e "${YELLOW}⚠ Setup incomplete${NC}"
    echo ""
    echo "Please complete the following:"
    [ ! -d "backend/node_modules" ] && echo "  - Install backend dependencies: cd backend && npm install"
    [ ! -d "node_modules" ] && echo "  - Install frontend dependencies: npm install"
    [ ! -f "backend/.env" ] && echo "  - Create backend/.env: cp backend/.env.example backend/.env"
    echo ""
fi

echo "For detailed setup instructions, see QUICKSTART.md"
echo ""
