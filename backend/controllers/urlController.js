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
  const { longUrl } = req.body;

  // 1. Validate that the URL is provided
  if (!longUrl) {
    return res.status(400).json({ error: "Please provide a URL to shorten." });
  }

  // 2. Validate URL format using the built-in URL constructor
  try {
    new URL(longUrl);
  } catch (_) {
    return res.status(400).json({ error: "Invalid URL format. Please include http:// or https://" });
  }

  try {
    // 3. Check if this long URL has already been shortened → return existing
    const existing = await Url.findOne({ longUrl });
    if (existing) {
      const shortUrl = `${process.env.BASE_URL}/api/url/${existing.shortCode}`;
      return res.status(200).json({
        shortUrl,
        shortCode: existing.shortCode,
        longUrl: existing.longUrl,
        clicks: existing.clicks,
        createdAt: existing.createdAt,
      });
    }

    // 4. Generate a unique 7-character short code
    let shortCode;
    let isUnique = false;

    // Loop to ensure uniqueness (collision is extremely rare but handled)
    while (!isUnique) {
      shortCode = nanoid();
      const exists = await Url.findOne({ shortCode });
      if (!exists) isUnique = true;
    }

    // 5. Save new URL document to MongoDB
    const newUrl = new Url({ shortCode, longUrl });
    await newUrl.save();

    // 6. Build the full short URL and return it
    const shortUrl = `${process.env.BASE_URL}/api/url/${shortCode}`;

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
