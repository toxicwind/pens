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

const CANONICAL_GREEK_REPOS: Record<string, string> = {
  tau: "https://github.com/toxicwind/tau",
  kappa: "https://github.com/toxicwind/kappa-code",
  skopos: "https://github.com/toxicwind/skopos",
  kilo: "https://github.com/toxicwind/kilo",
  muse: "https://github.com/toxicwind/muse-cli",
  keryx: "https://github.com/toxicwind/keryx",
  hodos: "https://github.com/toxicwind/hodos",
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
};

const GREEK_ROOTS: Record<string, string> = {
  tau: "τ",
  kappa: "κ",
  skopos: "σκοπός",
  kilo: "χίλιοι",
  muse: "μοῦσα",
  keryx: "κῆρυξ",
  hodos: "ὁδός",
  kairos: "καιρός",
  kryptos: "κρυπτός",
  agele: "ἀγέλη",
  pinax: "πίναξ",
  agon: "ἀγών",
  antilogos: "ἀντίλογος",
  pylae: "πύλαι",
  propylon: "πρόπυλον",
  opsis: "ὄψις",
  didymos: "δίδυμος",
  "chronos-forge": "χρόνος",
};


function resolveRepoUrl(name: string): string {
  const canonical = CANONICAL_GREEK_REPOS[name];
  if (canonical) return canonical;
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

// ── 2. Generate clean 18-row pantheon table in olympus/README.md ─────────

// Build pantheon rows
const pantheonRows: string[] = [];
for (const name of GREEK_PRODUCTS) {
  const repoUrl = CANONICAL_GREEK_REPOS[name] ?? `https://github.com/toxicwind/${name}`;
  const cleanUrl = repoUrl.replace(/\.git$/, "");
  const slug = cleanUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
  const link = `[${slug}](${cleanUrl})`;
  const root = GREEK_ROOTS[name] || name;
  const meaning = getMeaning(name);
  pantheonRows.push(`| **${name}** | ${root} | ${meaning} | ${name} | ${link} | live | \`pens/olympus/products/${name}\` |`);
}

// Build the complete olympus/README.md from scratch
let olympusReadme = `# olympus — the home of the Greek-coded products

> olympus is the registry that HOLDS the estate's Greek-coded product lineage —
> the pantheon of named components: τ tau, κ kappa, skopos, kilo, muse, keryx,
> hodos, and their kin. Like \`estate-brain\` holds the persona fleet, olympus
> holds the Greek codename family as one authoritative, categorized whole.

"Where the gods reside."

## The pantheon (the Greek-coded products)

| Codename | Greek root | Meaning | Product | GitHub Repo | Status | Where it lives (Greek pen, Olympus products) |
| --- | --- | --- | --- | --- | --- | --- |
`;
for (const row of pantheonRows) {
  olympusReadme += row + "\n";
}
olympusReadme += `
> **Which is the "Greek pen"?** \`pens/olympus/\` is the Greek pen — it now HOLDS
> the physical Greek-coded products under \`olympus/products/\` (tau, kappa, skopos,
> kilo, muse, keryx, hodos, kairos, kryptos, agele, pinax, agon, antilogos,
> pylae, propylon, opsis, didymos, chronos-forge). The pantheon above maps each
> codename to its authoritative GitHub repo.
`;

writeFileSync(OLYMPUS_README, olympusReadme);
console.log("Generated olympus/README.md with 18-product pantheon table");

// Regenerate olympus-pantheon.md from the pantheon data
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
pantheonMd += "| Codename | Greek root | Meaning | GitHub Repo | Local Path |\n";
pantheonMd += "| --- | --- | --- | --- | --- |\n";

for (const name of GREEK_PRODUCTS) {
  const repoUrl = CANONICAL_GREEK_REPOS[name] ?? `https://github.com/toxicwind/${name}`;
  const cleanUrl = repoUrl.replace(/\.git$/, "");
  const slug = cleanUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
  const link = `[${slug}](${cleanUrl})`;
  const root = GREEK_ROOTS[name] || name;
  const meaning = getMeaning(name);
  pantheonMd += `| **${name}** | ${root} | ${meaning} | ${link} | \`pens/olympus/products/${name}\` |\n`;
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
