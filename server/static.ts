import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

declare const __dirname: string | undefined;

function getCurrentDir() {
  if (typeof __dirname === "string") {
    return __dirname;
  }

  const metaUrl = new Function("return import.meta.url")();
  return path.dirname(fileURLToPath(metaUrl));
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(getCurrentDir(), "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html for client-side routing
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}