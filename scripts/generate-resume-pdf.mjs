// Generate a static one-page PDF of the resume.
// Runs after `astro build` against the contents of dist/, and writes
// dist/elliott-bregni-resume.pdf so the Download button can link to a
// real artifact instead of relying on browser print (which renders
// inconsistently on mobile).

import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PDF_PATH = path.join(DIST, "elliott-bregni-resume.pdf");
const PORT = 4322;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(DIST, url);
  try {
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    res.statusCode = 404;
    return res.end("not found");
  }
  const ext = path.extname(filePath);
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${PORT}/resume/`, { waitUntil: "networkidle" });
// Reveal animations rely on IntersectionObserver; force them visible
// so the print render isn't blank for items below the fold.
await page.addStyleTag({
  content: `.reveal { opacity: 1 !important; transform: none !important; }`,
});
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: PDF_PATH,
  format: "Letter",
  printBackground: true,
  // Margins are zeroed because the print CSS already handles
  // page padding via `.resume { padding: 0.4in }`.
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();
server.close();
console.log(`✓ Resume PDF: ${path.relative(process.cwd(), PDF_PATH)}`);
