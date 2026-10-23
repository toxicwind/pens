// ranch/toolkit/audit-forks.ts
//
// For each `ranch/*` dir, find the *obvious* upstream reference and report it.
// Sources we look at, in order — first match wins:
//   1. .gitmodules path (we already track it as a submodule)
//   2. package.json `repository.url` (Node/TS projects)
//   3. Cargo.toml `package.repository` (Rust)
//   4. pyproject.toml `[project].urls.Homepage` / `[tool.poetry].repository` (Python)
//   5. go.mod module path (Go)
//   6. git remote `upstream` (some forks have one)
//   7. git remote `origin` if not toxicwind/*
//   8. README "Forked from" / "Based on" / "Copyright © YYYY <Author> (upstream X)" line
//
// For dirs with no obvious upstream, a second pass scans the same sources
// for *signals* (weight: README attribution +2, package-repo +2, version-fork
// marker +1, fingerprint-var +1, upstream-sync commit +1). The signal trace
// is reported as a "review" section — high-confidence signal totals (>= 3)
// suggest a fork we haven't pinned to an upstream yet.
//
// Usage:
//   bun toolkit/audit-forks.ts                  # write FORKS-report.md + .json
//   bun toolkit/audit-forks.ts --resolve-origins   # + GitHub parent lookup

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Portable paths: derive the repo root from the script's own location so the
// toolkit runs on yote (/home/toxic/estate/ranch), on GitHub Actions runners
// (checked out anywhere), and anywhere else — no machine-specific paths.
const TOOLKIT_DIR = dirname(fileURLToPath(import.meta.url));
const RANCH_ROOT = dirname(TOOLKIT_DIR);

const CACHE_DIR = process.env.XDG_CACHE_HOME
  ? join(process.env.XDG_CACHE_HOME, "ranch-fork-audit")
  : process.env.HOME
    ? join(process.env.HOME, ".cache", "ranch-fork-audit")
    : join(RANCH_ROOT, ".cache", "ranch-fork-audit");
mkdirSync(CACHE_DIR, { recursive: true });

const args = new Set(process.argv.slice(2));
const RESOLVE = args.has("--resolve-origins");

interface Signal {
  kind: string;
  weight: number;
  detail: string;
}
interface DirInfo {
  name: string;
  upstream: string | null;
  upstreamSource: string | null;
  remoteOrigin: string | null;
  hasGit: boolean;
  isSubmodule: boolean;
  sizeBytes: number;
  fileCount: number;
  signals: Signal[];
  signalTotal: number;
}

const REPO_PATTERNS: Array<{ file: string; pattern: RegExp; label: string }> = [
  { file: "package.json", pattern: /"repository"\s*:\s*\{[^}]*"url"\s*:\s*"(https?:\/\/[^"]+)"/, label: "package.json repository" },
  { file: "Cargo.toml", pattern: /\[package\][\s\S]{0,400}?repository\s*=\s*"(https?:\/\/[^"]+)"/, label: "Cargo.toml repository" },
  { file: "pyproject.toml", pattern: /\[(?:project|tool\.poetry)\][\s\S]{0,400}?(?:Homepage|homepage|Repository|repository)\s*=\s*"(https?:\/\/[^"]+)"/, label: "pyproject.toml repository" },
  { file: "go.mod", pattern: /^module\s+(\S+)/m, label: "go.mod module" },
];

const README_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\(upstream\s+([\w./-]+)\)/i, label: "README '(upstream X)'" },
  { pattern: /Forked from\s+\[?([\w./-]+)\]?/i, label: "README 'Forked from'" },
  { pattern: /Based on\s+\[?([\w./-]+)\]?/i, label: "README 'Based on'" },
  { pattern: /Copyright\s*©?\s*\d{4}\s+[\w .'-]+\s*\(upstream\s+([\w./-]+)\)/i, label: "README copyright+upstream" },
  { pattern: /Originally from\s+\[?([\w./-]+)\]?/i, label: "README 'Originally from'" },
];

// Fingerprint variables that are actually verified to exist in the upstream
// can1357/oh-my-pi source (cloned 2026-10-15, grepped each candidate). The
// previous "omp-*" entries were tau's own extensions (added in the fork),
// not upstream signatures — do not add more without verifying against
// the actual upstream source at https://github.com/can1357/oh-my-pi.
const FINGERPRINT_VARS = ["PI_CONFIG_DIR", "PI_CODING_AGENT_DIR"];
const VERSION_FORK_RE = /v?\d+\.\d+\.\d+[\-+][\w.]+\.[0-9a-f]{7,}/i;

function sh(cmd: string, cwd?: string, timeoutMs = 30_000): string {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: timeoutMs }).trim();
  } catch {
    return "";
  }
}

function isExcludedDir(name: string): boolean {
  return [".git", "node_modules", ".venv", "venv", "__pycache__", "target", "dist", "build", ".cache"].includes(name);
}

function readFullText(p: string, maxBytes = 256_000): string | undefined {
  if (!existsSync(p)) return undefined;
  try {
    const buf = readFileSync(p, "utf8");
    return buf.length > maxBytes ? buf.slice(0, maxBytes) : buf;
  } catch {
    return undefined;
  }
}

function listImmediateDirs(root: string): string[] {
  return sh(`ls -1 ${root}`)
    .split("\n")
    .filter((d) => d && !isExcludedDir(d))
    .filter((d) => {
      try { return statSync(join(root, d)).isDirectory(); } catch { return false; }
    });
}

function submodulesFromGitmodules(): Record<string, string> {
  const path = join(RANCH_ROOT, ".gitmodules");
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const block of readFileSync(path, "utf8").split(/\n\[submodule\s+"([^"]+)"\]/)) {
    const m = block.match(/^\s*path\s*=\s*(.+)$/m);
    const u = block.match(/^\s*url\s*=\s*(.+)$/m);
    if (m && u) out[m[1].trim()] = u[1].trim();
  }
  return out;
}

function findUpstreamFromManifests(p: string): { url: string; source: string } | null {
  for (const { file, pattern, label } of REPO_PATTERNS) {
    const f = join(p, file);
    if (!existsSync(f)) continue;
    const text = readFileSync(f, "utf8");
    const m = text.match(pattern);
    if (m) {
      // For go.mod the match is the module path (e.g. github.com/owner/repo) — turn it into a URL
      const raw = m[1];
      const url = raw.startsWith("http") ? raw : `https://${raw}`;
      return { url, source: label };
    }
  }
  return null;
}

function findUpstreamFromReadme(p: string): { url: string; source: string } | null {
  for (const f of ["README.md", "readme.md", "README.rst", "README", "readme.txt"]) {
    const path = join(p, f);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf8").slice(0, 50_000); // first 50KB
    for (const { pattern, label } of README_PATTERNS) {
      const m = text.match(pattern);
      if (m) {
        const raw = m[1];
        const url = raw.startsWith("http") ? raw : `https://github.com/${raw.replace(/^github\.com\//, "")}`;
        return { url, source: label };
      }
    }
  }
  return null;
}

function findUpstreamFromGitRemotes(p: string): { url: string; source: string } | null {
  if (!existsSync(join(p, ".git"))) return null;
  const upstream = sh("git remote get-url upstream", p);
  if (upstream) return { url: upstream.replace(/\.git$/, ""), source: "git remote upstream" };
  const origin = sh("git remote get-url origin", p);
  if (origin && !origin.includes("github.com/toxicwind/")) {
    return { url: origin.replace(/\.git$/, ""), source: "git remote origin (non-toxicwind)" };
  }
  return null;
}

function dirInfo(name: string, submodules: Record<string, string>): DirInfo {
  const p = join(RANCH_ROOT, name);
  const hasGit = existsSync(join(p, ".git"));
  const isSubmodule = name in submodules;
  const remoteOrigin = hasGit ? sh("git remote get-url origin", p) : null;
  const sizeBytes = Number(sh(`du -sb ${p} 2>/dev/null`)?.split("\t")[0]) || 0;
  const fileCount = Number(sh(`find ${p} -type f 2>/dev/null | wc -l`).split("\n")[0]) || 0;

  // First match wins: submodule → manifests → readme → git remotes
  let upstream: string | null = null;
  let upstreamSource: string | null = null;
  if (isSubmodule) {
    upstream = submodules[name].replace(/\.git$/, "");
    upstreamSource = ".gitmodules";
  } else {
    const m = findUpstreamFromManifests(p);
    if (m) { upstream = m.url; upstreamSource = m.source; }
    else {
      const r = findUpstreamFromReadme(p);
      if (r) { upstream = r.url; upstreamSource = r.source; }
      else {
        const g = findUpstreamFromGitRemotes(p);
        if (g) { upstream = g.url; upstreamSource = g.source; }
      }
    }
  }

  // For dirs without an obvious upstream, the signal pass (in
  // renderReviewSection) queries GitHub's `parent.full_name` — the
  // canonical source for any GitHub fork. No local signal collection here.
  const signals: Signal[] = [];
  const signalTotal = 0;

  return {
    name,
    upstream,
    upstreamSource,
    remoteOrigin: remoteOrigin || null,
    hasGit,
    isSubmodule,
    sizeBytes,
    fileCount,
    signals,
    signalTotal,
  };
}

function renderTable(infos: DirInfo[]): string {
  const header = "| dir | upstream | source | origin remote |\n|---|---|---|---|";
  const sorted = [...infos].sort((a, b) => {
    if (!a.upstream && b.upstream) return 1;
    if (a.upstream && !b.upstream) return -1;
    return a.name.localeCompare(b.name);
  });
  const lines = sorted.map((i) => {
    const up = i.upstream ? `[${i.upstream.replace(/^https?:\/\//, "").replace(/\.git$/, "")}](${i.upstream})` : "—";
    const src = i.upstreamSource ?? "—";
    const origin = i.remoteOrigin ? i.remoteOrigin.replace(/^https?:\/\//, "") : "—";
    return `| \`${i.name}\` | ${up} | ${src} | ${origin} |`;
  });
  return [header, ...lines].join("\n");
}

function renderReviewSection(infos: DirInfo[]): string {
  // For each dir with no obvious upstream and a GitHub remote, query the
  // GitHub API for `parent.full_name` — that's the canonical upstream for
  // any GitHub fork, no token guessing required. Supplement with the
  // remaining local signals (version markers, verified fingerprints,
  // upstream-sync commit plumbing) for dirs GitHub can't classify.
  const candidates = infos.filter((i) => !i.upstream);
  for (const i of candidates) {
    const sigs: Signal[] = [];
    // GitHub parent fork (the obvious, definitive source)
    if (i.hasGit && i.remoteOrigin) {
      const m = i.remoteOrigin.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (m) {
        const [, owner, repo] = m;
        const parent = queryGithubParent(owner, repo);
        if (parent) {
          sigs.push({
            kind: "github-parent", weight: 3,
            detail: `${owner}/${repo} is a fork of ${parent.full_name} (https://github.com/${parent.full_name})`,
          });
        }
      }
    }
    // Local signals (verified fingerprints, version markers, sync commits)
    const p = join(RANCH_ROOT, i.name);
    const readme = readFullText(join(p, "README.md"), 256_000) ?? readFullText(join(p, "readme.txt"), 256_000);
    if (readme && VERSION_FORK_RE.test(readme)) {
      const m = readme.match(VERSION_FORK_RE);
      if (m) sigs.push({ kind: "version-fork-marker", weight: 1, detail: `version string with +<our-id>.<hash>: ${m[0]}` });
    }
    for (const fv of FINGERPRINT_VARS) {
      const hit = sh(
        `grep -RIl --include='*.ts' --include='*.js' --include='*.py' --include='*.rs' --include='*.go' --include='*.md' -E "${fv}" ${p} 2>/dev/null | head -1`,
      );
      if (hit) { sigs.push({ kind: "fingerprint-var", weight: 1, detail: `internal reference to ${fv} (verified upstream signature)` }); break; }
    }
    if (i.hasGit) {
      const logHit = sh(
        `git -C ${p} log --all --oneline 2>/dev/null | grep -iE 'upstream-pull|upstream-sync|upstream base|record truthful fork base|sync.*upstream' | head -1`,
      );
      if (logHit) sigs.push({ kind: "upstream-sync-commits", weight: 1, detail: logHit });
    }
    i.signals = sigs;
    i.signalTotal = sigs.reduce((s, x) => s + x.weight, 0);
  }
  const ranked = candidates
    .filter((i) => i.signalTotal >= 1)
    .sort((a, b) => b.signalTotal - a.signalTotal);
  if (ranked.length === 0) return "";

  const lines: string[] = [
    "",
    "## Review needed — no obvious upstream, but signals present",
    "",
    "These dirs have no upstream reference in the obvious sources. The signal pass queries **GitHub's `parent.full_name`** (the canonical source for any GitHub fork — no local token guessing) and supplements with verified fingerprints, version markers, and upstream-sync commit plumbing.",
    "",
    "Signal weights: GitHub parent fork +3, version-fork-marker +1, fingerprint-var +1, upstream-sync-commits +1. A `github-parent` hit is a definitive fork-of relation.",
    "",
    "| dir | total | signals |",
    "|---|---|---|",
  ];
  for (const i of ranked) {
    const sigSummary = i.signals.map((s) => `+${s.weight} ${s.kind}`).join(", ");
    lines.push(`| \`${i.name}\` | **${i.signalTotal}** | ${sigSummary} |`);
  }
  lines.push("");
  lines.push("### Per-dir signal trace (top 30 by total)");
  lines.push("");
  for (const i of ranked.slice(0, 30)) {
    lines.push(`- \`${i.name}\` (total **${i.signalTotal}**):`);
    for (const s of i.signals) {
      lines.push(`  - (+${s.weight}) ${s.kind}: ${s.detail}`);
    }
  }
  return lines.join("\n");
}

function queryGithubParent(owner: string, repo: string): { full_name: string; html_url?: string } | null {
  const cacheFile = join(CACHE_DIR, `parent-${owner}-${repo}.json`);
  if (!RESOLVE && existsSync(cacheFile)) {
    try {
      const c = JSON.parse(readFileSync(cacheFile, "utf8"));
      if (c.parent) return c.parent;
    } catch { /* fall through */ }
  }
  try {
    const out = execSync(
      `gh api repos/${owner}/${repo} --jq '{parent: .parent.full_name, parent_url: .parent.html_url, source: .source.full_name, fork: .fork}'`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 10_000 },
    );
    const d = JSON.parse(out);
    const parent = d.parent && d.parent !== "null"
      ? { full_name: d.parent, html_url: d.parent_url }
      : (d.source && d.source !== "null" ? { full_name: d.source, html_url: `https://github.com/${d.source}` } : null);
    writeFileSync(cacheFile, JSON.stringify({ parent, ts: Date.now() }, null, 2));
    return parent;
  } catch {
    return null;
  }
}

function summarize(infos: DirInfo[]): string {
  const withUpstream = infos.filter((i) => i.upstream).length;
  const bySource: Record<string, number> = {};
  for (const i of infos) if (i.upstreamSource) bySource[i.upstreamSource] = (bySource[i.upstreamSource] || 0) + 1;
  return [
    `${infos.length} immediate subdirs; **${withUpstream}** have an obvious upstream reference.`,
    "",
    "By source:",
    ...Object.entries(bySource).map(([k, v]) => `  - **${v}** ${k}`),
  ].join("\n");
}

function main(): void {
  const subs = submodulesFromGitmodules();
  const dirs = listImmediateDirs(RANCH_ROOT);
  const infos = dirs.map((d) => dirInfo(d, subs));

  // First-class GitHub pass: for every dir with a GitHub origin remote, query
  // `parent.full_name` in parallel. Runs unconditionally (uses cache) so the
  // report always has GitHub's view. Cached per (owner, repo) at
  // ~/.cache/ranch-fork-audit/parent-<owner>-<repo>.json
  enrichWithGithubParents(infos);

  const generated = new Date().toISOString();
  const md = `# ranch/* fork audit (generated ${generated})

${summarize(infos)}

${renderTable(infos)}

${renderGithubSection(infos)}

## Sources, in order

1. \`.gitmodules\` path — the canonical submodule entry
2. \`package.json\` / \`Cargo.toml\` / \`pyproject.toml\` / \`go.mod\` — package manifest's \`repository\` field
3. \`README.md\` — first 50KB scanned for \`(upstream X)\`, \`Forked from\`, \`Based on\`, \`Copyright © YYYY <Author> (upstream X)\`, \`Originally from\`
4. \`git remote upstream\` (or non-toxicwind \`origin\`) — the remote URL itself
5. **GitHub \`parent.full_name\`** — for every dir with a GitHub origin (parallel \`gh api\` calls, cached)

## Regenerate

\`\`\`bash
cd <ranch-repo-root>
bun toolkit/audit-forks.ts                    # local + cached GitHub lookups
bun toolkit/audit-forks.ts --resolve-origins  # bust the GitHub cache
\`\`\`
`;
  writeFileSync(join(RANCH_ROOT, "FORKS-report.md"), md);
  writeFileSync(join(RANCH_ROOT, "FORKS-report.json"),
    JSON.stringify({ generated, total: infos.length, withUpstream: infos.filter((i) => i.upstream).length, infos }, null, 2));

  const withUpstream = infos.filter((i) => i.upstream).length;
  console.log(`[done] ${infos.length} dirs, ${withUpstream} with obvious upstream`);
  console.log(`[done] wrote FORKS-report.md / FORKS-report.json`);
}

function enrichWithGithubParents(infos: DirInfo[]): void {
  // Parallel pool (AGENTS.md: read-only work parallelizes maximally).
  const targets = infos.filter((i) => i.remoteOrigin && i.remoteOrigin.includes("github.com/"));
  console.log(`[audit-forks] Scanning ${targets.length} components with GitHub remotes...`);
  const CONCURRENCY = 8;
  let cursor = 0;
  let completed = 0;
  const runWorker = async (): Promise<void> => {
    while (true) {
      const i = cursor++;
      if (i >= targets.length) return;
      const t = targets[i];
      completed++;
      if (completed % 25 === 0 || completed === targets.length) {
        console.log(`[audit-forks] Progress: ${completed}/${targets.length} audited...`);
      }
      const m = t.remoteOrigin!.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (!m) continue;
      const parent = queryGithubParent(m[1], m[2]);
      if (parent) {
        t.signals.push({
          kind: "github-parent", weight: 3,
          detail: `${m[1]}/${m[2]} is a fork of ${parent.full_name} (https://github.com/${parent.full_name})`,
        });
        t.signalTotal = t.signals.reduce((s, x) => s + x.weight, 0);
        if (!t.upstream) {
          t.upstream = `https://github.com/${parent.full_name}`;
          t.upstreamSource = "GitHub parent fork";
        }
      }
    }
  };
  const workers = Array.from({ length: Math.min(CONCURRENCY, targets.length) }, () => runWorker());
  return Promise.all(workers).then(() => undefined) as unknown as void;
}

function renderGithubSection(infos: DirInfo[]): string {
  const withParent = infos.filter((i) => i.signals.some((s) => s.kind === "github-parent"));
  if (withParent.length === 0) return "";
  const lines: string[] = [
    "",
    "## GitHub parent-fork lookups (canonical)",
    "",
    "For every dir with a GitHub origin remote, the audit queried `gh api repos/<owner>/<repo> --jq .parent.full_name` in parallel. This is the **canonical** upstream — GitHub itself records fork-of relations. If a `parent` is reported, this is the upstream. (`--resolve-origins` busts the cache; otherwise the per-repo lookup is cached.)",
    "",
    "| dir | origin | upstream (GitHub parent) |",
    "|---|---|---|",
  ];
  for (const i of withParent.sort((a, b) => a.name.localeCompare(b.name))) {
    const sig = i.signals.find((s) => s.kind === "github-parent");
    const upMatch = sig?.detail.match(/is a fork of ([\w./-]+)/);
    const up = upMatch ? `[${upMatch[1]}](https://github.com/${upMatch[1]})` : "—";
    const origin = i.remoteOrigin ? i.remoteOrigin.replace(/^https?:\/\//, "") : "—";
    lines.push(`| \`${i.name}\` | ${origin} | ${up} |`);
  }
  lines.push("");
  return lines.join("\n");
}

main();
