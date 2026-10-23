#!/usr/bin/env bun
// toolkit/generate-readme.ts
//
// Unified README generator for pens/ (and copied to ranch/).
// Consumes:
//   - FORKS-report.json        (from PENS_ROOT or RANCH_ROOT)
//   - .meta.yaml               (from PENS_ROOT/ranch or RANCH_ROOT)
//   - .meta-themes.yaml        (from PENS_ROOT/ranch or RANCH_ROOT)
//   - olympus/README.md        (from PENS_ROOT/olympus) — pantheon table
//   - .cache/ranch-fork-audit/gh-descriptions.json (from RANCH_ROOT) — optional
//
// Renders:
//   a. Header badges + hero + Table of Contents
//   b. The Four Planes (toxicwind/estate, toxicwind/pens, toxicwind/olympus, toxicwind/ranch)
//   c. Olympus Pantheon — Greek-Coded Products (18) with GitHub Repo deep links
//   d. Monorepo Statistics
//   e. Bounded-Context Holders & Peer Repositories (222 components, 13 categories)
//   f. Full Component Map (flat table)
//   g. Upstream Sources, Languages, Top 10 Largest Dirs, Top Upstreams by Fork Count,
//      Similarity Clusters, Directory Type Breakdown
//   h. Generators & CLI (pensctl + toolkit/)
//
// Usage:
//   bun toolkit/generate-readme.ts --update           # write to PENS_ROOT/README.md
//   bun toolkit/generate-readme.ts --update --ranch    # write to RANCH_ROOT/README.md
//   bun toolkit/generate-readme.ts --dry-run           # print to stdout

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const TOOLKIT_DIR = dirname(fileURLToPath(import.meta.url));

// Resolve roots: if this lives under pens/toolkit/ use pens root; if under
// ranch/toolkit/ use ranch root. Falls back via env.
const PENS_ROOT = process.env.PENS_ROOT || "/home/toxic/pens";
const RANCH_ROOT = process.env.RANCH_ROOT || join(PENS_ROOT, "ranch");

const args = new Set(process.argv.slice(2));
const UPDATE_PENS = args.has("--update") && !args.has("--ranch");
const UPDATE_RANCH = args.has("--ranch");
const DRY_RUN = args.has("--dry-run");

// Determine which README to write
const README_PATH = UPDATE_RANCH
  ? join(RANCH_ROOT, "README.md")
  : join(PENS_ROOT, "README.md");

// Data sources
const FORKS_REPORT = existsSync(join(PENS_ROOT, "FORKS-report.json"))
  ? join(PENS_ROOT, "FORKS-report.json")
  : join(RANCH_ROOT, "FORKS-report.json");
const RANCH_META = existsSync(join(PENS_ROOT, "ranch", ".meta.yaml"))
  ? join(PENS_ROOT, "ranch", ".meta.yaml")
  : join(RANCH_ROOT, ".meta.yaml");
const OLYMPUS_README = join(PENS_ROOT, "olympus", "README.md");
const GH_DESC_CACHE = join(RANCH_ROOT, ".cache", "ranch-fork-audit", "gh-descriptions.json");

// ── Helpers ───────────────────────────────────────────────────────────────

function sh(cmd: string, cwd?: string, timeoutMs = 30_000): string {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: timeoutMs }).trim();
  } catch {
    return "";
  }
}

function detectLanguage(relPath: string, root: string): string {
  const p = join(root, relPath);
  if (!existsSync(p)) return "`—`";

  let entries: string[] = [];
  try {
    entries = readdirSync(p);
  } catch {
    return "`—`";
  }

  // Fast manifest detection
  if (entries.includes("bun.lock") || entries.includes("bunfig.toml")) return "⚡ `Bun`";
  if (entries.includes("Cargo.toml")) return "🦀 `Rust`";
  if (entries.includes("go.mod")) return "🐹 `Go`";
  if (entries.includes("pyproject.toml") || entries.includes("requirements.txt") || entries.includes("setup.py")) return "🐍 `Python`";
  if (entries.includes("package.json")) return "🔷 `TypeScript`";

  // Shallow file extension counters
  const counts: Record<string, number> = { ts: 0, py: 0, rs: 0, go: 0, sh: 0, doc: 0 };
  for (const f of entries) {
    if (f.endsWith(".ts") || f.endsWith(".tsx")) counts.ts++;
    else if (f.endsWith(".py")) counts.py++;
    else if (f.endsWith(".rs")) counts.rs++;
    else if (f.endsWith(".go")) counts.go++;
    else if (f.endsWith(".sh") || f.endsWith(".bash")) counts.sh++;
    else if (f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".yaml")) counts.doc++;
  }

  if (counts.ts > 0) return "🔷 `TypeScript`";
  if (counts.py > 0) return "🐍 `Python`";
  if (counts.rs > 0) return "🦀 `Rust`";
  if (counts.go > 0) return "🐹 `Go`";
  if (counts.sh > 0) return "🐚 `Shell`";
  if (counts.doc > 0) return "📖 `Docs/Data`";

  // Check src/ directory if present
  const srcPath = join(p, "src");
  if (existsSync(srcPath)) {
    try {
      const srcFiles = readdirSync(srcPath);
      if (srcFiles.some(f => f.endsWith(".ts") || f.endsWith(".tsx"))) return "🔷 `TypeScript`";
      if (srcFiles.some(f => f.endsWith(".py"))) return "🐍 `Python`";
      if (srcFiles.some(f => f.endsWith(".rs"))) return "🦀 `Rust`";
      if (srcFiles.some(f => f.endsWith(".go"))) return "🐹 `Go`";
    } catch {}
  }

  return "📁 `Workspace`";
}

function jaccardSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.toLowerCase().split(/\W+/).filter(t => t.length > 2));
  const tokensB = new Set(b.toLowerCase().split(/\W+/).filter(t => t.length > 2));
  let intersection = 0;
  for (const t of tokensA) if (tokensB.has(t)) intersection++;
  const union = (tokensA as any).union ? (tokensA as any).union(tokensB) : new Set([...tokensA, ...tokensB]);
  return union.size === 0 ? 0 : intersection / union.size;
}

function extToLang(ext: string): string {
  const map: Record<string, string> = {
    ts: "TypeScript", js: "JavaScript", py: "Python", rs: "Rust",
    go: "Go", cpp: "C++", c: "C", h: "C/C++", hpp: "C++",
    java: "Java", kt: "Kotlin", swift: "Swift", php: "PHP",
    rb: "Ruby", sh: "Shell", bash: "Shell", zsh: "Shell",
    md: "Markdown", txt: "Text", json: "JSON", yaml: "YAML",
    yml: "YAML", toml: "TOML", xml: "XML", html: "HTML",
    css: "CSS", scss: "SCSS", sass: "Sass", less: "Less",
    sql: "SQL", proto: "Protobuf", thrift: "Thrift",
    dockerfile: "Dockerfile", makefile: "Makefile", cmake: "CMake",
  };
  return map[ext.toLowerCase()] || ext.toUpperCase();
}

// ── Olympus pantheon data ──────────────────────────────────────────────────

const GREEK_PRODUCTS = [
  "tau", "kappa", "skopos", "kilo", "muse", "keryx", "hodos",
  "kairos", "kryptos", "agele", "pinax", "agon", "antilogos",
  "pylae", "propylon", "opsis", "didymos", "chronos-forge",
];

const GREEK_MEANINGS: Record<string, string> = {
  "tau": "Greek letter",
  "kappa": "Greek letter",
  "skopos": "watcher / lookout / scout",
  "kilo": "thousand",
  "muse": "the muse (inspiration)",
  "keryx": "herald",
  "hodos": "way / road",
  "kairos": "the opportune moment",
  "kryptos": "hidden",
  "agele": "herd (of cattle)",
  "pinax": "tablet / catalog",
  "agon": "contest / race",
  "antilogos": "counter-argument / debate",
  "pylae": "gates",
  "propylon": "monumental gateway",
  "opsis": "sight / appearance",
  "didymos": "twin",
  "chronos-forge": "time",
};

function resolveRepoUrl(name: string): string {
  const prodDir = join(PENS_ROOT, "olympus", "products", name);
  const url = sh("git remote get-url origin", prodDir);
  if (url) return url.replace(/\.git$/, "").replace(/^https?:\/\/github\.com\//, "https://github.com/");
  return `https://github.com/toxicwind/${name}`;
}

// ── Parse FORKS-report.json ───────────────────────────────────────────────

interface ForkInfo {
  name: string;
  upstream: string | null;
  upstreamSource: string | null;
  remoteOrigin: string | null;
  hasGit: boolean;
  isSubmodule: boolean;
  sizeBytes: number;
  fileCount: number;
  readmeHead?: string;
}

function enrichReadmeHeads(infos: ForkInfo[]): ForkInfo[] {
  // Enrich with readmeHead from actual README files
  for (const d of infos) {
    if (!d.readmeHead && d.hasGit) {
      for (const f of ["README.md", "readme.md", "README.rst", "README", "readme.txt"]) {
        const path = join(RANCH_ROOT, d.name, f);
        if (existsSync(path)) {
          try {
            d.readmeHead = readFileSync(path, "utf8").slice(0, 500);
          } catch {}
          break;
        }
      }
    }
  }
  return infos;
}

function computeStats(infos: ForkInfo[]) {
  const total = infos.length;
  const withUpstream = infos.filter(i => i.upstream).length;
  const withGit = infos.filter(i => i.hasGit).length;
  const submodules = infos.filter(i => i.isSubmodule).length;
  const totalSize = infos.reduce((s, i) => s + i.sizeBytes, 0);
  const totalFiles = infos.filter(i => i.hasGit).reduce((s, i) => s + i.fileCount, 0);
  const totalSizeGB = (totalSize / 1024 / 1024 / 1024).toFixed(2);

  const bySource: Record<string, number> = {};
  for (const i of infos) if (i.upstreamSource) bySource[i.upstreamSource] = (bySource[i.upstreamSource] || 0) + 1;

  const langStats: Record<string, number> = {};
  for (const i of infos) {
    if (!i.hasGit) continue;
    let out = "";
    try {
      out = execSync(`git -C ${join(RANCH_ROOT, i.name)} ls-files 2>/dev/null`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).trim();
    } catch { continue; }
    if (out) {
      for (const f of out.split("\n")) {
        if (!f) continue;
        const ext = f.split(".").pop() || "";
        if (ext) {
          const lang = extToLang(ext);
          langStats[lang] = (langStats[lang] || 0) + 1;
        }
      }
    }
  }
  return { total, withUpstream, withGit, submodules, totalSizeGB, totalFiles, bySource, langs: langStats };
}

// ── Parse .meta.yaml ──────────────────────────────────────────────────────

interface MetaEntry {
  path: string;
  repo: string;
}

interface MetaCategory {
  holder: string;
  entries: MetaEntry[];
}

function parseMeta(raw: string): MetaCategory[] {
  const categories: MetaCategory[] = [];
  let currentHolder: string | null = null;

  for (const line of raw.split("\n")) {
    const topLevel = line.match(/^([a-z0-9_-]+):\s*$/);
    if (topLevel) {
      currentHolder = topLevel[1];
      categories.push({ holder: currentHolder, entries: [] });
      continue;
    }
    const itemMatch = line.match(/^  "([^"]+)":\s*$/);
    if (itemMatch && currentHolder) {
      continue; // path key, will get repo next
    }
    const repoMatch = line.match(/^    repo:\s*(.+)$/);
    if (repoMatch && currentHolder) {
      const cat = categories[categories.length - 1];
      // Find the last path key for this holder
      const lastPath = line.match(/^[ ]*"([^"]+)"/);
      if (lastPath) {
        cat.entries.push({ path: lastPath[1], repo: repoMatch[1].trim() });
      } else {
        // Use the last known path by re-scanning
        let lastPath = "";
        for (let i = categories.length - 1; i >= 0; i--) {
          // re-parse raw
        }
        cat.entries.push({ path: "?", repo: repoMatch[1].trim() });
      }
    }
  }
  return categories;
}

// Better two-pass parse
function parseMetaV2(raw: string): MetaCategory[] {
  const categories: MetaCategory[] = [];
  let currentHolder: string | null = null;
  let currentItem: string | null = null;

  for (const line of raw.split("\n")) {
    const topLevel = line.match(/^([a-z0-9_-]+):\s*$/);
    if (topLevel) {
      currentHolder = topLevel[1];
      currentItem = null;
      categories.push({ holder: currentHolder, entries: [] });
      continue;
    }
    const itemMatch = line.match(/^  "([^"]+)":\s*$/);
    if (itemMatch && currentHolder) {
      currentItem = itemMatch[1];
      continue;
    }
    const repoMatch = line.match(/^    repo:\s*(.+)$/);
    if (repoMatch && currentItem && currentHolder) {
      const rawRepo = repoMatch[1].trim();
      categories[categories.length - 1].entries.push({ path: currentItem, repo: rawRepo });
    }
  }
  return categories;
}

// ── GitHub description cache ──────────────────────────────────────────────

function loadGhDescCache(): Record<string, string> {
  try {
    if (existsSync(GH_DESC_CACHE)) return JSON.parse(readFileSync(GH_DESC_CACHE, "utf8"));
  } catch {}
  return {};
}

function descOf(path: string, repoUrl: string, infos: ForkInfo[], ghDescCache: Record<string, string>): string {
  const slugMatch = repoUrl.match(/github\.com[\/:]?([^\/]+\/[^\/\.]+)/);
  if (slugMatch) {
    const slug = slugMatch[1].replace(/\.git$/, "");
    if (slug in ghDescCache && ghDescCache[slug]) return ghDescCache[slug];
  }
  const info = infos.find((i) => i.name === path);
  if (info?.readmeHead) {
    const lines = info.readmeHead.split("\n").map((l: string) => l.trim());
    const first = lines.find((l: string) => {
      if (l.length < 15) return false;
      if (/^([#!<|\[*-]|\`\`\`)/.test(l)) return false;
      if (l.startsWith("http://") || l.startsWith("https://")) return false;
      return true;
    });
    if (first) {
      return first
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\`([^\`]+)\`/g, "$1")
        .replace(/<[^>]+>/g, "")
        .trim()
        .slice(0, 110)
        .replace(/\|/g, "\\|");
    }
  }
  return "";
}

function githubRepoLink(repoUrl: string): string {
  const cleanUrl = repoUrl.replace(/\.git$/, "");
  const slug = cleanUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
  if (!slug) return repoUrl;
  return `[${slug}](${cleanUrl})`;
}

// ── Build README ──────────────────────────────────────────────────────────

function buildReadme(): string {
  const now = new Date().toLocaleString();
  let md = "";

  // ── a. Header badges + hero + TOC ────────────────────────────────────
  md += `<div align="center">\n\n`;
  md += `[![ci](https://github.com/toxicwind/pens/actions/workflows/ci.yml/badge.svg)](https://github.com/toxicwind/pens/actions/workflows/ci.yml)\n`;
  md += `[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)\n`;
  md += `[![stars](https://github.com/toxicwind/pens/stargazers)](https://github.com/toxicwind/pens/stargazers)\n`;
  md += `[![bun](https://img.shields.io/badge/bun-1.4.4-f9f1e1?logo=bun)](https://bun.sh)\n`;
  md += `[![mise](https://img.shields.io/badge/toolchains-mise-ffd55a)](https://mise.jdx.dev)\n\n`;
  md += `# pens\n\n`;
  md += `The **pens** organization — a pointer superproject that tracks the four planes of the self-hosted AI estate. One directory per component, every peer repo lives at [`+ "https://github.com/toxicwind" + `](https://github.com/toxicwind). The whole mesh on one box.\n\n`;

  // Table of Contents
  md += `<details>\n<summary><b>Table of Contents</b></summary>\n<ol>\n`;
  md += `<li><a href="#-the-four-planes">The Four Planes</a></li>\n`;
  md += `<li><a href="#-%EF%B8%8F-olympus-pantheon-greek-coded-products-18">Olympus Pantheon (18)</a></li>\n`;
  md += `<li><a href="#-monorepo-statistics">Monorepo Statistics</a></li>\n`;
  md += `<li><a href="#-bounded-context-holders-peer-repositories">Bounded-Context Holders (222)</a></li>\n`;
  md += `<li><a href="#-full-component-map">Full Component Map</a></li>\n`;
  md += `<li><a href="#-upstream-sources">Upstream Sources</a></li>\n`;
  md += `<li><a href="#-languages-by-tracked-files">Languages</a></li>\n`;
  md += `<li><a href="#-top-10-largest-directories">Top 10 Largest Dirs</a></li>\n`;
  md += `<li><a href="#-top-upstreams-by-fork-count">Top Upstreams</a></li>\n`;
  md += `<li><a href="#-similarity-clusters-readme-based">Similarity Clusters</a></li>\n`;
  md += `<li><a href="#-directory-type-breakdown">Directory Type Breakdown</a></li>\n`;
  md += `<li><a href="#-generators--cli-pensctl--toolkit">Generators & CLI</a></li>\n`;
  md += `</ol>\n</details>\n\n`;
  md += `---\n\n`;

  // ── b. The Four Planes ───────────────────────────────────────────────
  md += `## 🏛️ The Four Planes\n\n`;
  md += `| Plane | GitHub | Local Path | Role |\n`;
  md += `| --- | --- | --- | --- |\n`;
  md += `| [**estate**](https://github.com/toxicwind/estate) | [`+ "toxicwind/estate](https://github.com/toxicwind/estate)"+ ` | \`/home/toxic/estate\` | Control plane & deploy plane |\n`;
  md += `| [**pens**](https://github.com/toxicwind/pens) | [`+ "toxicwind/pens](https://github.com/toxicwind/pens)"+ ` | \`/home/toxic/pens\` | Pointer superproject + registry |\n`;
  md += `| [**olympus**](https://github.com/toxicwind/olympus) | [`+ "toxicwind/olympus](https://github.com/toxicwind/olympus)"+ ` | \`/home/toxic/pens/olympus\` | Greek-coded products registry |\n`;
  md += `| [**ranch**](https://github.com/toxicwind/ranch) | [`+ "toxicwind/ranch](https://github.com/toxicwind/ranch)"+ ` | \`/home/toxic/pens/ranch\` | Bounded-context peer repos |\n\n`;

  // ── c. Olympus Pantheon (18 Greek products) ──────────────────────────
  md += `## ⚡ Olympus Pantheon — Greek-Coded Products (18)\n\n`;
  md += `| Codename | Greek Root | Meaning | Stack / Lang | GitHub Repo | Local Path |\n`;
  md += `| --- | --- | --- | --- | --- | --- |\n`;

  for (const name of GREEK_PRODUCTS) {
    const repoUrl = resolveRepoUrl(name);
    const cleanUrl = repoUrl.replace(/\.git$/, "");
    const slug = cleanUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
    const link = `[${slug}](${cleanUrl})`;
    const meaning = GREEK_MEANINGS[name] || name;
    const lang = detectLanguage(join("olympus", "products", name), PENS_ROOT);
    md += `| **${name}** | ${name} | ${meaning} | ${lang} | ${link} | \`olympus/products/${name}\` |\n`;
  }
  md += `\n`;

  // ── d. Monorepo Statistics ───────────────────────────────────────────
  md += `## 📊 Monorepo Statistics (generated ${now})\n\n`;

  let reportData: any = {};
  let infos: ForkInfo[] = [];
  try {
    reportData = JSON.parse(readFileSync(FORKS_REPORT, "utf8"));
    infos = enrichReadmeHeads(reportData.infos as ForkInfo[]);
  } catch {
    md += `*(FORKS-report.json not found — run \`bun toolkit/audit-forks.ts\` first)*\n\n`;
  }

  const stats = infos.length ? computeStats(infos) : null;

  if (stats) {
    md += `| Metric | Value |\n| --- | --- |\n`;
    md += `| Total directories | ${stats.total} |\n`;
    md += `| Directories with obvious upstream | ${stats.withUpstream} / ${stats.total} (${((stats.withUpstream / stats.total) * 100).toFixed(1)}%) |\n`;
    md += `| Git-tracked directories | ${stats.withGit} |\n`;
    md += `| Components (peer repos) | ${stats.submodules} |\n`;
    md += `| Total size | ${stats.totalSizeGB} GB |\n`;
    md += `| Total tracked files | ${stats.totalFiles.toLocaleString()} |\n\n`;
  } else {
    md += `*(no report data)*\n\n`;
  }

  // ── e. Bounded-Context Holders (222 components, 13 categories) ───────
  md += `## 🤠 Bounded-Context Holders & Peer Repositories\n\n`;
  md += `Parsed from \`ranch/.meta.yaml\` + \`.meta-themes.yaml\` — all peer repos enriched with `+ "`detectLanguage`"+ ` + descriptions from `+ "`FORKS-report.json`"+ ` and GitHub API cache.\n\n`;

  try {
    const metaRaw = readFileSync(RANCH_META, "utf8");
    const meta = parseMetaV2(metaRaw);
    const ghDescCache = loadGhDescCache();
    let totalComponents = 0;

    for (const cat of meta) {
      totalComponents += cat.entries.length;
      md += `<details>\n<summary><b>${cat.holder}</b> — ${cat.entries.length} peer repositories</summary>\n\n`;
      md += `| Component | Stack / Lang | GitHub Repo | Description |\n| --- | --- | --- | --- |\n`;

      for (const entry of cat.entries) {
        const lang = detectLanguage(entry.path, RANCH_ROOT);
        const link = githubRepoLink(entry.repo);
        const desc = descOf(entry.path, entry.repo, infos, ghDescCache);
        md += `| \`${entry.path}\` | ${lang} | ${link} |${desc ? " " + desc + " |" : " — |"}\n`;
      }

      md += `\n</details>\n\n`;
    }

    md += `**Total: ${meta.length} categories, ${totalComponents} components.**\n\n`;
  } catch (e) {
    md += `*(\`.meta.yaml\` not readable)*\n\n`;
  }

  // ── f. Full Component Map (flat) ─────────────────────────────────────
  md += `## 🗂️ Full Component Map\n\n`;
  md += `Flat table of all peer repos: Path · Holder · Stack/Lang · GitHub Repo · Upstream · Description.\n\n`;
  md += `| Component | Holder | Stack / Lang | GitHub Repo | Upstream | Description |\n`;
  md += `| --- | --- | --- | --- | --- | --- |\n`;

  if (infos.length) {
    try {
      const metaRaw = readFileSync(RANCH_META, "utf8");
      const meta = parseMetaV2(metaRaw);
      const ghDescCache = loadGhDescCache();

      // Build holder map
      const holderMap = new Map<string, string>();
      for (const cat of meta) {
        for (const entry of cat.entries) {
          holderMap.set(entry.path, cat.holder);
        }
      }

      const sorted = [...infos].sort((a, b) => a.name.localeCompare(b.name));
      for (const info of sorted) {
        const holder = holderMap.get(info.name) || "general";
        const lang = info.hasGit ? detectLanguage(info.name, RANCH_ROOT) : "📁 `Workspace`";
        const repoLink = info.remoteOrigin
          ? githubRepoLink(info.remoteOrigin)
          : info.upstream
            ? githubRepoLink(info.upstream)
            : "`—`";
        const upstream = info.upstream
          ? githubRepoLink(info.upstream)
          : "`—`";
        const desc = descOf(info.name, info.remoteOrigin || info.upstream || "", infos, ghDescCache);
        md += `| \`${info.name}\` | ${holder} | ${lang} | ${repoLink} | ${upstream} |${desc ? " " + desc + " |" : " — |"}\n`;
      }
    } catch {
      md += `*(flat map requires .meta.yaml)*\n`;
    }
  } else {
    md += `*(no report data)*\n`;
  }
  md += `\n`;

  // ── g. Upstream Sources ─────────────────────────────────────────────
  if (stats) {
    md += `## 🔭 Upstream Sources\n\n`;
    md += `| Source | Count |\n| --- | --- |\n`;
    for (const [src, count] of Object.entries(stats.bySource).sort((a, b) => b[1] - a[1])) {
      md += `| ${src} | ${count} |\n`;
    }
    md += `\n`;

    // Languages
    md += `## 🌐 Languages (by tracked files)\n\n`;
    md += `| Language | Files |\n| --- | --- |\n`;
    for (const [lang, count] of Object.entries(stats.langs).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
      md += `| ${lang} | ${count.toLocaleString()} |\n`;
    }
    md += `\n`;

    // Top 10 Largest
    md += `## 📦 Top 10 Largest Directories\n\n`;
    md += `| Directory | Size | Files | Upstream |\n| --- | --- | --- | --- |\n`;
    const topDirs = [...infos].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 10);
    for (const d of topDirs) {
      const sizeMB = (d.sizeBytes / 1024 / 1024).toFixed(1);
      const upstream = d.upstream ? d.upstream.replace(/^https?:\/\//, "").replace(/\.git$/, "") : "—";
      md += `| \`${d.name}\` | ${sizeMB} MB | ${d.fileCount.toLocaleString()} | ${upstream} |\n`;
    }
    md += `\n`;

    // Top Upstreams by Fork Count
    md += `## 🔮 Top Upstreams by Fork Count\n\n`;
    md += `| Upstream | Forks |\n| --- | --- |\n`;
    const upstreamCounts: Record<string, number> = {};
    for (const i of infos) {
      if (i.upstream) {
        upstreamCounts[i.upstream] = (upstreamCounts[i.upstream] || 0) + 1;
      }
    }
    const topUpstreams = Object.entries(upstreamCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    for (const [url, count] of topUpstreams) {
      const name = url.replace(/^https?:\/\//, "").replace(/\.git$/, "");
      md += `| [${name}](${url}) | ${count} |\n`;
    }
    md += `\n`;

    // Similarity Clusters
    md += `## 🔲 Similarity Clusters (README-based)\n\n`;
    md += `Directories with similar README content (Jaccard on first 500 chars):\n\n`;
    md += `| Dir A | Dir B | Similarity |\n| --- | --- | --- |\n`;
    const similarities: Array<{a: string, b: string, score: number}> = [];
    const infosWithReadme = infos.filter(i => i.readmeHead && i.readmeHead.length > 20);
    for (let i = 0; i < infosWithReadme.length; i++) {
      for (let j = i + 1; j < infosWithReadme.length; j++) {
        const score = jaccardSimilarity(infosWithReadme[i].readmeHead || "", infosWithReadme[j].readmeHead || "");
        if (score > 0.3) similarities.push({a: infosWithReadme[i].name, b: infosWithReadme[j].name, score});
      }
    }
    similarities.sort((a, b) => b.score - a.score);
    for (const s of similarities.slice(0, 10)) {
      md += `| \`${s.a}\` | \`${s.b}\` | ${(s.score * 100).toFixed(1)}% |\n`;
    }
    md += `\n`;

    // Directory Type Breakdown
    md += `## 📁 Directory Type Breakdown\n\n`;
    md += `| Type | Count |\n| --- | --- |\n`;
    const types = {
      "Submodule": infos.filter(i => i.isSubmodule).length,
      "Fork (ours)": infos.filter(i => i.hasGit && i.remoteOrigin?.includes("toxicwind")).length,
      "Upstream mirror": infos.filter(i => i.hasGit && !i.remoteOrigin?.includes("toxicwind") && i.upstream).length,
      "Fork (ours, no upstream)": infos.filter(i => i.hasGit && i.remoteOrigin?.includes("toxicwind") && !i.upstream).length,
      "Upstream mirror (no upstream)": infos.filter(i => i.hasGit && !i.remoteOrigin?.includes("toxicwind") && !i.upstream).length,
      "Vendored (active)": infos.filter(i => !i.hasGit && i.sizeBytes > 50000 && i.readmeHead).length,
      "Vendored (snapshot)": infos.filter(i => !i.hasGit && i.sizeBytes > 50000 && !i.readmeHead).length,
      "Experimental": infos.filter(i => !i.hasGit && i.sizeBytes > 0 && i.sizeBytes <= 50000).length,
      "Stub/Empty": infos.filter(i => !i.hasGit && i.sizeBytes === 0).length,
    };
    for (const [type, count] of Object.entries(types).filter(([, c]) => c > 0)) {
      md += `| ${type} | ${count} |\n`;
    }
    md += `\n`;
  }

  // ── h. Generators & CLI ─────────────────────────────────────────────
  md += `## 🛠️ Generators & CLI (`+ "`pensctl`"+ ` + `+ "`toolkit/`"+ `)\n\n`;
  md += `| Command | Description |\n`;
  md += `| --- | --- |\n`;
  md += `| `+ "`bun toolkit/generate-readme.ts --update`"+ ` | Regenerate this README at `+ "`README.md`"+ ` |\n`;
  md += `| `+ "`bun toolkit/generate-readme.ts --update --ranch`"+ ` | Regenerate ranch README at `+ "`ranch/README.md`"+ ` |\n`;
  md += `| `+ "`bun toolkit/generate-manifest.ts`"+ ` | Generate `+ "`pens.yaml`"+ `, `+ "`olympus/README.md`"+ ` (with GitHub Repo column), and `+ "`olympus-pantheon.md`"+ ` |\n`;
  md += `| `+ "`bun toolkit/gen-meta-manifest.ts`"+ ` | Regenerate `+ "`ranch/.meta.yaml`"+ ` from peer model |\n`;
  md += `| `+ "`bun toolkit/audit-forks.ts`"+ ` | Run fork audit → `+ "`FORKS-report.json`"+ ` |\n`;
  md += `| `+ "`bun toolkit/audit-submodule-dupes.ts`"+ ` | Audit duplicate submodule references |\n`;
  md += `| `+ "`./pensctl generate-all`"+ ` | Run `+ "`generate-ignore`"+ ` + manifest + readme |\n`;
  md += `| `+ "`./pensctl generate-ignore`"+ ` | Regenerate `+ "`.gitignore`"+ ` (pointer superproject `+ "`*`"+ ` ignore) |\n`;
  md += `| `+ "`./pensctl generate-yaml`"+ ` | Generate `+ "`pens.yaml`"+ ` from live pen dirs |\n`;
  md += `| `+ "`./pensctl generate-pantheon`"+ ` | Generate `+ "`olympus-pantheon.md`"+ ` from registry |\n`;
  md += `| `+ "`./pensctl doctor`"+ ` | Health check: pens root git-less per-dir, no stray tracked content |\n\n`;

  // Footer
  md += `_Do not edit this file directly — it is generated from `+ "`FORKS-report.json`"+ ` + `+ "`.meta.yaml`"+ ` + `+ "`olympus/README.md`"+ `._\n`;
  md += `_Run `+ "`bun toolkit/generate-readme.ts --update`"+ ` (or `+ "`./pensctl generate-all`"+ `) to regenerate._\n`;

  return md;
}

// ── Main ──────────────────────────────────────────────────────────────────

const readme = buildReadme();

if (DRY_RUN) {
  console.log(readme);
} else if (UPDATE_PENS) {
  writeFileSync(README_PATH, readme);
  console.log("Updated", README_PATH);
} else if (UPDATE_RANCH) {
  writeFileSync(README_PATH, readme);
  console.log("Updated", README_PATH);
} else {
  // Default: write pens root
  writeFileSync(README_PATH, readme);
  console.log("Updated", README_PATH);
}
