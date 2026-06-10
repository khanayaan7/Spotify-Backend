# 🎵 Spotify Backend

A RESTful backend API for a Spotify-like music streaming platform. Built with **Node.js**, **Express**, and **MongoDB**, it supports user authentication, role-based access control, music uploads via **ImageKit**, and album management.

---

## 🚀 Features

- **User Authentication** — Register, login, and logout with JWT-based sessions via HTTP-only cookies
- **Role-Based Access Control** — Two roles: `user` (listeners) and `artist` (uploaders)
- **Music Uploads** — Artists can upload audio files, stored on ImageKit CDN
- **Album Management** — Artists can create albums by grouping existing tracks
- **Protected Routes** — Middleware guards routes based on role
- **Input Validation** — Request validation via `express-validator`
- **Automated Tests** — Integration tests with Jest and Supertest

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js                             |
| Framework    | Express.js v5                       |
| Database     | MongoDB + Mongoose                  |
| Auth         | JSON Web Tokens (JWT) + bcryptjs    |
| File Storage | ImageKit                            |
| File Upload  | Multer (memory storage)             |
| Validation   | express-validator                   |
| Testing      | Jest + Supertest                    |
| Dev Server   | Nodemon                             |

---

## 📁 Project Structure

```
Spotify/
├── server.js                        # Entry point — starts server & DB
├── src/
│   ├── app.js                       # Express app setup & routes
│   ├── db/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, login, logout
│   │   └── music.controller.js      # Music & album CRUD
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification, role guards
│   │   └── validation.middleware.js # Request body validation
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   ├── music.model.js           # Music schema
│   │   └── album.model.js           # Album schema
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth/*
│   │   └── music.routes.js          # /api/music/*
│   ├── services/
│   │   └── storage.service.js       # ImageKit upload logic
│   └── test/
│       └── _app.test.js             # Integration tests
├── .env                             # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- An [ImageKit](https://imagekit.io) account

### 1. Clone the repository

```bash
git clone https://github.com/khanayaan7/Spotify-Backend.git
cd Spotify-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
JEST_POST_TOKEN=a_valid_jwt_token_for_testing
```

### 4. Run the development server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint    | Auth Required | Description                          |
|--------|-------------|---------------|--------------------------------------|
| POST   | `/register` | ❌            | Register a new user or artist        |
| POST   | `/login`    | ❌            | Login and receive a session cookie   |
| POST   | `/logout`   | ❌            | Clear the session cookie             |

#### Register request body
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```
> `role` can be `"user"` (default) or `"artist"`

---

### Music Routes — `/api/music`

| Method | Endpoint             | Auth Required | Role     | Description                        |
|--------|----------------------|---------------|----------|------------------------------------|
| POST   | `/upload`            | ✅            | `artist` | Upload a music track (multipart)   |
| POST   | `/uploadAlbum`       | ✅            | `artist` | Create an album from track IDs     |
| GET    | `/getAll`            | ✅            | Any      | Fetch latest 10 tracks             |
| GET    | `/getAllAlbum`        | ✅            | Any      | Fetch all albums                   |
| GET    | `/getAlbumById/:id`  | ✅            | Any      | Fetch a specific album by ID       |

#### Upload music (multipart/form-data)
```
POST /api/music/upload
Content-Type: multipart/form-data

Fields:
  - title  (string)
  - music  (audio file)
```

#### Create album request body
```json
{
  "title": "My Album",
  "musicIds": ["track_id_1", "track_id_2"]
}
```

> All protected routes require a valid `token` cookie set during login.

---

## 🧪 Running Tests

```bash
npx jest
```

The test suite covers:
- `POST /api/auth/register` — returns 409 if user already exists
- `POST /api/auth/login` — returns 200 with valid credentials
- `POST /api/auth/logout` — returns 200
- `GET /api/music/getAll` — returns 200 for authenticated users

---

## 🔐 Security Notes

- Passwords are hashed with **bcryptjs** before storage
- JWTs are stored in **HTTP-only cookies** (not accessible via JavaScript)
- The `.env` file is **gitignored** — never commit secrets
- Role checks are enforced at the middleware level on every protected route

---

## 📄 License

This project is licensed under the **ISC License**.
