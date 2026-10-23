#!/usr/bin/env bun
// ranch/toolkit/audit-submodule-dupes.ts
// Industry-standard Git submodule duplicate and ghost auditor (inspired by repoverse & ghostbuster).
// Identifies:
//  1. Duplicate .gitmodules definitions (exact duplicate entries in config)
//  2. Twin submodule checkouts (multiple paths pinned to the exact same remote repository)
//  3. Ghost submodules (declared in .gitmodules but missing from disk)

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const RANCH_ROOT = "/home/toxic/estate/ranch";
const GITMODULES_PATH = join(RANCH_ROOT, ".gitmodules");

interface SubmoduleEntry {
  section: string;
  path: string;
  url: string;
  canonicalUrl: string;
  existsOnDisk: boolean;
  currentCommit?: string;
}

if (!existsSync(GITMODULES_PATH)) {
  console.error("No .gitmodules found at", GITMODULES_PATH);
  process.exit(1);
}

const content = readFileSync(GITMODULES_PATH, "utf8");
const rawBlocks = content.split(/^\[submodule\s+/m).filter((b) => b.trim());

const entries: SubmoduleEntry[] = [];

for (const b of rawBlocks) {
  const lines = b.split("\n");
  const sectionName = lines[0].replace(/["\]]/g, "").trim();
  let path = "";
  let url = "";

  for (const line of lines.slice(1)) {
    const p = line.match(/^\s*path\s*=\s*(.+)$/);
    if (p) path = p[1].trim();
    const u = line.match(/^\s*url\s*=\s*(.+)$/);
    if (u) url = u[1].trim();
  }

  if (path && url) {
    const diskPath = join(RANCH_ROOT, path);
    const exists = existsSync(diskPath);
    let currentCommit: string | undefined;

    if (exists) {
      try {
        currentCommit = execSync("git rev-parse HEAD", {
          cwd: diskPath,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }).trim();
      } catch {}
    }

    // Normalize canonical URL (strip .git, trailing slashes, protocol variations)
    const canonicalUrl = url
      .replace(/^git@github\.com:/, "https://github.com/")
      .replace(/\.git$/, "")
      .replace(/\/+$/, "");

    entries.push({
      section: sectionName,
      path,
      url,
      canonicalUrl,
      existsOnDisk: exists,
      currentCommit,
    });
  }
}

console.log(`\n📦 Total .gitmodules entries parsed: ${entries.length}\n`);

// 1. Exact path duplicates in .gitmodules
const pathMap: Record<string, SubmoduleEntry[]> = {};
for (const e of entries) {
  (pathMap[e.path] = pathMap[e.path] || []).push(e);
}

const pathDupes = Object.entries(pathMap).filter(([, list]) => list.length > 1);
if (pathDupes.length > 0) {
  console.log(`🚨 Exact Duplicate Path Entries in .gitmodules (${pathDupes.length}):`);
  for (const [p, list] of pathDupes) {
    console.log(`  • Path: \`${p}\` (defined ${list.length} times under sections: ${list.map(x => `"${x.section}"`).join(", ")})`);
  }
  console.log("");
}

// 2. Twin submodules (different paths pointing to the same remote repo)
const urlMap: Record<string, SubmoduleEntry[]> = {};
for (const e of entries) {
  (urlMap[e.canonicalUrl] = urlMap[e.canonicalUrl] || []).push(e);
}

const urlDupes = Object.entries(urlMap).filter(([, list]) => {
  const uniquePaths = new Set(list.map((x) => x.path));
  return uniquePaths.size > 1;
});

if (urlDupes.length > 0) {
  console.log(`🔗 Twin Submodules (Different Paths Pinned to Same Remote URL, ${urlDupes.length}):`);
  for (const [url, list] of urlDupes) {
    console.log(`  • Upstream: ${url}`);
    for (const e of list) {
      const commitInfo = e.currentCommit ? `(commit: ${e.currentCommit.slice(0, 8)})` : "(uninitialized)";
      console.log(`      ↳ \`${e.path}\` ${commitInfo}`);
    }
  }
  console.log("");
}

// 3. Ghost submodules (declared in .gitmodules but missing from disk)
const ghosts = entries.filter((e) => !e.existsOnDisk);
if (ghosts.length > 0) {
  console.log(`👻 Ghost Submodules (In config, missing on disk: ${ghosts.length}):`);
  for (const g of ghosts) {
    console.log(`  • \`${g.path}\` → ${g.url}`);
  }
  console.log("");
}

