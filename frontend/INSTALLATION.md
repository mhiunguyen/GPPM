# Installation Guide — DermaSafe AI Frontend

## Requirements
- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

This will install all dependencies including:
- react & react-dom
- lucide-react (for icons)
- i18next & react-i18next (for translations)
- tailwindcss (for styling)
- vite (for build tool)

### 3. Run development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for production
```bash
npm run build
```

## New Component: DermaSafeAI

The new `DermaSafeAI` component has been integrated into the frontend with the following features:

### Features:
- ✅ Image upload with preview
- ✅ 9 common symptom selectors (Itching, Pain, Bleeding, etc.)
- ✅ Duration selection (< 1 week, 1 week - 1 month, etc.)
- ✅ Risk level analysis (HIGH/MEDIUM/LOW)
- ✅ Primary and alternative diagnoses
- ✅ Recommendations based on risk level
- ✅ Bilingual support (Vietnamese 🇻🇳 / English 🇬🇧)
- ✅ Mock data fallback if API is unavailable
- ✅ Responsive design with Tailwind CSS

### API Integration:
The app calls the Backend API via a dev proxy at `/api/v1/*` (see `vite.config.ts`). Make sure the backend is running on `http://localhost:8000` or set the environment variable `VITE_BACKEND_URL`.

Primary analyze endpoint: `/api/v1/analyze`

Request payload includes:
- Image file
- Selected symptoms
- Duration
- Language preference

### Component Location:
```
frontend/src/components/DermaSafeAI.tsx
```

### Updated Files:
1. `frontend/src/App.tsx` - Updated to use DermaSafeAI component
2. `frontend/src/components/DermaSafeAI.tsx` - New component
3. `frontend/package.json` - Added lucide-react dependency

## Environment (optional)

Create a `.env` file to override defaults:
```
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPPORT_PHONE=19001234
```

## Troubleshooting

### If port 5173 is already in use:
The dev server will automatically try the next available port.

## Testing the Integration

1. Make sure the backend API is running at `http://localhost:8000`
2. Start the frontend dev server: `npm run dev`
3. Open browser to `http://localhost:5173`
4. Accept the disclaimer
5. Upload an image of a skin condition
6. Select symptoms and duration
7. Click "Phân tích nguy cơ" / "Analyze Risk"

The component will:
- First try to call the backend API
- If API fails, display an error message
- Then fall back to mock data for demonstration purposes
