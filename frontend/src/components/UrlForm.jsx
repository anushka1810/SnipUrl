// src/components/UrlForm.jsx
// Form component for submitting a URL to shorten

import { useState } from "react";
import { shortenUrl } from "../services/api";

/**
 * UrlForm
 * Props:
 *   onSuccess(data) - called with { shortUrl, shortCode, longUrl, createdAt } on success
 */
function UrlForm({ onSuccess }) {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Validation helper ──────────────────────────────────────────────────────
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      // Must use http or https protocol
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation before hitting the API
    const trimmed = longUrl.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    try {
      setLoading(true);
      const data = await shortenUrl(trimmed);
      onSuccess(data); // Bubble result up to Home page
      setLongUrl("");  // Clear the input on success
    } catch (err) {
      // Extract error message from backend response or use generic fallback
      const msg =
        err?.response?.data?.error || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        {/* URL Input */}
        <div className="flex-1 relative group">
          {/* Link icon inside the input */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110 group-focus-within:text-indigo-500">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <input
            id="longUrl"
            type="url"
            value={longUrl}
            onChange={(e) => {
              setLongUrl(e.target.value);
              if (error) setError(""); // Clear error on typing
            }}
            placeholder="Paste your long URL here... (https://example.com)"
            disabled={loading}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-white/80 backdrop-blur-sm text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-300 hover:shadow-md ${
              error ? "border-red-400 focus:ring-red-400/50" : "border-gray-200 focus:ring-indigo-500/30 hover:border-indigo-300"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
            aria-describedby={error ? "url-error" : undefined}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !longUrl.trim()}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-base font-bold rounded-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:-translate-y-0.5 whitespace-nowrap overflow-hidden relative"
        >
          {loading ? (
            <>
              {/* Spinner SVG */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Shortening…
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Shorten URL
            </>
          )}
        </button>
      </div>

      {/* Example Link & Error message */}
      <div className="mt-2.5 min-h-[20px] text-sm flex items-center">
        {error ? (
          <p
            id="url-error"
            role="alert"
            className="text-red-600 flex items-center gap-1.5 animate-fade-in-up"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : (
          <p className="text-gray-500 animate-fade-in-up">
            Try an example:{" "}
            <button
              type="button"
              onClick={() => {
                setLongUrl("https://en.wikipedia.org/wiki/URL_shortening");
                setError("");
              }}
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium focus:outline-none transition-colors"
            >
              https://en.wikipedia.org/wiki/URL_shortening
            </button>
          </p>
        )}
      </div>
    </form>
  );
}

export default UrlForm;
