# 🎵 Spotify Backend

A RESTful backend API for a Spotify-like music streaming platform, built with **Node.js**, **Express v5**, and **MongoDB**. It features a complete authentication system with email verification, JWT-based session management, role-based access control, cloud music uploads, and album management.

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Database | MongoDB (via Mongoose) |
| Authentication | JWT (Access + Refresh Tokens) |
| Password Hashing | bcryptjs |
| Email Service | Nodemailer (Gmail OAuth2) |
| File Storage | ImageKit |
| File Upload | Multer |
| Input Validation | express-validator |
| Logging | Morgan |
| Testing | Jest + Supertest |

---

## 📁 Project Structure

```
Spotify/
├── src/
│   ├── app.js                     # Express app setup & middleware
│   ├── controllers/
│   │   ├── auth.controller.js     # Auth logic (register, login, logout, etc.)
│   │   └── music.controller.js    # Music & album logic
│   ├── db/
│   │   └── db.js                  # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT auth guards (authUser, authArtist)
│   │   └── validation.middleware.js # Input validation rules
│   ├── models/
│   │   ├── user.model.js          # User schema
│   │   ├── session.model.js       # Refresh token session schema
│   │   ├── otp.model.js           # OTP schema
│   │   ├── music.model.js         # Music track schema
│   │   └── album.model.js         # Album schema
│   ├── routes/
│   │   ├── auth.routes.js         # Auth API routes
│   │   └── music.routes.js        # Music API routes
│   ├── services/
│   │   ├── nodemailer.service.js  # Email sending service
│   │   └── storage.service.js     # ImageKit file upload service
│   ├── test/
│   │   └── _app.test.js           # Integration tests (Jest + Supertest)
│   └── utils/
│       └── utils.js               # OTP generation & HTML email template
├── package.json
└── .env                           # Environment variables (not committed)
```

---

## ✨ Features

### 🔐 Authentication
- **Register** — Create a user account (`user` or `artist` role)
- **Email Verification** — OTP sent via email; users must verify before logging in
- **Login** — Authenticates with username/email + password; issues Access Token (15m) and Refresh Token (7d) via HTTP-only cookie
- **Logout** — Revokes current session's refresh token
- **Logout All Devices** — Revokes all active sessions for the user
- **Refresh Token** — Issues a new access token using a valid refresh token (token rotation)
- **Get Me** — Returns authenticated user's profile

### 🎵 Music
- **Upload Music** — Artists can upload music files (stored on ImageKit)
- **Get All Tracks** — Fetch paginated list of music tracks with artist info
- **Create Album** — Artists can create albums from existing track IDs
- **Get All Albums** — Fetch all albums with artist info
- **Get Album by ID** — Fetch a specific album with full details

### 🛡️ Security
- Passwords hashed with **bcryptjs** (10 salt rounds)
- OTP values stored as **SHA-256 hashes**
- Refresh tokens stored as **SHA-256 hashes** (never raw in DB)
- Refresh tokens rotated on every use
- Sessions tracked with IP address and User-Agent
- **Role-based access control** (`user` vs `artist`)
- HTTP-only, Secure, SameSite=Strict cookies for refresh tokens

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login with credentials |
| `POST` | `/logout` | Cookie | Logout current session |
| `GET` | `/logoutAll` | Cookie | Logout all sessions |
| `GET` | `/getMe` | Bearer Token | Get current user profile |
| `POST` | `/refreshToken` | Cookie | Rotate and get new access token |
| `POST` | `/verify-email` | ❌ | Verify email with OTP |

#### Register / Login Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Verify Email Request Body
```json
{
  "email": "john@example.com",
  "otp": "483920"
}
```

---

### Music Routes — `/api/music`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/upload` | 🎤 Artist | Upload a music file |
| `POST` | `/uploadAlbum` | 🎤 Artist | Create an album |
| `GET` | `/getAll` | 👤 User | Get all music tracks |
| `GET` | `/getAllAlbum` | 👤 User | Get all albums |
| `GET` | `/getAlbumById/:id` | 👤 User | Get a specific album |

#### Upload Music (multipart/form-data)
```
title: "My Song"
music: <audio file>
```

#### Create Album Request Body
```json
{
  "title": "My Album",
  "musicIds": ["<musicId1>", "<musicId2>"]
}
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/spotify

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_SECRET=your_jwt_secret

# Google OAuth2 (Nodemailer)
GOOGLE_USER=your_gmail@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# ImageKit
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Testing
JEST_POST_TOKEN=your_test_token_for_jest
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail with OAuth2 credentials set up
- ImageKit account

### Installation

```bash
# Clone the repository
git clone https://github.com/khanayaan7/Spotify-Backend.git
cd Spotify-Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your environment variables

# Start development server
npm run dev

# Start production server
npm start
```

---

## 🧪 Testing

The project uses **Jest** and **Supertest** for integration testing.

```bash
npm test
```

Tests cover:
- `POST /api/auth/register` — Conflict on duplicate user
- `POST /api/auth/login` — Successful login
- `POST /api/auth/logout` — Successful logout
- `GET /api/music/getAll` — Fetch music as authenticated user

---

## 🗺️ Roadmap

- [ ] Playlist creation and management
- [ ] Song search and filtering
- [ ] Like / favorite tracks
- [ ] User profile update
- [ ] Streaming endpoint with range request support
- [ ] Admin role and dashboard
- [ ] Rate limiting
- [ ] Swagger / OpenAPI documentation

---

## 📜 License

This project is licensed under the **ISC License**.

---

> Built as a learning project to explore Node.js backend development patterns including authentication, file uploads, email services, and role-based access control.
