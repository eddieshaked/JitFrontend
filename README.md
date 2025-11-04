# JitFrontend

A full-stack application with a React frontend (powered by Vite) and a Node.js backend.

## Project Structure

```
JitFrontend/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React source files
│   ├── package.json  # Frontend dependencies
│   └── vite.config.js
└── backend/          # Node.js + Express backend
    ├── server.js     # Backend server
    └── package.json  # Backend dependencies
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## Running the Application

### Development Mode

You'll need to run both the frontend and backend servers simultaneously.

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### Production Build

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

#### Backend
```bash
cd backend
npm start
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api` - API information endpoint

## Technologies Used

### Frontend
- React 18
- Vite 5
- Modern CSS with gradients and animations

### Backend
- Node.js
- Express.js
- CORS enabled for cross-origin requests

## Development

The frontend is configured to proxy API requests to the backend server. All requests to `/api/*` will be forwarded to `http://localhost:5000`.
