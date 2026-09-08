#!/usr/bin/env node
// Startet den Next.js-Server als Kindprozess und prueft periodisch (Standard:
// alle 5 Minuten) im Hintergrund auf GitHub-Updates, waehrend das CMS laeuft -
// nicht nur beim Start. Wird ein Update gefunden, wendet dieses Skript es an
// (per scripts/cms-update.sh bzw. .ps1 - dieselbe, bereits beim Start
// verwendete Update-Logik, inkl. Inhalte-Abgleich) und startet den Server bei
// echten Code-Aenderungen automatisch neu. Reine Inhalte-Aenderungen (ueber
// das CMS gespeicherte Texte/Bilder) erfordern keinen Neustart, da diese bei
// jeder Anfrage frisch von der Festplatte gelesen werden.
//
// Der aktuelle Status wird in ".cms-update-status.json" im Projektordner
// abgelegt; das Admin-Panel liest diese Datei ueber /api/admin/update-status
// und zeigt der Redaktion einen Hinweis, wenn ein Update angewendet wird.
//
// Schlaegt eine Pruefung fehl (kein Internet, lokale Aenderungen, Konflikt),
// laeuft der Server einfach mit der vorhandenen Version weiter - der Betrieb
// wird dadurch nie unterbrochen.

import { spawn, spawnSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const statusFile = path.join(repoRoot, ".cms-update-status.json");
const isWin = process.platform === "win32";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

const portIndex = process.argv.indexOf("-p");
const port = portIndex !== -1 ? process.argv[portIndex + 1] : "3000";

let child = null;
let shuttingDown = false;

function writeStatus(status, extra = {}) {
  try {
    writeFileSync(statusFile, JSON.stringify({ status, checkedAt: new Date().toISOString(), ...extra }));
  } catch {
    // Nur informativ fuers Admin-Panel - darf den Betrieb nie stoeren.
  }
}

function isGitAvailable() {
  try {
    const r = spawnSync("git", ["--version"], {
      cwd: repoRoot,
      stdio: "pipe",
      shell: isWin,
      timeout: 2000,
    });
    return r.status === 0 && !r.error;
  } catch {
    return false;
  }
}

function runGitCommand(args) {
  try {
    const r = spawnSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      shell: isWin,
      timeout: 5000,
    });
    return r.status === 0 ? r.stdout.trim() : null;
  } catch {
    return null;
  }
}

function currentHead() {
  return runGitCommand(["rev-parse", "HEAD"]);
}

function runAsync(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: repoRoot, stdio: "inherit", shell: isWin });
    p.on("close", (code) => resolve(code ?? 0));
    p.on("error", () => resolve(1));
  });
}

function startServer() {
  child = spawn("npm", ["run", "dev", "--", "-p", port], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: isWin,
    detached: !isWin,
  });
  child.on("exit", (code) => {
    if (!shuttingDown) process.exit(code ?? 0);
  });
}

function killChild() {
  return new Promise((resolve) => {
    if (!child) return resolve();
    child.once("exit", resolve);
    if (isWin) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    } else {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {
        try {
          child.kill("SIGTERM");
        } catch {
          resolve();
        }
      }
    }
  });
}

async function restartServer() {
  shuttingDown = true;
  await killChild();
  shuttingDown = false;
  // Kurze Pause, damit der alte Prozess den Port sicher freigegeben hat,
  // bevor der neue Server ihn wieder belegt.
  await new Promise((r) => setTimeout(r, 800));
  startServer();
}

async function checkForUpdate() {
  if (!existsSync(path.join(repoRoot, ".git"))) {
    writeStatus("git-repo-missing");
    return;
  }

  if (!isGitAvailable()) {
    writeStatus("git-not-available", {
      error: "Git ist nicht installiert oder nicht erreichbar",
      hint: "Zur Aktivierung von Auto-Updates: Git installieren und neu starten",
    });
    return;
  }

  const before = currentHead();
  writeStatus("checking");

  const updateScript = isWin
    ? { cmd: "powershell", args: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "scripts/cms-update.ps1"] }
    : { cmd: "bash", args: ["scripts/cms-update.sh"] };
  await runAsync(updateScript.cmd, updateScript.args);

  const after = currentHead();
  if (!before || !after || before === after) {
    writeStatus("up-to-date");
    return;
  }

  // Nur bei tatsaechlichen Code-Aenderungen neu starten - ein reiner
  // Inhalte-Abgleich (content/) wird ohne Neustart sofort wirksam, da
  // Inhalte bei jeder Anfrage frisch von der Festplatte gelesen werden.
  const diff = runGitCommand(["diff", "--name-only", before, after]);
  const changedFiles = (diff || "").split("\n").filter(Boolean);
  const onlyContent = changedFiles.length > 0 && changedFiles.every((f) => f.startsWith("content/"));
  if (onlyContent) {
    writeStatus("up-to-date");
    return;
  }

  const pkgChanged = changedFiles.some((f) => f === "package.json" || f === "package-lock.json");
  if (pkgChanged) {
    writeStatus("installing-dependencies");
    const hasLock = existsSync(path.join(repoRoot, "package-lock.json"));
    await runAsync("npm", [hasLock ? "ci" : "install", "--no-audit", "--no-fund"]);
  }

  writeStatus("restarting");
  await restartServer();
  writeStatus("updated", { appliedAt: new Date().toISOString() });
}

writeStatus("up-to-date");
startServer();

const interval = setInterval(() => {
  checkForUpdate().catch(() => writeStatus("up-to-date"));
}, CHECK_INTERVAL_MS);

function shutdown(signal) {
  shuttingDown = true;
  clearInterval(interval);
  if (child) {
    if (isWin) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    } else {
      try {
        process.kill(-child.pid, signal);
      } catch {
        try {
          child.kill(signal);
        } catch {
          // Prozess bereits beendet.
        }
      }
    }
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
