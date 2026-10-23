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

// Find the pantheon table by scanning from "## The pantheon" header
const pantheonIdx = olympusReadme.indexOf("## The pantheon");
if (pantheonIdx === -1) {
  console.error("Could not find '## The pantheon' section in olympus/README.md");
  process.exit(1);
}

// Extract the table: all consecutive | lines after the section header
const afterHeader = olympusReadme.slice(pantheonIdx);
const tableLines: string[] = [];
let tableStart = -1;
for (const line of afterHeader.split("\n")) {
  if (tableStart === -1) {
    if (line.trim().startsWith("|")) {
      tableStart = tableLines.length;
    }
  }
  if (line.trim().startsWith("|")) {
    tableLines.push(line);
  } else if (tableStart !== -1) {
    break;
  }
}

if (tableLines.length < 4) {
  console.error("Pantheon table too short in olympus/README.md");
  process.exit(1);
}

const headerRow = tableLines[0];
const sepRow = tableLines[1];
const dataRows = tableLines.slice(2).join("\n");

// Add "GitHub Repo" column before "Status" column
// Count real (non-empty) header body columns (between first and last |)
const rawHeaderCells = headerRow.split("|");
const hBodyCells = rawHeaderCells.slice(1, -1);
let statusInBody = -1;
for (let i = 0; i < hBodyCells.length; i++) {
  if (hBodyCells[i].toLowerCase().includes("status")) {
    statusInBody = i;
    break;
  }
}
const ghBodyIdx = statusInBody >= 0 ? statusInBody : hBodyCells.length - 1;

// Build new header with GitHub Repo column
const newHBody = [...hBodyCells];
newHBody.splice(ghBodyIdx, 0, "GitHub Repo");
const newHeader = "|" + newHBody.map(c => " " + c.trim() + " ").join("|") + "|";

// Sep row
const rawSepCells = sepRow.split("|");
const sBodyCells = rawSepCells.slice(1, -1);
const newSBody = [...sBodyCells];
newSBody.splice(ghBodyIdx, 0, "-------");
const newSep = "|" + newSBody.join("|") + "|";

// Data rows — insert GitHub Repo link before Status column
const newRows = dataRows
  .split("\n")
  .filter(row => row.trim().startsWith("|"))
  .map(row => {
    const rawC = row.split("|");
    const bodyCols = rawC.slice(1, -1);
    // Codename: extract from Greek root cell (bodyCols[1]) which has "(codename)" format
    const greekRoot = bodyCols[1]?.trim() || "";
    const parenMatch = greekRoot.match(/\(([^)]+)\)/);
    const codename = parenMatch ? parenMatch[1].toLowerCase().trim() : (bodyCols[0]?.trim().replace(/[^a-zA-Z0-9-]/g, "") || "");
    const url = `https://github.com/toxicwind/${codename}`;
    const slug = codename;
    const link = `[${slug}](${url})`;
    const newBody = [...bodyCols];
    newBody.splice(ghBodyIdx, 0, link);
    return "|" + newBody.join("|") + "|";
  });

// Rebuild the entire table
const fullTable = [newHeader, newSep, ...newRows].join("\n");
// Replace the old table block with the new one
const oldTableBlock = headerRow + "\n" + sepRow + "\n" + dataRows;
olympusReadme = olympusReadme.replace(oldTableBlock, fullTable);
writeFileSync(OLYMPUS_README, olympusReadme);
console.log("Updated olympus/README.md with GitHub Repo column");

// ── 3. Generate olympus-pantheon.md ──────────────────────────────────────

let pantheonMd = "# Olympus Pantheon — Greek-Coded Products\n\n";
pantheonMd += "Deep GitHub links + local paths for every Greek-coded product.\n\n";
pantheonMd += "| Codename | Meaning | GitHub Repo | Local Path |\n";
pantheonMd += "| --- | --- | --- | --- |\n";

for (const name of GREEK_PRODUCTS) {
  const url = repoMap.get(name)!;
  const slug = url.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const meaning = getMeaning(name);
  pantheonMd += `| **${name}** | ${meaning} | [${slug}](${url}) | \`olympus/products/${name}\` |\n`;
}

writeFileSync(join(PENS_ROOT, "olympus-pantheon.md"), pantheonMd);
console.log("Generated olympus-pantheon.md");

// ── 4. Generate pens.yaml ────────────────────────────────────────────────

// Read ranch .meta.yaml
const metaRaw = readFileSync(RANCH_META, "utf8");
const meta = parseYaml(metaRaw);

const PENS_URLS: Record<string, string> = {
  estate: "https://github.com/toxicwind/estate",
  pens: "https://github.com/toxicwind/pens",
  olympus: "https://github.com/toxicwind/olympus",
  ranch: "https://github.com/toxicwind/ranch",
};

let yaml = "# pens.yaml — AUTO-GENERATED by toolkit/generate-manifest.ts\n";
yaml += "# Do not edit by hand. Regenerate: bun toolkit/generate-manifest.ts\n\n";
yaml += "pens:\n";
for (const [name, url] of Object.entries(PENS_URLS)) {
  yaml += `  ${name}:\n    local: ${join(PENS_ROOT, name)}\n    repo: ${url}\n`;
}
yaml += `  archive:\n    local: ${join(PENS_ROOT, "archive")}\n    repo: local-dir\n`;

yaml += "\nolympus_pantheon:\n";
for (const name of GREEK_PRODUCTS) {
  const url = repoMap.get(name)!;
  const slug = url.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const meaning = getMeaning(name);
  yaml += `  ${name}:\n    root: olympus/products/${name}\n    meaning: "${meaning}"\n    local: ${join(PENS_ROOT, "olympus", "products", name)}\n    repo: ${url}\n`;
}

yaml += "\nranch_holders:\n";
const holderKeys = Object.keys(meta);
for (const holder of holderKeys) {
  const entries = meta[holder] as Record<string, { repo?: string }>;
  const repoUrls = new Set<string>();
  let total = 0;
  if (entries) {
    for (const [k, v] of Object.entries(entries)) {
      total++;
      if (v?.repo) {
        const url = v.repo.replace(/\.git$/, "").replace(/^https?:\/\//, "https://");
        if (url.startsWith("https://github.com/toxicwind/")) {
          repoUrls.add(url);
        } else if (!url.startsWith("./")) {
          repoUrls.add(url);
        }
      }
    }
  }
  yaml += `  ${holder}:\n    components: ${total}\n    repos:\n`;
  for (const r of repoUrls) {
    yaml += `      - ${r}\n`;
  }
}

writeFileSync(join(PENS_ROOT, "pens.yaml"), yaml);
console.log("Generated pens.yaml");

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
