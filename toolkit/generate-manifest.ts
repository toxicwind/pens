#!/usr/bin/env bun
// toolkit/generate-manifest.ts
// Reads olympus/README.md + ranch/.meta.yaml and generates:
//   1. olympus/README.md — pantheon table with GitHub Repo column
//   2. olympus-pantheon.md — deep GitHub links for every Greek product
//   3. pens.yaml — manifest with pens/olympus/ranch/estate/ + pantheon + ranch holders

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const PENS_ROOT = process.env.PENS_ROOT || "/home/toxic/pens";
const OLYMPUS_README = join(PENS_ROOT, "olympus", "README.md");
const RANCH_META = join(PENS_ROOT, "ranch", ".meta.yaml");
const OLYMPUS_PRODUCTS = join(PENS_ROOT, "olympus", "products");

function sh(cmd: string, cwd?: string): string {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch { return ""; }
}

// ── 1. Resolve GitHub repo URLs for every Greek product ──────────────────

const GREEK_PRODUCTS = [
  "tau", "kappa", "skopos", "kilo", "muse", "keryx", "hodos",
  "kairos", "kryptos", "agele", "pinax", "agon", "antilogos",
  "pylae", "propylon", "opsis", "didymos", "chronos-forge",
];

function resolveRepoUrl(name: string): string {
  const prodDir = join(OLYMPUS_PRODUCTS, name);
  const url = sh("git remote get-url origin", prodDir);
  if (url) {
    return url.replace(/\.git$/, "").replace(/^https?:\/\/github\.com\//, "https://github.com/");
  }
  return `https://github.com/toxicwind/${name}`;
}

function resolveGitHubLink(name: string): string {
  const url = resolveRepoUrl(name);
  const slug = url.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  return `[${slug}](${url})`;
}

// Resolve all
const repoMap = new Map<string, string>();
for (const name of GREEK_PRODUCTS) {
  repoMap.set(name, resolveRepoUrl(name));
}

// ── 2. Update olympus/README.md — add GitHub Repo column ─────────────────

let olympusReadme = readFileSync(OLYMPUS_README, "utf8");

// Verify table has GitHub Repo column (it should already — we wrote it cleanly)
if (!olympusReadme.includes("GitHub Repo")) {
  console.error("olympus/README.md missing GitHub Repo column — run ./pensctl generate-all to fix");
  process.exit(1);
}

// Regenerate olympus-pantheon.md from the pantheon table in olympus/README.md
const pantheonLines: string[] = [];
let collecting = false;
for (const line of olympusReadme.split("\n")) {
  if (line.includes("## The pantheon")) { collecting = true; continue; }
  if (collecting) {
    if (line.startsWith("|") && line.includes("## ")) break;
    if (line.startsWith("|")) pantheonLines.push(line);
    else if (pantheonLines.length > 0) break;
  }
}

// Generate olympus-pantheon.md with deep GitHub links
let pantheonMd = "# Olympus Pantheon — Greek-Coded Products\n\n";
pantheonMd += "Deep GitHub links + local paths for every Greek-coded product.\n\n";
pantheonMd += "| Codename | Meaning | GitHub Repo | Local Path |\n";
pantheonMd += "| --- | --- | --- | --- |\n";

for (const entry of pantheonLines.slice(2)) {
  // Extract codename from first cell
  const cells = entry.split("|");
  const codenameCell = cells[1]?.trim() || "";
  const codename = codenameCell.replace(/[^a-zA-Z0-9-]/g, "").split(/\s+/)[0] || "";
  const meaning = cells[3]?.trim() || codename;
  // Extract GitHub repo link from column before Status
  const ghCell = cells[5]?.trim() || "";
  const linkMatch = ghCell.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const repoLink = linkMatch ? `[${linkMatch[1]}](${linkMatch[2]})` : ghCell;
  // Extract local path
  const pathCell = cells[cells.length - 1]?.trim() || "";
  const pathMatch = pathCell.match(/`([^`]+)`/);
  const localPath = pathMatch ? pathMatch[1] : "";
  pantheonMd += `| **${codename}** | ${meaning} | ${repoLink} | \`${localPath}\` |\n`;
}

writeFileSync(join(PENS_ROOT, "olympus-pantheon.md"), pantheonMd);
console.log("Generated olympus-pantheon.md");



// ── Helpers ──────────────────────────────────────────────────────────────

function getMeaning(name: string): string {
  const meanings: Record<string, string> = {
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
  return meanings[name] || name;
}

function parseYaml(text: string): Record<string, Record<string, Record<string, string>>> {
  const result: Record<string, Record<string, Record<string, string>>> = {};
  let currentHolder: string | null = null;
  let currentItem: string | null = null;

  for (const line of text.split("\n")) {
    const topLevel = line.match(/^([a-z0-9_-]+):\s*$/);
    if (topLevel) {
      currentHolder = topLevel[1];
      result[currentHolder] = {};
      currentItem = null;
      continue;
    }
    const secondLevel = line.match(/^  "([^"]+)":\s*$/);
    if (secondLevel && currentHolder) {
      currentItem = secondLevel[1];
      result[currentHolder][currentItem] = {};
      continue;
    }
    const kv = line.match(/^    (repo|meaning|root):\s*(.+)$/);
    if (kv && currentItem && currentHolder) {
      result[currentHolder][currentItem][kv[1]] = kv[2].trim();
    }
  }
  return result;
}
