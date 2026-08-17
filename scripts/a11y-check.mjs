import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

// Run `npm run build` before this script - it checks the production build,
// not the dev server, so results match what actually ships.
const PORT = 4173;
const baseUrl = `http://127.0.0.1:${PORT}`;

const pages = [
  "/",
  "/team",
  "/fahrzeuge",
  "/sponsoren",
  "/formula-student",
  "/news",
  "/news/saisonstart-2026",
  "/news/erfolg-fse",
  "/blog",
  "/blog/werkstatt-nachtschicht",
  "/blog/erstsemester-onboarding",
  "/galerie",
  "/erfolge",
  "/mitmachen",
  "/kontakt",
  "/impressum",
  "/datenschutz",
];

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let ready = false;
    const onData = (data) => {
      if (!ready && /Ready in/.test(data.toString())) {
        ready = true;
        resolve(server);
      }
    };
    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
    server.on("error", reject);
    setTimeout(() => {
      if (!ready) reject(new Error("Timed out waiting for `next start` to become ready"));
    }, 30_000);
  });
}

// In sandboxed CI-like environments without network access for
// `npx playwright install`, a Chromium build is preinstalled outside
// Playwright's own version-pinned cache directory. Point at it explicitly
// when present; otherwise fall back to Playwright's normal resolution
// (e.g. a real CI runner with `playwright install` already run).
const preinstalledChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const launchOptions = existsSync(preinstalledChromium)
  ? { executablePath: preinstalledChromium, args: ["--no-sandbox"] }
  : {};

const server = await startServer();
const browser = await chromium.launch(launchOptions);
const context = await browser.newContext();
let hasViolations = false;

try {
  for (const path of pages) {
    const page = await context.newPage();
    await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();

    if (results.violations.length > 0) {
      hasViolations = true;
      console.error(`\n${path}: ${results.violations.length} violation(s)`);
      for (const violation of results.violations) {
        console.error(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
        for (const node of violation.nodes) {
          console.error(`    - ${node.target.join(" ")}`);
        }
      }
    } else {
      console.log(`${path}: OK`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

if (hasViolations) {
  console.error("\nAccessibility violations found.");
  process.exit(1);
} else {
  console.log("\nNo accessibility violations found.");
}
