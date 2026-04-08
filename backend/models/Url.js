// models/Url.js
// Mongoose schema and model for URL documents

import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true, // Indexed for fast lookups during redirects
  },
  longUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0, // Track how many times this short URL was accessed
  },
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
