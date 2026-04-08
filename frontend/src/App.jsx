// src/App.jsx
// Root component - sets up React Router with all application routes

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RedirectHandler from "./pages/RedirectHandler";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page - URL shortening form */}
        <Route path="/" element={<Home />} />

        {/* Specific route for the Not Found UI */}
        <Route path="/not-found" element={<NotFound />} />

        {/* Catch-all: any /:code path triggers a redirect attempt */}
        <Route path="/:code" element={<RedirectHandler />} />

        {/* Absolute catch-all for completely unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
