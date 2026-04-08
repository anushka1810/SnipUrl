// routes/urlRoutes.js
// Express router for URL-related endpoints

import express from "express";
import { shortenUrl, redirectUrl } from "../controllers/urlController.js";

const router = express.Router();

// POST /api/url/shorten  → Create a new short URL
router.post("/shorten", shortenUrl);

// GET /api/url/:code     → Redirect to original URL
router.get("/:code", redirectUrl);

export default router;
