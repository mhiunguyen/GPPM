# Quick start script cho chatbot service (Windows PowerShell)

Write-Host "🤖 Starting DermaSafe-AI Chatbot Service..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 IMPORTANT: Edit .env and add your GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "   Get free API key from: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter after you've added your API key"
}

# Check if virtual environment exists
if (-not (Test-Path venv)) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Cyan
pip install -q -r requirements.txt

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting chatbot service on http://localhost:8002..." -ForegroundColor Green
Write-Host "   API Docs: http://localhost:8002/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Run the service
uvicorn chatbot_app.main:app --host 0.0.0.0 --port 8002 --reload
