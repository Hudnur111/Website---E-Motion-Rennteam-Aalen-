import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

// Run `npm run build` before this script - it checks the production build,
// not the dev server, so results match what actually ships.
const PORT = 4173;
const baseUrl = `http://127.0.0.1:${PORT}`;

// `next start` (spawned below) loads .env.local itself, but this script's
// own process doesn't — and it needs CMS_ADMIN_USER/CMS_ADMIN_PASSWORD_HASH
// directly to know whether to attempt the authenticated /admin/* checks.
// Minimal KEY=VALUE parser, not a general .env implementation (no exports,
// no ${VAR} expansion); existing values always win.
function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    const value = rawValue.replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}
loadEnvLocal();

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
  "/admin/login",
];

// Scanned after logging in as the CMS admin below. Covers the dashboard,
// every collection's list view, and — for one collection — the create panel
// itself, since that's where most of the interactive markup (dialog, form
// fields, upload widget, richtext toolbar) actually lives.
const adminPages = [
  "/admin",
  "/admin/team",
  "/admin/vehicle",
  "/admin/sponsor",
  "/admin/news",
  "/admin/blog",
  "/admin/galleryImage",
  "/admin/result",
  "/admin/position",
  "/admin/page",
];

/** Kills the server's whole process group, not just the `npx` wrapper. */
function stopServer(server) {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // Not POSIX, already exited, or never got a pid — fall back to the
    // single-process kill so at least the wrapper itself is stopped.
    server.kill();
  }
}

function startServer() {
  return new Promise((resolve, reject) => {
    // `detached: true` puts this child in its own process group (POSIX).
    // `npx` itself forks the actual `next start`/`next-server` process, so
    // without this, killing just the `npx` process (see stopServer above)
    // leaves that grandchild running and bound to PORT forever — this
    // script's own process then never exits either, since its stdio pipes
    // stay open to that orphaned process.
    const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
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
    server.on("error", (err) => {
      stopServer(server);
      reject(err);
    });
    setTimeout(() => {
      if (!ready) {
        stopServer(server);
        reject(new Error("Timed out waiting for `next start` to become ready"));
      }
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

function checkResults(path, results) {
  if (results.violations.length > 0) {
    console.error(`\n${path}: ${results.violations.length} violation(s)`);
    for (const violation of results.violations) {
      console.error(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
      for (const node of violation.nodes) {
        console.error(`    - ${node.target.join(" ")}`);
      }
    }
    return true;
  }
  console.log(`${path}: OK`);
  return false;
}

// Only runs when the admin login is actually configured (as it is in CI /
// local dev via .env.local) — without it every /admin/* route just redirects
// to /admin/login, which is already covered by the public `pages` list above.
const adminConfigured = Boolean(process.env.CMS_ADMIN_USER && process.env.CMS_ADMIN_PASSWORD_HASH);
if (!adminConfigured) {
  console.log("\nCMS_ADMIN_USER/CMS_ADMIN_PASSWORD_HASH not set — skipping authenticated /admin/* pages.");
}

const server = await startServer();
const browser = await chromium.launch(launchOptions);
const context = await browser.newContext();
let hasViolations = false;

try {
  for (const path of pages) {
    const page = await context.newPage();
    await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();
    if (checkResults(path, results)) hasViolations = true;
    await page.close();
  }

  if (adminConfigured) {
    // Log in once via the API (bypassing the login form) and inject the
    // session cookie directly — `next start` runs NODE_ENV=production, so
    // the real cookie is Secure and would otherwise be silently dropped by
    // the browser on this plain-http test server.
    const loginRes = await fetch(new URL("/api/admin/login", baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.CMS_ADMIN_USER,
        password: process.env.CMS_A11Y_PASSWORD ?? "",
      }),
    });
    const setCookie = loginRes.headers.get("set-cookie");
    const tokenMatch = setCookie?.match(/cms_session=([^;]+)/);
    if (!loginRes.ok || !tokenMatch) {
      console.error(
        "\nCould not log in for authenticated a11y checks (set CMS_A11Y_PASSWORD to the plaintext password matching CMS_ADMIN_PASSWORD_HASH). Skipping /admin/* pages."
      );
    } else {
      await context.addCookies([
        {
          name: "cms_session",
          value: tokenMatch[1],
          domain: "127.0.0.1",
          path: "/",
          httpOnly: true,
          secure: false,
        },
      ]);

      for (const path of adminPages) {
        const page = await context.newPage();
        await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
        const results = await new AxeBuilder({ page }).analyze();
        if (checkResults(path, results)) hasViolations = true;
        await page.close();
      }

      // Also scan the create panel (dialog, form fields, upload widget,
      // richtext toolbar) since that markup only exists once opened.
      const panelPage = await context.newPage();
      await panelPage.goto(new URL("/admin/news", baseUrl).toString(), { waitUntil: "networkidle" });
      await panelPage.getByText("+ Neuer Eintrag").click();
      await panelPage.waitForSelector('[role="dialog"]');
      const panelResults = await new AxeBuilder({ page: panelPage }).analyze();
      if (checkResults("/admin/news (create panel open)", panelResults)) hasViolations = true;
      await panelPage.close();
    }
  }
} finally {
  await browser.close();
  stopServer(server);
}

if (hasViolations) {
  console.error("\nAccessibility violations found.");
  process.exit(1);
} else {
  console.log("\nNo accessibility violations found.");
}
