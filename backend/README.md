# Backend - Syntecxhub Expense Tracker

Express + MongoDB API for authentication, expenses, budgets, goals, and theme persistence.

## Stack

- Express 5
- Mongoose
- JWT authentication
- Joi request validation

## Setup

```bash
npm install
```

Create `.env` in this folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
APP_NAME=SyntecxHub Expense Tracker
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Routes

Base URL: `http://localhost:5000/api`

### Users (`/users`)

- `POST /signup`
- `POST /login`
- `GET /me` (auth)
- `PUT /me` (auth)
- `POST /change-password` (auth)
- `PUT /theme` (auth)

### Expenses (`/expenses`)

- `GET /` (auth)
- `POST /` (auth)
- `PUT /:id` (auth)
- `DELETE /:id` (auth)

### Budget (`/budget`)

- `GET /` (auth)
- `PUT /` (auth)

### Goals (`/goals`)

- `GET /` (auth)
- `POST /` (auth)
- `DELETE /` (auth)
- `PUT /category-budget` (auth)

## Notes

- Server includes health/retry monitoring for MongoDB and listener availability.
- Theme preference (`light`/`dark`) is stored in user documents.
