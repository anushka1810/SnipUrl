// src/components/ShortUrlResult.jsx
// Displays the generated short URL with a copy-to-clipboard button

import { useState } from "react";

/**
 * ShortUrlResult
 * Props:
 *   shortUrl  (string) - The full short URL to display
 *   longUrl   (string) - The original long URL (shown as context)
 *   clicks    (number) - Current click count
 */
function ShortUrlResult({ shortUrl, longUrl, clicks }) {
  const [copied, setCopied] = useState(false);

  // ── Copy to clipboard ──────────────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      // Reset "Copied!" state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without Clipboard API
      const input = document.createElement("input");
      input.value = shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-8 p-6 bg-indigo-50/50 backdrop-blur-sm border border-indigo-100 rounded-2xl animate-pop-in hover:shadow-lg transition-shadow duration-300 group">
      {/* Success header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-bold text-emerald-800 tracking-wide uppercase">Your short URL is ready!</p>
      </div>

      {/* Short URL display with copy button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            id="shortUrlOutput"
            type="text"
            readOnly
            value={shortUrl}
            className="w-full px-4 py-3.5 bg-white border border-indigo-200 rounded-xl text-base font-bold text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 cursor-copy select-all shadow-inner transition-colors hover:border-indigo-300"
            aria-label="Shortened URL"
            onClick={(e) => e.target.select()}
          />
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`relative flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex-shrink-0 active:scale-95 ${
            copied
              ? "bg-emerald-500 text-white shadow-emerald-500/40"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          } shadow-lg`}
          aria-label={copied ? "Copied!" : "Copy short URL"}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5 animate-pop-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Original URL and click stats */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 bg-white/60 p-3 rounded-xl border border-indigo-50 shadow-sm">
        <p className="truncate max-w-[200px] sm:max-w-xs" title={longUrl}>
          <span className="font-semibold text-slate-700">Original: </span>
          {longUrl}
        </p>
        <div className="flex items-center gap-1.5 text-indigo-600 font-bold bg-indigo-100/50 px-2.5 py-1 rounded-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {clicks} {clicks === 1 ? "click" : "clicks"}
        </div>
      </div>
    </div>
  );
}

export default ShortUrlResult;
