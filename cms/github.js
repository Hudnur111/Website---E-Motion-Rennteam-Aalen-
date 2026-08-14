const { Octokit } = require("@octokit/rest");

class GitHubStore {
  constructor({ token, owner, repo, branch, baseBranch }) {
    // GITHUB_API_URL erlaubt den Betrieb gegen GitHub Enterprise Server
    // (oder einen Test-Mock) statt gegen die öffentliche GitHub-API.
    const baseUrl = process.env.GITHUB_API_URL;
    this.octokit = new Octokit(baseUrl ? { auth: token, baseUrl } : { auth: token });
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.baseBranch = baseBranch || "main";
  }

  async verifyAccess() {
    const { data } = await this.octokit.repos.get({ owner: this.owner, repo: this.repo });
    return { fullName: data.full_name, defaultBranch: data.default_branch };
  }

  async ensureBranch() {
    try {
      await this.octokit.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
      });
      return;
    } catch (err) {
      if (err.status !== 404) throw err;
    }

    const baseRef = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.baseBranch}`,
    });

    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${this.branch}`,
      sha: baseRef.data.object.sha,
    });
  }

  async listDir(path) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      if (err.status === 404) return [];
      throw err;
    }
  }

  async getFile(path) {
    const { data } = await this.octokit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.branch,
    });
    if (Array.isArray(data)) throw new Error(`${path} ist ein Ordner, keine Datei`);
    const content = Buffer.from(data.content, data.encoding).toString("utf8");
    return { content, sha: data.sha };
  }

  async getFileRaw(path) {
    const { data } = await this.octokit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.branch,
    });
    if (Array.isArray(data)) throw new Error(`${path} ist ein Ordner, keine Datei`);
    return { base64: data.content.replace(/\n/g, ""), sha: data.sha };
  }

  async putFile(path, content, message, { base64 = false } = {}) {
    await this.ensureBranch();

    let sha;
    try {
      const existing = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });
      if (!Array.isArray(existing.data)) sha = existing.data.sha;
    } catch (err) {
      if (err.status !== 404) throw err;
    }

    const encoded = base64 ? content : Buffer.from(content, "utf8").toString("base64");

    const { data } = await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      content: encoded,
      sha,
      branch: this.branch,
    });
    return data;
  }

  async deleteFile(path, message) {
    await this.ensureBranch();
    const { data } = await this.octokit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.branch,
    });
    if (Array.isArray(data)) throw new Error(`${path} ist ein Ordner, keine Datei`);

    await this.octokit.repos.deleteFile({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      sha: data.sha,
      branch: this.branch,
    });
  }
}

module.exports = { GitHubStore };
