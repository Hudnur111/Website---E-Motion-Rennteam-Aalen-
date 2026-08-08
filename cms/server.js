const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const matter = require("gray-matter");
const dotenv = require("dotenv");

const ENV_PATH = path.join(__dirname, ".env");
dotenv.config({ path: ENV_PATH });

const { getCollection, COLLECTIONS } = require("./schema");
const { GitHubStore } = require("./github");

const PORT = process.env.CMS_PORT || 5757;
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

let store = null;

function loadStoreFromEnv() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, GITHUB_BASE_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    store = null;
    return;
  }
  store = new GitHubStore({
    token: GITHUB_TOKEN,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH || "cms-content",
    baseBranch: GITHUB_BASE_BRANCH || "main",
  });
}
loadStoreFromEnv();

function requireStore(req, res, next) {
  if (!store) {
    return res.status(400).json({
      error: "not_configured",
      message: "Die App ist noch nicht eingerichtet. Bitte zuerst den Einrichtungs-Assistenten ausfüllen.",
    });
  }
  next();
}

function saveEnvFile(values) {
  const lines = Object.entries(values)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${String(v).replace(/\n/g, "")}`);
  fs.writeFileSync(ENV_PATH, lines.join("\n") + "\n", "utf8");
}

// ---------- Einrichtung ----------

app.get("/api/status", (req, res) => {
  res.json({
    configured: Boolean(store),
    owner: process.env.GITHUB_OWNER || "Hudnur111",
    repo: process.env.GITHUB_REPO || "Website---E-Motion-Rennteam-Aalen-",
    branch: process.env.GITHUB_BRANCH || "cms-content",
  });
});

app.post("/api/setup", async (req, res) => {
  const { token, owner, repo, branch, baseBranch } = req.body || {};
  if (!token || !owner || !repo) {
    return res.status(400).json({ error: "missing_fields", message: "Token, Owner und Repo werden benötigt." });
  }

  const candidate = new GitHubStore({
    token,
    owner,
    repo,
    branch: branch || "cms-content",
    baseBranch: baseBranch || "main",
  });

  try {
    const info = await candidate.verifyAccess();
    saveEnvFile({
      GITHUB_TOKEN: token,
      GITHUB_OWNER: owner,
      GITHUB_REPO: repo,
      GITHUB_BRANCH: branch || "cms-content",
      GITHUB_BASE_BRANCH: baseBranch || info.defaultBranch || "main",
    });
    dotenv.config({ path: ENV_PATH, override: true });
    loadStoreFromEnv();
    res.json({ ok: true, repo: info.fullName });
  } catch (err) {
    res.status(400).json({
      error: "github_access_failed",
      message:
        "Zugriff auf GitHub fehlgeschlagen. Bitte prüfe, ob der Token korrekt ist und Schreibrechte auf das Repository hat. (" +
        (err.message || "unbekannter Fehler") +
        ")",
    });
  }
});

// ---------- Collections ----------

app.get("/api/collections", (req, res) => {
  res.json(COLLECTIONS.map(({ name, label, path: p, fields }) => ({ name, label, path: p, fields })));
});

app.get("/api/content/:collection", requireStore, async (req, res) => {
  try {
    const collection = getCollection(req.params.collection);
    const files = (await store.listDir(collection.path)).filter(
      (f) => f.type === "file" && f.name.endsWith(".md")
    );

    const entries = await Promise.all(
      files.map(async (f) => {
        const { content } = await store.getFile(f.path);
        const parsed = matter(content);
        return {
          slug: f.name.replace(/\.md$/, ""),
          data: parsed.data,
          body: parsed.content.trim(),
        };
      })
    );

    entries.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "list_failed", message: err.message });
  }
});

app.get("/api/content/:collection/:slug", requireStore, async (req, res) => {
  try {
    const collection = getCollection(req.params.collection);
    const filePath = `${collection.path}/${req.params.slug}.md`;
    const { content } = await store.getFile(filePath);
    const parsed = matter(content);
    res.json({ slug: req.params.slug, data: parsed.data, body: parsed.content.trim() });
  } catch (err) {
    res.status(404).json({ error: "not_found", message: err.message });
  }
});

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

app.post("/api/content/:collection", requireStore, async (req, res) => {
  try {
    const collection = getCollection(req.params.collection);
    const { data, body, slug: requestedSlug } = req.body || {};
    const titleField = collection.fields.find((f) => f.isTitle)?.name || "title";
    const baseSlug = slugify(requestedSlug || data?.[titleField] || "eintrag");
    let slug = baseSlug || `eintrag-${Date.now()}`;

    let exists = true;
    try {
      await store.getFile(`${collection.path}/${slug}.md`);
    } catch {
      exists = false;
    }
    if (exists) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const fileContent = matter.stringify(body || "", data || {});
    await store.putFile(
      `${collection.path}/${slug}.md`,
      fileContent,
      `CMS: ${collection.label} „${data?.[titleField] || slug}" angelegt`
    );
    res.json({ ok: true, slug });
  } catch (err) {
    res.status(500).json({ error: "create_failed", message: err.message });
  }
});

app.put("/api/content/:collection/:slug", requireStore, async (req, res) => {
  try {
    const collection = getCollection(req.params.collection);
    const { data, body } = req.body || {};
    const titleField = collection.fields.find((f) => f.isTitle)?.name || "title";
    const fileContent = matter.stringify(body || "", data || {});
    await store.putFile(
      `${collection.path}/${req.params.slug}.md`,
      fileContent,
      `CMS: ${collection.label} „${data?.[titleField] || req.params.slug}" bearbeitet`
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "save_failed", message: err.message });
  }
});

app.delete("/api/content/:collection/:slug", requireStore, async (req, res) => {
  try {
    const collection = getCollection(req.params.collection);
    await store.deleteFile(
      `${collection.path}/${req.params.slug}.md`,
      `CMS: Eintrag „${req.params.slug}" aus ${collection.label} gelöscht`
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "delete_failed", message: err.message });
  }
});

// ---------- Bild-Upload ----------

app.post("/api/upload", requireStore, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "no_file", message: "Keine Datei erhalten." });

    const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
    const safeName =
      slugify(path.basename(req.file.originalname, ext)) + "-" + Date.now().toString().slice(-6) + ext;
    const targetPath = `public/uploads/${safeName}`;
    const base64 = req.file.buffer.toString("base64");

    await store.putFile(targetPath, base64, `CMS: Bild „${safeName}" hochgeladen`, { base64: true });
    res.json({ ok: true, path: `/uploads/${safeName}` });
  } catch (err) {
    res.status(500).json({ error: "upload_failed", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  E-Motion CMS läuft auf http://localhost:${PORT}\n`);
});
