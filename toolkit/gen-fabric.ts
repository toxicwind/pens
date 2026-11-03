#!/usr/bin/env bun
/**
 * gen-fabric.ts — mint the fabric.json service catalog.
 *
 * Reads per-pen products.registry.json (SSOT) + on-disk standalone repos,
 * enriches each product with live git HEAD + dirty count (kernel truth).
 * Contract mirrors readme-gen.ts listPens()/readProducts().
 *
 * Usage: bun gen-fabric.ts [--out /path/fabric.json]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const PENS_ROOT = process.env.PENS_ROOT ?? "/home/toxic/pens";
const SKIP = new Set(["estate", "pens", "backups", "archive", "toolkit", "wip", "tmp"]);

interface ProductEntry { name: string; repo?: string; head?: string; dirty?: number; aliases?: string[]; }
interface PenEntry { pen: string; products: ProductEntry[]; }

export function listPens(root: string = PENS_ROOT, skip: Set<string> = SKIP): string[] {
  let entries: string[] = [];
  try { entries = readdirSync(root); } catch { return []; }
  const out: string[] = [];
  for (const name of entries) {
    if (name.startsWith(".") || skip.has(name)) continue;
    const p = join(root, name);
    try {
      if (!existsSync(join(p, "products")) && !existsSync(join(p, "products.registry.json"))) continue;
    } catch { continue; }
    out.push(name);
  }
  return out.sort();
}

export function readProducts(pen: string, root: string = PENS_ROOT): ProductEntry[] {
  const regPath = join(root, pen, "products.registry.json");
  const seen = new Map<string, ProductEntry>();
  if (existsSync(regPath)) {
    try {
      const reg = JSON.parse(readFileSync(regPath, "utf8")) as { products?: Record<string, unknown> };
      for (const [name, info] of Object.entries(reg.products ?? {})) {
        if (name.startsWith(".")) continue;
        const enabled = typeof info === "object" && info !== null ? (info as { enabled?: boolean }).enabled : undefined;
        if (enabled === false) continue;
        const repo = typeof info === "object" && info !== null ? (info as { repo?: string }).repo : undefined;
        const aliases = typeof info === "object" && info !== null ? (info as { aliases?: string[] }).aliases : undefined;
        seen.set(name, { name, repo, aliases });
      }
    } catch { /* malformed registry */ }
  }
  const prodDir = join(root, pen, "products");
  const onDisk = new Set<string>();
  if (existsSync(prodDir)) {
    try {
      for (const n of readdirSync(prodDir)) {
        if (n.startsWith(".")) continue;
        onDisk.add(n);
        const existing = seen.get(n);
        seen.set(n, existing ?? { name: n });
      }
    } catch { /* unreadable */ }
  }
  // Flat pens (ergasterion, cherish-style): products sit at pen root, not products/.
  // Detect standalone git dirs at pen root so registry rows for them are never
  // mis-marked as aliasOf remnants.
  try {
    for (const n of readdirSync(join(root, pen))) {
      if (n.startsWith(".")) continue;
      if (onDisk.has(n)) continue;
      if (existsSync(join(root, pen, n, ".git"))) onDisk.add(n);
    }
  } catch { /* unreadable */ }
  const out: ProductEntry[] = [];
  for (const entry of seen.values()) {
    // Registry remnant without an on-disk checkout = a pure alias row
    // (e.g. `xerj` -> argos, `pairs` -> lapidary). Resolvable, never a product.
    if (!onDisk.has(entry.name) && entry.aliases && entry.aliases.length > 0) {
      entry.aliasOf = entry.aliases[0];
    }
    const gitDir = existsSync(join(root, pen, "products", entry.name))
      ? join(root, pen, "products", entry.name)
      : join(root, pen, entry.name);
    if (existsSync(join(gitDir, ".git"))) {
      entry.head = headOf(gitDir);
      entry.dirty = dirtyCount(gitDir);
    }
    out.push(entry);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function headOf(repo: string): string | undefined {
  try { return execSync("git rev-parse --short HEAD", { cwd: repo }).toString().trim(); } catch { return undefined; }
}

function dirtyCount(repo: string): number | undefined {
  try {
    return Number(execSync("git status --porcelain", { cwd: repo }).toString().split("\n").filter(Boolean).length);
  } catch { return undefined; }
}

export function buildFabric(root: string = PENS_ROOT): { minted_at: string; pens: PenEntry[] } {
  return { minted_at: new Date().toISOString(), pens: listPens(root).map((pen) => ({ pen, products: readProducts(pen, root) })) };
}

if (import.meta.main) {
  const arg = process.argv.slice(2);
  const outFlag = arg.indexOf("--out");
  const outPath = outFlag >= 0 ? arg[outFlag + 1] : join(PENS_ROOT, "toolkit", "fabric.json");
  const fabric = buildFabric();
  writeFileSync(outPath, JSON.stringify(fabric, null, 2));
  console.log(`wrote ${outPath} (${fabric.pens.length} pens, ${fabric.pens.reduce((n, p) => n + p.products.length, 0)} products)`);
}
