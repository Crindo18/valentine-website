#!/bin/bash

echo "🌹 Valentine's Website Setup Script 🌹"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your MongoDB connection string!"
else
    echo ".env file already exists"
fi

echo "Installing backend dependencies..."
npm install

if [ ! -d "uploads" ]; then
    echo "Creating uploads directory..."
    mkdir uploads
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up frontend..."
cd frontend

echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env and add your MongoDB connection string"
echo "2. Start the backend: cd backend && npm start"
echo "3. In a new terminal, start the frontend: cd frontend && npm start"
echo "4. Visit http://localhost:3000 in your browser"
echo ""
echo "💕 For more details, see QUICKSTART.md"
echo ""
