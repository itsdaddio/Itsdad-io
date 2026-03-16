/**
 * server/server.ts
 *
 * Its Dad LLC — Express server entry point.
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
  const distPath = path.resolve(__dirname, "../../client/dist");

  // Serve static assets (JS, CSS, images)
  app.use(
    require("express").static(distPath, {
      maxAge: "1y",
      etag: true,
    })
  );

  // SPA fallback — serve index.html for all non-API routes
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[Server] Its Dad LLC API running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[Server] App URL: ${process.env.VITE_APP_URL || "http://localhost:" + PORT}`);
});

export default app;
