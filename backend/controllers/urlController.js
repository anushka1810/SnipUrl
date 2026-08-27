// controllers/urlController.js
// Business logic for URL shortening and redirecting

import { customAlphabet } from "nanoid";
import Url from "../models/Url.js";

// Custom nanoid with alphanumeric characters only (7 chars)
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  7
);

// -------------------------------------------------------------------
// @desc    Shorten a long URL
// @route   POST /api/url/shorten
// @access  Public
// -------------------------------------------------------------------
export const shortenUrl = async (req, res, next) => {
  let { longUrl } = req.body;

  // 1. Validate that the URL is provided and trim whitespace
  if (!longUrl || typeof longUrl !== "string") {
    return res.status(400).json({ error: "Please provide a URL to shorten." });
  }
  longUrl = longUrl.trim();

  // 2. Validate URL length
  if (longUrl.length > 2048) {
    return res.status(400).json({ error: "URL exceeds maximum allowed length of 2048 characters." });
  }

  // 3. Validate URL format and prevent malicious protocols
  try {
    const parsedUrl = new URL(longUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return res.status(400).json({ error: "Invalid URL protocol. Only http:// and https:// are allowed." });
    }
  } catch (_) {
    return res.status(400).json({ error: "Invalid URL format. Please include http:// or https://" });
  }

  // 4. Prevent recursive self-shortening loops
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  if (longUrl.startsWith(baseUrl) || longUrl.startsWith(frontendUrl)) {
    return res.status(400).json({ error: "Cannot shorten URLs originating from this service." });
  }

  try {
    // 5. Check if this long URL has already been shortened → return existing
    const existing = await Url.findOne({ longUrl });
    if (existing) {
      const shortUrl = `${baseUrl}/api/url/${existing.shortCode}`;
      return res.status(200).json({
        shortUrl,
        shortCode: existing.shortCode,
        longUrl: existing.longUrl,
        clicks: existing.clicks,
        createdAt: existing.createdAt,
      });
    }

    // 6. Generate a unique 7-character short code with robust collision retry
    let shortCode;
    let newUrl;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (attempts < MAX_ATTEMPTS) {
      shortCode = nanoid();
      try {
        newUrl = new Url({ shortCode, longUrl });
        await newUrl.save();
        break; // Success! Break out of the loop
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key error (collision), try again
          attempts++;
        } else {
          // Some other DB error
          throw err;
        }
      }
    }

    if (attempts === MAX_ATTEMPTS) {
      return res.status(500).json({ error: "Could not generate a unique short code. Please try again." });
    }

    // 7. Build the full short URL and return it
    const shortUrl = `${baseUrl}/api/url/${shortCode}`;

    return res.status(201).json({
      shortUrl,
      shortCode,
      longUrl,
      clicks: 0,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// -------------------------------------------------------------------
// @desc    Redirect short URL to long URL
// @route   GET /api/url/:code
// @access  Public
// -------------------------------------------------------------------
export const redirectUrl = async (req, res, next) => {
  const { code } = req.params;

  try {
    // Find the document by shortCode
    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) {
      // If the short URL isn't found, redirect the browser to the frontend's 404 page
      const frontendUrl =
        process.env.FRONTEND_URL || process.env.BASE_URL || "http://localhost:5173";
      return res.redirect(302, `${frontendUrl}/not-found`);
    }

    // Increment click counter atomically
    urlDoc.clicks += 1;
    await urlDoc.save();

    // Redirect to the original long URL
    return res.redirect(302, urlDoc.longUrl);
  } catch (error) {
    next(error);
  }
};
