// src/components/RecentLinks.jsx
// Displays recent shortened URLs stored in localStorage with View More and Delete options.

import { useState, useEffect } from "react";

// localStorage key used across the app
const STORAGE_KEY = "snipurl_recent_links";
const MAX_ITEMS = 20;

/**
 * Retrieve recent links from localStorage
 * @returns {Array} Parsed array of link objects
 */
export const getRecentLinks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Persist a new link to localStorage (keeps only the last MAX_ITEMS)
 * @param {{ shortUrl, longUrl, createdAt }} newLink
 */
export const saveRecentLink = (newLink) => {
  const existing = getRecentLinks();

  // Avoid duplicates - remove if already exists
  const filtered = existing.filter((l) => l.shortUrl !== newLink.shortUrl);

  // Prepend new link and cap at MAX_ITEMS
  const updated = [newLink, ...filtered].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/**
 * Remove a specific link from localStorage
 * @param {string} shortUrl
 */
export const removeRecentLink = (shortUrl) => {
  const existing = getRecentLinks();
  const updated = existing.filter((l) => l.shortUrl !== shortUrl);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/**
 * Clear all recent links from localStorage
 */
export const clearAllRecentLinks = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// ── Component ────────────────────────────────────────────────────────────────

/**
 * RecentLinks
 * Props:
 *   refreshTrigger (any) - changing this value causes the list to re-read localStorage
 */
function RecentLinks({ refreshTrigger }) {
  const [links, setLinks] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Re-read from localStorage whenever the parent tells us a new URL was added
  useEffect(() => {
    setLinks(getRecentLinks());
  }, [refreshTrigger]);

  // Don't render the section at all if there are no recent links
  if (links.length === 0) return null;

  // ── Copy handler ───────────────────────────────────────────────────────────
  const handleCopy = async (shortUrl, index) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      // Clipboard API fallback
      const el = document.createElement("input");
      el.value = shortUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ── Remove handlers ────────────────────────────────────────────────────────
  const handleRemove = (shortUrl) => {
    removeRecentLink(shortUrl);
    setLinks(getRecentLinks()); // Refresh UI
  };

  const handleClearAll = () => {
    clearAllRecentLinks();
    setLinks([]);
    setIsExpanded(false);
  };

  // ── Format relative time ──────────────────────────────────────────────────
  const formatTime = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(isoString).toLocaleDateString();
  };

  const visibleLinks = isExpanded ? links : links.slice(0, 3);

  return (
    <div className="mt-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Links
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full shadow-sm">
            Total {links.length}
          </span>
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 focus:outline-none"
            aria-label="Clear all recent links"
            title="Clear All"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>
      </div>

      <ul className={`space-y-3 ${isExpanded ? "max-h-[280px] overflow-y-auto pr-2" : ""}`} role="list" aria-label="Recently shortened URLs" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c7d2fe transparent' }}>
        {visibleLinks.map((link, index) => (
          <li
            key={link.shortUrl}
            className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group"
          >
            {/* Link icon */}
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-100 group-hover:border-indigo-200 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            {/* URL info */}
            <div className="flex-1 min-w-0">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 truncate block"
                title={link.shortUrl}
              >
                {link.shortUrl}
              </a>
              <p
                className="text-xs font-medium text-slate-400 truncate mt-1"
                title={link.longUrl}
              >
                {link.longUrl}
              </p>
            </div>

            {/* Time */}
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md hidden sm:block">
              {formatTime(link.createdAt)}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Copy button */}
              <button
                onClick={() => handleCopy(link.shortUrl, index)}
                className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${
                  copiedIndex === index
                    ? "text-emerald-600 bg-emerald-50 border border-emerald-200 shadow-sm"
                    : "text-slate-400 border border-transparent hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100"
                }`}
                aria-label={copiedIndex === index ? "Copied!" : `Copy ${link.shortUrl}`}
                title={copiedIndex === index ? "Copied!" : "Copy short URL"}
              >
                {copiedIndex === index ? (
                  <svg className="w-5 h-5 animate-pop-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* Remove button */}
              <button
                onClick={() => handleRemove(link.shortUrl)}
                className="p-2.5 rounded-xl text-slate-300 border border-transparent hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-300 active:scale-90"
                aria-label={`Remove ${link.shortUrl}`}
                title="Remove link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* View More / Less Toggle */}
      {links.length > 3 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            {isExpanded ? (
              <>
                Show Less
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                View More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentLinks;
