<<<<<<< HEAD
# syntecxhub-expense-tracker-app
A simple and intuitive expense tracker that helps users manage daily finances. Record income and expenses, categorize transactions, and monitor spending habits with clear summaries. Supports budget tracking and provides insights to help users control expenses and improve financial planning.
=======
<<<<<<< HEAD
# syntecxhub-expense-tracker-app
A simple and intuitive expense tracker that helps users manage daily finances. Record income and expenses, categorize transactions, and monitor spending habits with clear summaries. Supports budget tracking and provides insights to help users control expenses and improve financial planning.
=======
# Syntecxhub Expense Tracker

Full-stack expense tracker project with:
- `backend` (Express + MongoDB)
- `frontend` (React + Vite)

## Project Structure

- `backend/` API server, auth, and expense endpoints
- `frontend/` React client application

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create `backend/.env` and add your values:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8080
```

## Run the App

1. Start backend:

```bash
cd backend
npm run dev
```

2. Start frontend in a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will print the local URL in terminal (typically `http://localhost:5173`).

## Available Scripts

### Backend (`backend/package.json`)

- `npm run start` - run server with Node
- `npm run dev` - run server with Nodemon

### Frontend (`frontend/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
>>>>>>> 7d6797c (first commit)
>>>>>>> bd09c23 (syntecxhub expense tracker backend is complete perfectly run initial frontend stucture)
