# ResQNet

Full-stack crisis response platform.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file (copied from `.env.example` if available, or use the one created).
   - Ensure `MONGO_URI` is valid (local mongodb or atlas).
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env` file (`cp .env.example .env`) and add `VITE_MAPBOX_TOKEN`.
4. `npm run dev`

## Features
- Public Incident Reporting (Location auto-detected)
- Live Map with status markers
- Volunteer/Authority Dashboard
- Authentication (JWT)
