# 🧳 TripVault

A travel memory journal. Week 1 delivers the project foundation and a full authentication system.

## Tech Stack
Node.js · Express · MongoDB Atlas · Mongoose · JWT · bcryptjs · React (Vite) · React Router · Axios

## Features
- User registration with bcrypt-hashed passwords
- JWT login with 7-day tokens
- Protected `/api/auth/me` route
- React frontend with Register, Login, Dashboard
- Protected dashboard route with redirect

## Project Structure
```
tripvault/
├── client/   # React (Vite) frontend
└── server/   # Express + MongoDB backend
```

## Setup

### Prerequisites
Node.js 18+ and a free MongoDB Atlas cluster.

### 1. Clone
```bash
git clone https://github.com/Shubhashissahu/tripvault.git
cd tripvault
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env     # then fill in your values
npm run dev              # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev              # runs on http://localhost:5173
```

## API Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Returns JWT + user |
| GET | /api/auth/me | Bearer token | Current user |

## Environment Variables
**server/.env:** `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
**client/.env:** `VITE_API_URL`

