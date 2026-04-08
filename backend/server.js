// server.js
// Entry point for the Express backend server

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Allow local dev frontend + deployed frontend URL from env
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.BASE_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow no-origin requests (health checks, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// HTTP request logger (dev format shows method, URL, status, response time)
app.use(morgan("dev"));

// ─── Routes ──────────────────────────────────────────────────────────────────

// Mount URL routes at /api/url
app.use("/api/url", urlRoutes);

// Health-check endpoint
app.get("/", (req, res) => {
  res.json({ message: "URL Shortener API is running 🚀" });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// Catches any route not matched above
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches errors passed via next(error) from controllers
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
