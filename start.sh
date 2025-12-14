#!/bin/bash

echo "🛡️  PhishGuard - Starting Application..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   OR"
    echo "   mongod"
    echo ""
fi

# Start backend
echo "🚀 Starting Backend Server (Port 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server (Port 3000)..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ PhishGuard is starting!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
wait
