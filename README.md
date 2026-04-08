# SnipURL – MERN Stack URL Shortener

A full-stack URL shortener built with **MongoDB, Express, React (Vite), and Node.js**.

---

## ✨ Features

- 🔗 Shorten any `http://` or `https://` URL in one click
- 🔁 Duplicate detection – returns existing short code for repeated URLs
- 📊 Click tracking on every redirect
- 📋 Copy-to-clipboard with visual feedback
- 🕐 Recent links history (last 5, stored in localStorage)
- ⚡ Loading spinner during API calls
- 🚀 Redirect page with 404 error handling
- 📱 Fully responsive, mobile-first layout

---

## 🛠 Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios   |
| Styling   | Tailwind CSS v3, Inter (Google Fonts)    |
| Backend   | Node.js, Express.js                      |
| Database  | MongoDB, Mongoose                        |
| Short ID  | nanoid (7 chars, alphanumeric)           |

---

## 📁 Project Structure

```
URLshortner/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/
│   │   └── urlController.js  # Business logic (shorten + redirect)
│   ├── models/Url.js         # Mongoose schema
│   ├── routes/urlRoutes.js   # Express routes
│   ├── .env                  # Environment variables
│   ├── server.js             # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UrlForm.jsx         # URL input form
│   │   │   ├── ShortUrlResult.jsx  # Short URL display + copy
│   │   │   └── RecentLinks.jsx     # localStorage recent history
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   └── RedirectHandler.jsx # Handles /:code redirect
│   │   ├── services/api.js   # Axios instance + API functions
│   │   ├── App.jsx           # React Router setup
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind directives + custom styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongod`) on port `27017`

---

### 1. Clone / Open the project

```bash
cd URLshortner
```

### 2. Backend Setup

```bash
cd backend
npm install
```

> The `.env` file is already included with defaults:
> ```
> PORT=5000
> MONGO_URI=mongodb://localhost:27017/urlshortener
> BASE_URL=http://localhost:5000
> ```

Start the backend:

```bash
# Development (with auto-restart via nodemon)
npm run dev

# Production
npm start
```

The server will start at **http://localhost:5000**.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

> ⚠️ **Tailwind CSS:** Install Tailwind manually if not already done:
> ```bash
> npx tailwindcss init -p
> ```
> This generates `tailwind.config.js` and `postcss.config.js` (already pre-configured in this project).

Start the frontend:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 🔌 API Reference

### `POST /api/url/shorten`

Shorten a long URL.

**Request body:**
```json
{ "longUrl": "https://example.com/very/long/path" }
```

**Response (201 Created):**
```json
{
  "shortUrl": "http://localhost:5000/api/url/aB3dE7f",
  "shortCode": "aB3dE7f",
  "longUrl": "https://example.com/very/long/path",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /api/url/:code`

Redirects to the original URL (302) and increments the click counter.

**Success:** `302 Redirect → longUrl`  
**Not found:** `404 { "error": "Short URL not found." }`

---

## 🌍 Deployment Notes

| Service   | Platform          |
|-----------|-------------------|
| Frontend  | Vercel / Netlify  |
| Backend   | Railway / Render  |
| Database  | MongoDB Atlas     |

Update `.env` for production:
```
BASE_URL=https://your-backend-domain.com
```

Update CORS in `server.js`:
```js
origin: "https://your-frontend-domain.com"
```

---

## 📝 License

MIT – free to use and modify.
