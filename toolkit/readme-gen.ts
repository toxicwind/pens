#!/usr/bin/env bun
/**
 * readme-gen.ts — MASTER per-pen README generator.
 *
 * THE problem this fixes: make-pen.ts / per-pen templates emit a PLACEHOLDER
 * Products table (`| — |`) that nobody ever fills in, so every pen README
 * drifts into a hand-maintained, inconsistent state. This generator is the
 * single source of truth for pen READMEs: it regenerates each pen's README
 * from live data, with deep GitHub links.
 *
 * Data sources (all live, never hardcoded product rows):
 *   1. pen products.registry.json       — authoritative product list (name + enabled)
 *   2. on-disk products/<name>/.git     — deep GitHub link (git remote origin)
 *   3. pens.yaml olympus_pantheon       — Greek codename repo map (olympus fallback)
 *   4. estate/config/ports.env          — numeric SSOT; `# owner: <product>` attribution
 *   5. product's own README head        — Notes/Role one-liner (descOf convention)
 *
 * Deep-link precedence for a product:
 *   on-disk git remote (credentials SCRUBBED) -> pens.yaml Greek map -> toxicwind/<name>
 *
 * Registry entries that are not real repos (dot-dirs like `.github`, `.claude`,
 * config dirs) are skipped. On-disk product dirs missing from a registry are
 * still included (the registry is stale in places).
 *
 * Usage:
 *   bun toolkit/readme-gen.ts --pen <name>          # regenerate ONE pen's README
 *   bun toolkit/readme-gen.ts --all                 # regenerate every product pen
 *   bun toolkit/readme-gen.ts --dry-run             # print, don't write
 *   bun toolkit/readme-gen.ts --pen <name> --dry-run
 *
 * Control-plane pen `estate` is NEVER touched (its root dirs are live daemon
 * homes referenced by pitchfork). The `pens` root coordinator README is
 * hand-curated and is NOT regenerated here (see README.md at pens root).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const TOOLKIT_DIR = dirname(fileURLToPath(import.meta.url));
const PENS_ROOT = process.env.PENS_ROOT || join(TOOLKIT_DIR, ".."); // pens/
const PORTS_ENV = process.env.PORTS_ENV || join(PENS_ROOT, "estate", "config", "ports.env");
// Conventional port SSOT (replaces the ALL-CAPS ports.env KEYS convention) —
// product-keyed JSON minted by gen-ports.ts, carrying aliases + owner.
const PORTS_JSON = process.env.PORTS_JSON || join(TOOLKIT_DIR, "ports.json");

// ── CLI ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const get = (flag: string): string => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : "";
};
const PEN = get("--pen");
const ALL = argv.includes("--all") || argv.includes("--all-pens");
const DRY_RUN = argv.includes("--dry-run");

// ── Greek pantheon repo map (from pens.yaml data, kept canonical here) ───
const GREEK_REPOS: Record<string, string> = {
  tau: "https://github.com/toxicwind/tau",
  kappa: "https://github.com/toxicwind/kappa-code",
  skopos: "https://github.com/toxicwind/skopos",
  kilo: "https://github.com/toxicwind/kilo",
  muse: "https://github.com/toxicwind/muse-cli",
  keryx: "https://github.com/toxicwind/keryx",
  rhodochrosite: "https://github.com/toxicwind/rhodochrosite",
  kairos: "https://github.com/toxicwind/kairos",
  kryptos: "https://github.com/toxicwind/kryptos",
  agele: "https://github.com/toxicwind/agele",
  pinax: "https://github.com/toxicwind/pinax",
  agon: "https://github.com/toxicwind/agon",
  antilogos: "https://github.com/toxicwind/antilogos",
  pylae: "https://github.com/toxicwind/pylae",
  propylon: "https://github.com/toxicwind/propylon",
  opsis: "https://github.com/toxicwind/opsis",
  didymos: "https://github.com/toxicwind/didymos",
  "chronos-forge": "https://github.com/toxicwind/chronos-forge",
  kleio: "https://github.com/toxicwind/kleio",
  ergane: "https://github.com/toxicwind/ergane",
  hestia: "https://github.com/toxicwind/hestia",
  haos: "https://github.com/toxicwind/haos",
  tarachos: "https://github.com/toxicwind/tarachos",
  morphe: "https://github.com/toxicwind/morphe",
  mneme: "https://github.com/toxicwind/mneme",
  primitives: "https://github.com/toxicwind/primitives",
  opentui: "https://github.com/toxicwind/opentui",
};

// ── Helpers ──────────────────────────────────────────────────────────────
function sh(cmd: string, cwd?: string): string {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch { return ""; }
}

/** Strip credentials (x-access-token:..., user:pass@) from a git URL. */
function scrubUrl(url: string): string {
  return url
    .replace(/^https?:\/\/[^/@]+@/, "https://") // creds@host
    .replace(/\.git$/, "");
}

/** True if `url` is a usable http(s) GitHub-style remote (not a local path/bundle). */
function isHttpRemote(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function githubSlug(url: string): string {
  const clean = scrubUrl(url).replace(/^https?:\/\/(www\.)?github\.com\//, "");
  return clean.replace(/\/$/, "");
}

function isStandaloneRepo(dir: string): boolean {
  if (!existsSync(join(dir, ".git"))) return false;
  try {
    return execSync(`git -C "${dir}" rev-parse --show-toplevel`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() === dir;
  } catch { return false; }
}

function detectLanguage(dir: string): string {
  if (!existsSync(dir)) return "—";
  let entries: string[] = [];
  try { entries = readdirSync(dir); } catch { return "—"; }
  if (entries.includes("Cargo.toml")) return "Rust";
  if (entries.includes("go.mod")) return "Go";
  if (entries.includes("pyproject.toml") || entries.includes("requirements.txt") || entries.includes("setup.py")) return "Python";
  if (entries.includes("package.json") || entries.includes("bun.lock") || entries.includes("bunfig.toml")) return "TypeScript";
  for (const f of entries) {
    if (f.endsWith(".ts") || f.endsWith(".tsx")) return "TypeScript";
    if (f.endsWith(".rs")) return "Rust";
    if (f.endsWith(".go")) return "Go";
    if (f.endsWith(".py")) return "Python";
  }
  const src = join(dir, "src");
  if (existsSync(src)) {
    try { for (const f of readdirSync(src)) {
      if (f.endsWith(".ts") || f.endsWith(".tsx")) return "TypeScript";
      if (f.endsWith(".rs")) return "Rust";
      if (f.endsWith(".py")) return "Python";
    } } catch {}
  }
  return "—";
}

/** First meaningful prose line of a product's own README (descOf convention). */
function productRole(dir: string): string {
  for (const f of ["README.md", "readme.md", "README", "readme.txt"]) {
    const p = join(dir, f);
    if (!existsSync(p)) continue;
    try {
      for (const line of readFileSync(p, "utf8").split("\n")) {
        const l = line.trim();
        if (l.length < 12) continue;
        if (/^([#!<|\[*-]|```)/.test(l)) continue;
        if (l.startsWith("http://") || l.startsWith("https://")) continue;
        return l
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/<[^>]+>/g, "")
          .trim()
          .slice(0, 110)
          .replace(/\|/g, "\\|");
      }
    } catch {}
  }
  return "";
}

/** Read the conventional ports.json registry into { productName -> port[] }.
 *  Source of truth is `toolkit/ports.json` (minted by gen-ports.ts from the
 *  legacy ports.env); the product key maps directly to byOwner, and legacy
 *  ALL-CAPS keys survive in aliases -> byKey for backward-compatible callers. */
function loadPortMap(): { byKey: Record<string, string>; byOwner: Record<string, string[]> } {
  const byKey: Record<string, string> = {};
  const byOwner: Record<string, string[]> = {};
  if (existsSync(PORTS_JSON)) {
    try {
      const reg = JSON.parse(readFileSync(PORTS_JSON, "utf8")) as {
        ports?: Record<string, { port: string | number; owner?: string; aliases?: string[] }>;
      };
      for (const [ownerFromKey, info] of Object.entries(reg.ports ?? {})) {
        const owner = (info.owner || ownerFromKey).toLowerCase().replace(/\s+/g, "-");
        const port = String(info.port);
        if (!byOwner[owner]) byOwner[owner] = [];
        if (!byOwner[owner].includes(port)) byOwner[owner].push(port);
        byKey[ownerFromKey] = port;
        for (const alias of info.aliases ?? []) byKey[alias] = port;
      }
      return { byKey, byOwner };
    } catch {
      // malformed ports.json — fall back to the legacy env parse below
    }
  }
  if (!existsSync(PORTS_ENV)) return { byKey, byOwner };

  const add = (owner: string, port: string) => {
    owner = owner.toLowerCase().replace(/\s+/g, "-");
    if (!byOwner[owner]) byOwner[owner] = [];
    if (!byOwner[owner].includes(port)) byOwner[owner].push(port);
  };

  const lines = readFileSync(PORTS_ENV, "utf8").split("\n");
  // owner comment applies ONLY to the next port line; cleared once consumed /
  // reset each new owner comment / reset on blank line (comment block semantics).
  let pendingOwner: string | null = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") { pendingOwner = null; continue; }
    if (line.startsWith("#")) {
      const owner = line.match(/^\s*#\s*owner:\s*([\w.\-]+)/i);
      if (owner && !trimmed.includes("legacy alias") && !trimmed.includes("deprecated")) {
        pendingOwner = owner[1].toLowerCase();
      }
      continue;
    }
    const kv = line.match(/^\s*([A-Z0-9_]+)=(\d+)\s*(?:#.*)?$/);
    if (kv) {
      const key = kv[1];
      const val = kv[2];
      byKey[key] = val;
      if (pendingOwner) { add(pendingOwner, val); pendingOwner = null; }
      const stem = key.replace(/_PORT$/, "").toLowerCase().replace(/_/g, "-");
      if (stem && stem !== key.toLowerCase()) add(stem, val);
      continue;
    }
    // any other non-comment, non-assignment line breaks owner association
    if (!line.startsWith("#")) pendingOwner = null;
  }
  return { byKey, byOwner };
}

// ── Pen discovery ────────────────────────────────────────────────────────
function listPens(): string[] {
  let top: string[] = [];
  try { top = readdirSync(PENS_ROOT) } catch { return []; }
  const pens: string[] = [];
  for (const name of top) {
    if (name.startsWith(".")) continue;
    const p = join(PENS_ROOT, name);
    try { if (!statSync(p).isDirectory()) continue; } catch { continue; }
    if (name === "estate") continue;          // control-plane pen: NEVER regenerated
    if (name === "pens") continue;            // coordinator superproject: README hand-curated
    if (name === "backups" || name === "archive" || name === "toolkit" || name === "wip" || name === "tmp") continue;
    if (existsSync(join(p, "products.registry.json")) || existsSync(join(p, "products"))) pens.push(name);
  }
  return pens.sort();
}

interface Product {
  name: string;
  enabled: boolean;
  dir: string;
  repoUrl: string;
  lang: string;
  role: string;
  ports: string[];
}

function collectProducts(pen: string): Product[] {
  const root = join(PENS_ROOT, pen);
  const prodDir = join(root, "products");
  const map = new Map<string, { enabled: boolean }>();
  const regPath = join(root, "products.registry.json");
  if (existsSync(regPath)) {
    try {
      const reg = JSON.parse(readFileSync(regPath, "utf8"));
      for (const [name, info] of Object.entries(reg.products ?? {})) {
        map.set(name, { enabled: (info as any).enabled !== false });
      }
    } catch {}
  }
  let onDisk: string[] = [];
  if (existsSync(prodDir)) {
    try { onDisk = readdirSync(prodDir).filter(x => !x.startsWith(".")); } catch {}
  }
  // union: registry (minus dot-config dirs) + on-disk standalone repos
  const names = new Set<string>();
  for (const [n, info] of map) {
    if (n.startsWith(".")) continue; // .github/.claude/.codex etc are not products
    if (!info.enabled) continue;
    names.add(n);
  }
  for (const n of onDisk) {
    if (n.startsWith(".")) continue;
    names.add(n);
  }
  const products: Product[] = [];
  for (const name of [...names].sort((a, b) => a.localeCompare(b))) {
    const dir = join(prodDir, name);
    const isRepo = existsSync(dir) && isStandaloneRepo(dir);
    let repoUrl = "";
    if (isRepo) {
      const remote = scrubUrl(sh(`git -C "${dir}" remote get-url origin`, dir));
      // only usable https/http remotes; local paths / .bundle files / absolute
      // paths smuggled into a github URL are NOT deep links
      if (
        isHttpRemote(remote) &&
        !remote.includes(".bundle") &&
        !remote.includes("/home/") &&
        !remote.includes("/tmp/")
      ) {
        repoUrl = remote;
      }
    }
    if (!repoUrl) repoUrl = GREEK_REPOS[name] || `https://github.com/toxicwind/${name}`;
    const lang = existsSync(dir) ? detectLanguage(dir) : "—";
    const role = existsSync(dir) ? productRole(dir) : "";
    products.push({ name, enabled: true, dir, repoUrl, lang, role, ports: [] });
  }
  // attach ports
  const { byOwner } = loadPortMap();
  for (const p of products) {
    p.ports = byOwner[p.name.toLowerCase()] || byOwner[p.name] || [];
    // fallback: numeric in product repo (config/ports.env or health port) — skip, SSOT only
  }
  return products;
}

// ── README assembly ──────────────────────────────────────────────────────
function titleCase(pen: string): string {
  return pen
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function existingBlurb(root: string): string {
  const p = join(root, "README.md");
  if (!existsSync(p)) return "";
  try {
    const lines = readFileSync(p, "utf8").split("\n");
    // first paragraph after the # title
    let collect = false;
    for (const line of lines) {
      const l = line.trim();
      if (l.startsWith("#")) { collect = true; continue; }
      if (collect && l.length > 12 && !l.startsWith("|") && !l.startsWith(">") && !l.includes("One of the estate")) return l;
    }
  } catch {}
  return "";
}

function existingRetiredNotes(root: string): string[] {
  const p = join(root, "README.md");
  if (!existsSync(p)) return [];
  try {
    return readFileSync(p, "utf8")
      .split("\n")
      .filter(l => l.trim().startsWith("> **Retired") || l.trim().startsWith("> Retired"))
      .map(l => l.trim());
  } catch { return []; }
}

function buildReadme(pen: string): string {
  const root = join(PENS_ROOT, pen);
  const title = titleCase(pen);
  const products = collectProducts(pen);
  const blurb = existingBlurb(root, pen);
  const retired = existingRetiredNotes(root);

  let md = `# ${title}\n\n`;
  if (blurb) md += `${blurb}\n\n`;
  md += `> Part of the estate's pens family (\`pens/{estate,geode,barn,ranch,olympus,...}\`).\n`;
  md += `> Every pen has the same shape: \`products/\` for peer standalone checkouts, \`docs/\` for\n`;
  md += `> pen-owned documentation, and \`bin/\` entrypoints symlinked into \`~/.local/bin\`.\n\n`;
  md += `_README generated by \`pens/toolkit/readme-gen.ts\` — regenerate with \`bun run readme\`.\n`;
  md += `Do not hand-edit the Products table._\n\n`;

  // Products table with deep links
  md += `## Products\n\n`;
  if (!products.length) {
    md += `_No products registered yet._\n\n`;
  } else {
    md += `| Product | GitHub Repo | Port(s) | Language | Role |\n`;
    md += `| --- | --- | --- | --- | --- |\n`;
    for (const p of products) {
      const link = githubSlug(p.repoUrl) ? `[${githubSlug(p.repoUrl)}](${p.repoUrl})` : "—";
      const ports = p.ports.length ? p.ports.join(", ") : "—";
      const role = p.role || "—";
      md += `| **${p.name}** | ${link} | ${ports} | ${p.lang} | ${role} |\n`;
    }
    md += `\n`;
  }

  if (retired.length) {
    md += `## Retired / absorbed\n\n`;
    for (const r of retired) md += `${r}\n`;
    md += `\n`;
  }

  md += `## Layout\n\n`;
  md += "```text\n";
  md += `${pen}/\n`;
  md += `  .gitignore    kitchen-sink \`*\` + whitelist (submoduleless doctrine)\n`;
  md += `  README.md     this file — generated from live data by readme-gen.ts\n`;
  md += `  LICENSE\n`;
  md += `  package.json\n`;
  md += `  mise.toml\n`;
  md += `  AGENTS.md\n`;
  md += `  bin/          entrypoint symlink surface -> ~/.local/bin\n`;
  md += `  products/     peer standalone checkouts (auto-ignored, never tracked)\n`;
  md += `  docs/         pen-owned documentation\n`;
  md += "```\n\n";

  md += `## Tooling\n\n`;
  md += `- **README**: regenerate with \`bun run readme\` (→ \`pens/toolkit/readme-gen.ts\`).\n`;
  md += `- **bin surface**: entrypoints symlinked into \`~/.local/bin\`, pinned by the\n`;
  md += `  estate-ops manifest and verified by \`bin-verify.sh\`. A broken link is a FAIL.\n`;
  md += `- **Full estate README**: \`pens/README.md\` — regenerated by \`pensctl generate-all\`.\n\n`;

  md += `## Conventions\n\n`;
  md += `- Products are **peer standalone checkouts**, referenced-not-owned. This repo\n`;
  md += `  tracks only its own metadata, \`bin/\`, and \`docs/\`.\n`;
  md += `- Daemon ids use **dashes, never underscores** (\`config-naming-conventions.md\`).\n`;
  md += `- Ports are declared in \`pens/estate/config/ports.env\` — that file is the\n`;
  md += `  numeric SSOT; this table reads ports from it via \`# owner:\` attribution.\n`;
  md += `- Runtime language across the estate is **Bun/TypeScript**.\n`;
  md += `- Submoduleless: products are peer clones, never gitlinks (mode 160000).\n\n`;

  md += `## License\n\n`;
  md += `Apache-2.0 unless a product states otherwise. Confidential products keep\n`;
  md += `their own license and their own visibility.\n`;
  return md;
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const pens = PEN ? [PEN] : ALL ? listPens() : [];
  if (!pens.length) {
    console.error(`usage: bun toolkit/readme-gen.ts --pen <name> | --all [--dry-run]`);
    console.error(`pens available: ${listPens().join(", ")}`);
    process.exit(2);
  }
  let wrote = 0, skipped = 0;
  for (const pen of pens) {
    if (pen === "estate" || pen === "pens") {
      console.log(`skip ${pen} (control-plane or coordinator — never auto-regenerated)`);
      skipped++;
      continue;
    }
    const root = join(PENS_ROOT, pen);
    if (!existsSync(root)) { console.log(`skip ${pen} (no dir)`); skipped++; continue; }
    const md = buildReadme(pen);
    if (DRY_RUN) {
      console.log(`\n===== ${pen} =====\n${md}`);
    } else {
      writeFileSync(join(root, "README.md"), md);
      console.log(`✔ regenerated ${pen}/README.md (${collectProducts(pen).length} products)`);
      wrote++;
    }
  }
  console.log(`\n${DRY_RUN ? "DRY-RUN: " : ""}done — ${wrote} written, ${skipped} skipped`);
}
await main();