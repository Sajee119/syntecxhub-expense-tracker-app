# Syntecxhub Expense Tracker

Full-stack expense management app built with React, Express, and MongoDB.

## Overview

This project includes:

- User authentication and account management
- Expense CRUD with categories
- Dashboard analytics (monthly trends, top categories, KPIs)
- Monthly budget and spending goals
- Dark/Light theme toggle with database persistence
- Public informational pages: Privacy, Terms, Support, Status

## Tech Stack

- Frontend: React 19, Vite, React Router, Recharts
- Backend: Express 5, Mongoose, JWT, Joi
- Database: MongoDB

## Project Structure

- `backend/` API server and MongoDB models/controllers
- `frontend/` React client UI

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB URI

## Installation

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

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
APP_NAME=SyntecxHub Expense Tracker
```

Optional frontend env (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:5000/api`.

## Run Locally

1. Start backend:

```bash
cd backend
npm run dev
```

2. Start frontend in another terminal:

```bash
cd frontend
npm run dev
```

Frontend dev server is typically available at `http://localhost:5173`.

## Scripts

Backend (`backend/package.json`):

- `npm run start` - start with Node
- `npm run dev` - start with Nodemon

Frontend (`frontend/package.json`):

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Base Routes

- `/api/users` - auth, profile, password, theme
- `/api/expenses` - expense CRUD
- `/api/budget` - monthly budget
- `/api/goals` - spending goals and category budgets

## License

MIT
