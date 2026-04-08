// src/pages/RedirectHandler.jsx
// Handles short URL redirect: reads the code from the URL and sends
// the browser directly to the backend which issues a 302 redirect.

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRedirectUrl } from "../services/api";

function RedirectHandler() {
  const { code } = useParams(); // Extract the short code from the URL path
  const [status, setStatus] = useState("loading"); // "loading" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Guard: only run if there's a code
    if (!code) {
      setStatus("error");
      setErrorMsg("No short code provided.");
      return;
    }

    // Small delay so the spinner is visible, then hand off to the browser.
    // The browser will follow the backend's 302 redirect natively —
    // no Axios needed, no CORS issue with redirects.
    const timer = setTimeout(() => {
      const backendUrl = getRedirectUrl(code);
      window.location.href = backendUrl;
    }, 600);

    return () => clearTimeout(timer);
  }, [code]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full text-center">
          {/* Animated spinner */}
          <div className="flex justify-center mb-5">
            <svg
              className="animate-spin h-12 w-12 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-800 mb-2">Redirecting…</h1>
          <p className="text-sm text-gray-500">
            Looking up{" "}
            <span className="font-mono font-semibold text-indigo-600">/{code}</span>{" "}
            and sending you on your way.
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full text-center animate-fade-in-up">
        {/* 404 icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Link Not Found</h1>
        <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default RedirectHandler;
