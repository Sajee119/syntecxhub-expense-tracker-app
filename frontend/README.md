# Frontend - Syntecxhub Expense Tracker

React + Vite frontend for expense tracking, analytics dashboard, account settings, and theme toggle.

## Features

- Auth flow (login/signup)
- Dashboard with charts and financial summaries
- Expense tracking and history
- Budget and spending goals UI
- Account settings (currency, password)
- Dark/Light mode toggle persisted via backend
- Public pages: About, Privacy, Terms, Support, Status

## Setup

```bash
npm install
```

Optional `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

If omitted, the app uses `http://localhost:5000/api` by default.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview build output
- `npm run lint` - run ESLint

## Run

```bash
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Backend Requirement

Backend must be running and reachable at the configured API URL.

## Routing Notes

Main routes include:

- `/` Home
- `/login`, `/signup`
- `/dashboard`, `/expenses`, `/account` (protected)
- `/about`, `/privacy`, `/terms`, `/support`, `/status`
