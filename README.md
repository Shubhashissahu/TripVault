# 🧳 TripVault

A travel memory journal where users can record trips, manage travel details, and preserve their memories.

## Tech Stack
Node.js · Express · MongoDB Atlas · Mongoose · JWT · bcryptjs · React (Vite) · React Router · Axios

## Features

### Week 1 — Authentication
- User registration with bcrypt-hashed passwords
- JWT authentication with 7-day token expiration
- Protected `/api/auth/me` endpoint
- React frontend with Register, Login, and Dashboard pages
- Protected dashboard with automatic redirect for unauthenticated users

### Week 2 — Trip Management
- Create, view, update, and delete trips
- JWT-protected trip API routes
- User-specific trip listing
- Ownership verification for reading, updating, and deleting trips
- Input validation for required fields, dates, and ratings
- Mass-assignment protection for the `user` field
- Dashboard with trip cards and create/edit modal
- Delete confirmation and loading, error, and empty states

## Project Structure

```text
tripvault/
├── client/   # React (Vite) frontend
└── server/   # Express + MongoDB backend
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account and cluster

### 1. Clone the Repository

```bash
git clone https://github.com/Shubhashissahu/tripvault.git
cd tripvault
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend: `http://localhost:5000`

Configure `server/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

Configure `client/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

## Authentication API

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the authenticated user |

## Trip Management API

All routes require `Authorization: Bearer <token>`.

| Method | Route | Description |
|---|---|---|
| POST | `/api/trips` | Create a trip |
| GET | `/api/trips` | List the authenticated user's trips |
| GET | `/api/trips/:id` | Get a trip owned by the user |
| PUT | `/api/trips/:id` | Update a trip owned by the user |
| DELETE | `/api/trips/:id` | Delete a trip owned by the user |

## Trip Model

| Field | Type | Validation |
|---|---|---|
| `title` | String | Required, max 100 characters |
| `destination` | String | Required, max 100 characters |
| `startDate` | Date | Required |
| `endDate` | Date | Required, must be on or after `startDate` |
| `description` | String | Max 2,000 characters |
| `rating` | Number | 1–5 |
| `user` | ObjectId | References User; assigned server-side from the authenticated JWT |

## Features (Week 3)
- Photo uploads to Cloudinary (JPG/PNG/WEBP, max 5 MB, up to 20 per trip)
- Cover image on trip cards; photo grid with lightbox on the trip detail page
- Public profiles at `/profile/:username`, viewable without login
- Public API returns an allow-listed set of safe fields only (never email or password)
- Edit bio and username from the dashboard
- Frontend styled with Tailwind CSS

## New API Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/trips/:id/upload | Yes (owner) | Upload one image (`image` form field) |
| GET | /api/users/:username/profile | **No** | Public profile: name, username, bio, trip summaries |
| PUT | /api/users/profile | Yes | Update own bio / username |

## Environment Variables (server/.env)
`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Design Notes
- Ownership is verified **before** the file is sent to Cloudinary, so unauthorised requests cannot consume upload quota.
- Image URLs can only be written through the upload route, never via `PUT /api/trips/:id`.
- Creating a trip and uploading its photos are two requests (a trip needs an ID before photos can attach). Partial failures are surfaced in the UI.

## Known Limitations
- Deleting a trip does not yet remove its images from Cloudinary.
- JWT is stored in localStorage per the project spec.


