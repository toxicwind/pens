#!/usr/bin/env bun

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, dirname, basename } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const parseYaml = (s: string) => Bun.YAML.parse(s);

const RANCH_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const THEMES = join(RANCH_ROOT, ".meta-themes.yaml");
const MANIFEST = join(RANCH_ROOT, ".meta.yaml");
const GITIGNORE = join(RANCH_ROOT, ".gitignore");

// ---- theme classification: DUMB + DATA-DRIVEN (no monkey-patch) -------------
// The canonical theme map from .meta-themes.yaml. Every array-valued key is a
// HOLDER (a bounded-context column); the `prefixes` block is a WHITELIST-only
// convenience for homogeneous structural containers (nim, websites). The
// generator carries ZERO hardcoded holder name sets, ZERO name/token heuristics:
//   holder = map[path] ?? map[topLevel] ?? prefixWhitelist ?? "general"
// Changes to theme membership are DATA edits (add/move a line in the yaml), never
// a recompile. Grounded in THEME-DESIGN.md (DDD bounded-context context map,
// HiGitClass curated-map>keywords, MUDABlue humans-name, SIGSOFT'19 monorepo).
const themeCfg = parseYaml(readFileSync(THEMES, "utf8")) as Record<
  string,
  string[] | Record<string, string[]>
>;

const HOLDER_ORDER: string[] = Object.keys(themeCfg).filter((k) =>
  Array.isArray(themeCfg[k]),
);
const map = new Map<string, string>();
for (const holder of HOLDER_ORDER)
  for (const p of themeCfg[holder] as string[]) map.set(p, holder);

// Whitelist-only prefixes (structural containers whose members are homogeneous).
// Only these keys are honored; `submodules`/`tools`/`vendor` are NEVER holders.
const prefixCfg = (themeCfg.prefixes ?? {}) as Record<string, string[]>;

// Synthetic peers that are their own repos but not tracked as ranch submodules.
// This is an inventory correction (a repo EXISTS), not a category heuristic.
const SYNTHETIC = ["olympus", "skopos"];

const topLevel = (p: string): string => p.split("/")[0];

function holderOf(path: string): string {
  // exact path -> top-level segment -> prefix whitelist -> "general"
  if (map.has(path)) return map.get(path)!;
  if (map.has(topLevel(path))) return map.get(topLevel(path))!;
  for (const [holder, pfxs] of Object.entries(prefixCfg))
    if (pfxs.some((pf) => path.startsWith(pf))) return holder;
  return "general";
}

// ---- de-submodule peer inventory: ".meta.yaml + theme map + on-disk clones" --
// Repos are PEERS, not gitlinks. The peer inventory is NOT sourced from
// .gitmodules anymore (that file is retired by the de-submodule migration).
// Source order:
//   1. paths already in .meta.yaml (the canonical peer list, preserves URLs)
//   2. any path named in .meta-themes.yaml that is a real standalone on-disk
//      clone (its .git exists) and not already known — a peer the theme map
//      recognizes that was mis-registered under a stale/renamed path
// URLs come from the existing manifest where present, else the repo's own
// `git remote get-url origin`, else a synthetic toxicwind URL.

const manifestYaml = existsSync(MANIFEST) ? readFileSync(MANIFEST, "utf8") : "";
const known = new Map<string, string>();
// Parse .meta.yaml records: a label line ("path":) then a repo: line.
{
  const lines = manifestYaml.split("\n");
  let cur = null;
  for (let i = 0; i < lines.length; i++) {
    const lab = lines[i].match(/^\s+"([^"]+)":\s*$/);
    if (lab) {
      cur = lab[1];
      continue;
    }
    const repo = lines[i].match(/^\s{4}repo:\s*(\S+)\s*$/);
    if (repo && cur) {
      known.set(cur, repo[1]);
      cur = null;
    }
  }
}

// isStandaloneClone: a directory with a .git entry whose toplevel is itself.
function isStandaloneClone(path: string): boolean {
  if (!existsSync(path)) return false;
  let st: any = null;
  try {
    st = statSync(join(path, ".git"));
  } catch {
    return false;
  }
  if (!st) return false;
  try {
    const top = execSync(`git -C "${path}" rev-parse --show-toplevel`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return top === path;
  } catch {
    return false;
  }
}

function remoteOf(path: string): string {
  try {
    const r = execSync(`git -C "${path}" remote get-url origin`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (r) return r;
  } catch {
    /* fall through */
  }
  let full = path.split("/").filter(Boolean).pop() || path;
  full = full.replace(/\.git$/, "");
  return `https://github.com/toxicwind/${full}.git`;
}

// Paths the ranch explicitly does NOT own or reference as peers (nested runtime
// checkouts, vendored source, tool trees). Mirrors the .gitignore exclusions.
const NON_PEER_PATH_PREFIXES = [
  "/vansrouter/",
  "/tau/",
  "/boundless/",
  "/sigma/",
  "/omp-semantic-policy/",
  "/barn/woodpecker/",
  "/gear/",
  "/kitty-mcp-server/",
  "/wezterm/",
  "/wezterm-agent-mcp/",
  "/hodos/",
  "shell/ii/",
  "/android-fleet/nuvio/",
];
function isNonPeer(path: string): boolean {
  return NON_PEER_PATH_PREFIXES.some((p) => path.startsWith(p));
}

const peers = new Map<string, string>();
// 1. preserve the existing .meta.yaml peer list (nothing dropped)
for (const [p, u] of known) peers.set(p, u);
// 2. synthetic
for (const p of SYNTHETIC)
  if (!peers.has(p)) peers.set(p, `https://github.com/toxicwind/${p}.git`);
// 3. theme-named standalone clones not yet known (handles renamed/mis-registered)
for (const holder of HOLDER_ORDER)
  for (const p of themeCfg[holder] as string[]) {
    if (peers.has(p) || isNonPeer(p)) continue;
    if (isStandaloneClone(join(RANCH_ROOT, p)))
      peers.set(p, remoteOf(join(RANCH_ROOT, p)));
  }
// synthetic always wins their URL if overridden
for (const p of SYNTHETIC)
  peers.set(p, `https://github.com/toxicwind/${p}.git`);

const added = [...peers.keys()].filter((p) => !known.has(p)).sort();
const dropped = [...known.keys()].filter((p) => !peers.has(p)).sort();

const byCat = new Map<string, string[]>();
for (const p of [...peers.keys()].sort((a, b) => a.localeCompare(b))) {
  const c = holderOf(p);
  if (!byCat.has(c)) byCat.set(c, []);
  byCat.get(c)!.push(p);
}

// CAT_ORDER is thematic only: the holders in .meta-themes.yaml key order, then
// `general` last. submodules/tools/vendor never appear as a category.
const CAT_ORDER = [...HOLDER_ORDER, "general"];

let y = `# ranch/.meta.yaml — the multi-repo manifest (meta 0.2.22+).\n`;
y += `# Generated from the peer model (meta-themes + on-disk standalone clones) —\n`;
y += `# repos are PEERS, not submodules: each stays an independent clone with its\n`;
y += `# own history. Sync with\n`;
y += `#   meta git update       # clone missing + pull all\n`;
y += `#   meta git status       # per-repo state\n`;
y += `#   meta exec '<cmd>'     # run any command across every component\n`;
y += `# Regenerate: bun toolkit/gen-meta-manifest.ts\n`;
y += `# CATEGORIZED by theme (DATA-DRIVEN from .meta-themes.yaml — see\n`;
y += `# toolkit/THEME-DESIGN.md §2 for the bounded-context holders; "general"\n`;
y += `# is the honest fallback). NO .gitmodules dependency (submodule doctrine is\n`;
y += `# retired — repos are peers). Edit the DATA, never this generator.\n`;
for (const cat of CAT_ORDER) {
  const members = byCat.get(cat);
  if (!members || !members.length) continue;
  y += `\n${cat}:\n`;
  for (const path of members)
    y += `  "${path}":\n    repo: ${peers.get(path)}\n`;
}
writeFileSync(MANIFEST, y);
console.log(
  `wrote ${MANIFEST} with ${peers.size} projects in ${byCat.size} categories ` +
    `(dumb, data-driven, .gitmodules-free)`,
);
if (added.length)
  console.log(
    `added ${added.length} theme-recognized clone peers: ${added.join(", ")}`,
  );
if (dropped.length)
  console.log(`dropped ${dropped.length}: ${dropped.join(", ")}`);
