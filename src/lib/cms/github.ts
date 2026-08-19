// Thin wrapper around the GitHub Contents API so CMS saves become real
// commits on the target repo/branch, not just local filesystem writes
// (which don't persist on most serverless hosts).

interface GithubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getFileSha(config: GithubConfig, path: string): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(path)}?ref=${config.branch}`;
  const res = await fetch(url, { headers: authHeaders(config.token) });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GitHub: Datei konnte nicht gelesen werden (${res.status})`);
  const data = await res.json();
  return data.sha as string;
}

/** Creates or updates a file at `path` with UTF-8 `content`, returns the commit URL. */
export async function commitFile(
  path: string,
  content: string,
  message: string,
  authorName: string
): Promise<{ commitUrl: string | null }> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO fehlen).");

  const sha = await getFileSha(config, path);
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(path)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: config.branch,
      sha,
      committer: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, "-")}@cms.local` },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub-Commit fehlgeschlagen (${res.status}): ${body}`);
  }
  const data = await res.json();
  return { commitUrl: data.commit?.html_url ?? null };
}

/** Creates or updates a binary file (e.g. an uploaded image) given raw bytes. */
export async function commitBinaryFile(
  path: string,
  bytes: Uint8Array,
  message: string,
  authorName: string
): Promise<{ commitUrl: string | null }> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO fehlen).");

  const sha = await getFileSha(config, path);
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(path)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(bytes).toString("base64"),
      branch: config.branch,
      sha,
      committer: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, "-")}@cms.local` },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub-Commit fehlgeschlagen (${res.status}): ${body}`);
  }
  const data = await res.json();
  return { commitUrl: data.commit?.html_url ?? null };
}

export async function deleteFile(path: string, message: string, authorName: string): Promise<void> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO fehlen).");

  const sha = await getFileSha(config, path);
  if (!sha) return;
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(path)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { ...authHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sha,
      branch: config.branch,
      committer: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, "-")}@cms.local` },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub-Löschung fehlgeschlagen (${res.status}): ${body}`);
  }
}
