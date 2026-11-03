#!/usr/bin/env bun
/**
 * toolkit/generate-pens-yaml.ts — the REAL pens.yaml generator.
 * Derives the manifest from live ground truth, never hand-edit:
 *   1. every dir under PENS_ROOT with its own .git  → standalone pen, repo from `git remote`
 *   2. every other dir (no .git)                    → local-dir pen
 *   3. abyss: each pen's private never-publish vault name (theme-coded, see ABYSS_NAMES)
 *   4. olympus_pantheon: derived from live olympus products + remotes
 *   5. ranch_holders: derived from live ranch products + remotes
 *
 * Never stale again: `pensctl doctor` and the pre-commit hook call `--check`,
 * which regenerates to a temp buffer and FAILS (exit 1) on any drift.
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PENS_ROOT = process.env.PENS_ROOT || "/home/toxic/pens";

function sh(cmd: string, cwd?: string): string {
  try {
    const proc = Bun.spawnSync(cmd.split(" "), { cwd, stdout: "pipe", stderr: "pipe" });
    return proc.exitCode === 0 ? proc.stdout.toString().trim() : "";
  } catch {
    return "";
  }
}

/** Clean remote URL: strip credentials, .git suffix, normalize to https. */
function cleanRepo(raw: string): string {
  let u = raw.trim();
  u = u.replace(/^git@github\.com:/, "https://github.com/");
  u = u.replace(/^https?:\/\/[^@/]+@/, "https://");
  u = u.replace(/\.git$/, "");
  return u;
}

function repoOf(dir: string): string {
  const raw = sh("git remote get-url origin", dir);
  if (raw) return cleanRepo(raw);
  return "local-dir";
}

/** Theme-coded private vault names — one "abyss" per pen (fathom's is canonical). */
const ABYSS_NAMES: Record<string, string> = {
  "agentic-moment": "backchannel", // coordination pen: private coordination
  army: "bunker",
  barn: "silo", // farm storage tower, deliberately isolated
  ergasterion: "adytum", // innermost forbidden sanctum of a Greek temple
  estate: "vault", // the manor's underground
  fathom: "abyss", // the ocean trench — canonical
  forge: "crucible", // where molten truth is held
  geode: "mantle", // the molten layer under the crystal cavity
  guide: "marginalia", // a guide's private notes in the margin
  "hatch-kite-cli": "nest",
  mosaic: "tesserae", // the hidden individual tiles
  netrace: "packet-hole",
  olympus: "tartarus", // the pit below the mountain; koiné for "the deepest abyss"
  ranch: "storm-cellar", // the hidden shelter on the range
  recon: "blind", // a hunting blind: observe unseen
  tmp: "none", // scratch, no vault
};

function abyssOf(name: string): string {
  return ABYSS_NAMES[name] ?? "vault";
}

/** Pen-level aliases — names humans habitually type wrong (the hephaistos rule). */
const PEN_ALIASES: Record<string, string[]> = {
  ergasterion: ["egrestrion", "ergastrion", "ergasterium", "workshop"],
  hephaistos: ["hepistos"],
};

function scanPens(root: string): { name: string; local: string; repo: string; git: boolean; abyss: string; aliases?: string[] }[] {
  const out: { name: string; local: string; repo: string; git: boolean; abyss: string; aliases?: string[] }[] = [];
  for (const name of readdirSync(root).sort()) {
    const local = join(root, name);
    let st: ReturnType<typeof statSync>;
    try {
      st = statSync(local);
    } catch {
      continue;
    }
    if (!st.isDirectory() || name.startsWith(".") || name === "archive") continue;
    const git = statSync(join(local, ".git"), { throwIfNoEntry: false }) !== undefined;
    const hasProducts = statSync(join(local, "products"), { throwIfNoEntry: false }) !== undefined;
    const real = git || hasProducts;
    if (!real) continue; // scratch/meta dirs (backups, docs, v1, ...) are never pens
    out.push({ name, local, repo: git ? repoOf(local) : "local-dir", git, abyss: name === "tmp" ? "none" : abyssOf(name), aliases: PEN_ALIASES[name] });
  }
  return out;
}

/** Live olympus pantheon: parse olympus/README.md pantheon rows (codename → repo). */
function scanPantheon(root: string): Record<string, { root: string; meaning: string; local: string; repo: string }> {
  const out: Record<string, { root: string; meaning: string; local: string; repo: string }> = {};
  let readme = "";
  try {
    readme = readFileSync(join(root, "olympus", "README.md"), "utf8");
  } catch {
    return out;
  }
  for (const line of readme.split("\n")) {
    const m = line.match(/^\|\s*\*\*([\w-]+)\*\*\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!m) continue;
    const [_, name, rootWord, meaning] = m;
    const local = join(root, "olympus", "products", name);
    const repo = statSync(join(local, ".git"), { throwIfNoEntry: false }) ? repoOf(local) : `https://github.com/toxicwind/${name}`;
    out[name] = { root: rootWord.trim(), meaning: meaning.trim(), local, repo };
  }
  return out;
}

/** Live ranch holders: group ranch product repos by their role dir naming convention. */
function scanRanchHolders(root: string): Record<string, string[]> {
  const holders: Record<string, string[]> = {};
  const productsDir = join(root, "ranch", "products");
  if (!statSync(productsDir, { throwIfNoEntry: false })) return holders;
  // group by first path segment heuristic is too loose; read ranch/.meta.yaml if present
  try {
    const meta = readFileSync(join(root, "ranch", ".meta.yaml"), "utf8");
    const lines = meta.split("\n");
    let current = "";
    for (const line of lines) {
      const top = line.match(/^([a-z0-9_-]+):\s*(?:#.*)?$/);
      if (top) {
        current = top[1];
        holders[current] = [];
      }
      const repo = line.match(/^\s*-\s*(?:https:\/\/github\.com\/)?([\w.-]+\/[\w.-]+)/);
      if (repo && current) {
        const slug = repo[1].replace(/\.git$/, "");
        holders[current].push(slug.includes("/") ? slug : `toxicwind/${slug}`);
      }
    }
  } catch {
    /* no .meta.yaml */
  }
  return holders;
}

function render(pens: ReturnType<typeof scanPens>, pantheon: ReturnType<typeof scanPantheon>, holders: ReturnType<typeof scanRanchHolders>): string {
  const l: string[] = [];
  l.push("# pens.yaml — AUTO-GENERATED by `pensctl generate-yaml` (from live pen dirs + remotes)");
  l.push("# Do not edit by hand. Regenerate: pensctl generate-yaml");
  l.push("# Drift guard: pensctl doctor --check (fails on any mismatch) + pre-commit hook (2026-11-02).");
  l.push("# `abyss` = the pen's private never-publish vault (theme-coded name; fathom's is canonical).");
  l.push("");
  l.push("pens:");
  for (const p of pens) {
    l.push(`  ${p.name}:`);
    l.push(`    local: ${p.local}`);
    l.push(`    repo: ${p.repo}`);
    l.push(`    abyss: ${p.abyss}`);
    if (p.aliases && p.aliases.length > 0) l.push(`    aliases: [${p.aliases.map((a) => `"${a}"`).join(", ")}]`);
  }
  if (Object.keys(pantheon).length > 0) {
    l.push("");
    l.push("olympus_pantheon:");
    for (const [name, p] of Object.entries(pantheon)) {
      l.push(`  ${name}:`);
      l.push(`    root: ${p.root}`);
      l.push(`    meaning: "${p.meaning}"`);
      l.push(`    local: ${p.local}`);
      l.push(`    repo: ${p.repo}`);
    }
  }
  if (Object.keys(holders).length > 0) {
    l.push("");
    l.push("ranch_holders:");
    for (const [holder, repos] of Object.entries(holders)) {
      l.push(`  ${holder}:`);
      l.push(`    repos:`);
      for (const r of repos) l.push(`      - https://github.com/${r}`);
    }
  }
  return l.join("\n") + "\n";
}

const CHECK = process.argv.includes("--check");
const DRY = process.argv.includes("--dry-run");
const target = join(PENS_ROOT, "pens.yaml");
// Bind the scans once so both render() and the completion log can reference
// them (previously `pens`/`pantheon`/`holders` were undefined at the log —
// the file was written but the CLI exited non-zero, breaking pre-commit).
const PENS_SCAN = scanPens(PENS_ROOT);
const PANTHEON_SCAN = scanPantheon(PENS_ROOT);
const HOLDERS_SCAN = scanRanchHolders(PENS_ROOT);
const content = render(PENS_SCAN, PANTHEON_SCAN, HOLDERS_SCAN);

if (CHECK) {
  let existing = "";
  try {
    existing = readFileSync(target, "utf8");
  } catch { /* missing */ }
  if (existing !== content) {
    console.error("✗ pens.yaml is STALE — run `pensctl generate-yaml` (drift check failed)");
    process.exit(1);
  }
  console.log("✓ pens.yaml is fresh");
  process.exit(0);
}

if (DRY) {
  console.log(content);
  process.exit(0);
}

mkdirSync(PENS_ROOT, { recursive: true });
writeFileSync(target, content, "utf8");
console.log(
  `generated ${target} (${PENS_SCAN.length} pens, ${Object.keys(PANTHEON_SCAN).length} pantheon, ${Object.keys(HOLDERS_SCAN).length} holders)`,
);