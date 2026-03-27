/**
 * server/server.ts
 *
 * itsdad.io — Express server entry point.
 *
 * - Mounts the API (routes registered in _core/index.ts)
 * - Serves the Vite-built frontend from /client/dist in production
 * - Falls back to index.html for all non-API routes (SPA routing)
 */

import path from "path";
import { app } from "./_core/index";

const PORT = parseInt(process.env.PORT || "3000", 10);
const IS_PROD = process.env.NODE_ENV === "production";

// ─── Serve Frontend in Production ────────────────────────────────────────────

if (IS_PROD) {
  const express = require("express");
  const distPath = path.resolve(__dirname, "../../client/dist");

  // Serve hashed assets (JS, CSS) with long cache — filenames change on rebuild
  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
      etag: true,
    })
  );

  // Serve images with moderate cache
  app.use(
    "/images",
    express.static(path.join(distPath, "images"), {
      maxAge: "7d",
      etag: true,
    })
  );

  // Serve other static files (favicon, og-image, etc.) with short cache
  app.use(
    express.static(distPath, {
      maxAge: "0",
      etag: true,
      index: false, // Don't auto-serve index.html from static middleware
    })
  );

  // SPA fallback — serve index.html for all non-API routes with no-cache
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[Server] itsdad.io API running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[Server] App URL: ${process.env.VITE_APP_URL || "http://localhost:" + PORT}`);
});

export default app;
