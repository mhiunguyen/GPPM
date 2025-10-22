#!/bin/bash
# Quick start script cho chatbot service

echo "🤖 Starting DermaSafe-AI Chatbot Service..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "📝 IMPORTANT: Edit .env and add your GEMINI_API_KEY"
    echo "   Get free API key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press Enter after you've added your API key..."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting chatbot service on http://localhost:8002..."
echo "   API Docs: http://localhost:8002/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run the service
uvicorn chatbot_app.main:app --host 0.0.0.0 --port 8002 --reload
