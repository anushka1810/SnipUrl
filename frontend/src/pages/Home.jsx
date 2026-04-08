// src/pages/Home.jsx
// Main landing page - orchestrates the URL shortener UI

import { useState } from "react";
import UrlForm from "../components/UrlForm";
import ShortUrlResult from "../components/ShortUrlResult";
import RecentLinks, { saveRecentLink } from "../components/RecentLinks";
import BackgroundStars from "../components/BackgroundStars";

function Home() {
  const [result, setResult] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = (data) => {
    setResult(data);
    saveRecentLink({
      shortUrl: data.shortUrl,
      longUrl: data.longUrl,
      createdAt: data.createdAt || new Date().toISOString(),
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-transparent flex flex-col lg:flex-row relative">
      <BackgroundStars />
      
      {/* ── Left Side: Hero ───────────────────────────────────────────────────── */}
      <header className="flex-1 lg:flex-[1] px-6 py-16 lg:py-0 flex flex-col items-center justify-center text-center relative z-20">
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8 backdrop-blur-md border border-white/5 shadow-xl transform transition-transform hover:scale-110 hover:rotate-3 duration-300">
            <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Snip<span className="text-indigo-200">URL</span>
          </h1>
          <p className="text-indigo-100 text-lg sm:text-2xl font-medium max-w-lg mx-auto leading-relaxed drop-shadow-sm">
            Transform long, messy URLs into clean, shareable short links in exactly one click.
          </p>

          {/* Feature pills with hover effects */}
          <div className="flex items-center justify-center gap-4 mt-10 flex-wrap relative z-10">
            {[
              { icon: "⚡", label: "Lightning fast" },
              { icon: "🔒", label: "No sign-up" },
              { icon: "📊", label: "Click tracking" },
            ].map((item) => (
              <span
                key={item.label}
                className="group flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
              >
                <span className="group-hover:animate-bounce">{item.icon}</span> {item.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Right Side: Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 lg:flex-[1.2] flex flex-col justify-center items-center px-4 py-12 lg:py-16 relative z-10 w-full">
        <div className="w-full max-w-2xl lg:max-w-xl xl:max-w-2xl px-2 sm:px-0 lg:my-auto">

          {/* Card with Glassmorphism and entrance animation */}
          <div className="glass-panel rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 p-6 sm:p-10 animate-fade-in-up border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full shadow-sm" />
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Shorten your URL</h2>
            </div>

            {/* URL Form */}
            <UrlForm onSuccess={handleSuccess} />

            {/* Result Card */}
            {result && (
              <ShortUrlResult
                shortUrl={result.shortUrl}
                longUrl={result.longUrl}
                clicks={result.clicks ?? 0}
              />
            )}

            {/* Recent Links */}
            <RecentLinks refreshTrigger={refreshTrigger} />
          </div>

          {/* Footer */}
          <p className="text-center text-xs font-medium text-slate-400 mt-8">
            Built with ♥ using React + Node.js + MongoDB
          </p>
        </div>
      </main>

    </div>
  );
}

export default Home;
