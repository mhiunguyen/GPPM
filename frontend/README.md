# DermaSafe AI — Frontend

React + Vite + TypeScript UI for the dermatology risk screening app.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API proxy and environment

During development, the app calls the Backend API through a Vite proxy using relative paths like /api/v1/analyze.

- Proxy target is configured in vite.config.ts with VITE_BACKEND_URL.
- Default target: http://localhost:8000
- In Docker, the compose file sets VITE_BACKEND_URL=http://backend-api:8000

Optional .env for local customizations
```
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPPORT_PHONE=19001234
```

## Key endpoints used by the UI

- POST /api/v1/analyze — analyze uploaded image and form data
- POST /api/v1/validate-symptoms — validate entered symptoms
- POST /api/v1/chat — chatbot messages (optional service)
- GET /api/v1/capture/tips — capture guidance

## Camera capture notes

- The in-app camera supports switching between rear and front cameras on mobile devices.
- On mobile devices, the camera opens with the front camera by default for easier framing; use the toggle to switch.
- Use the “Cam trước/Cam sau” button on the capture screen’s top bar to toggle.
- The preview is mirrored when using the front camera for a natural selfie view. The saved photo is not mirrored.
- On iOS Safari, if the browser ignores facingMode, the app falls back to selecting the correct camera via enumerateDevices() after permission is granted.
