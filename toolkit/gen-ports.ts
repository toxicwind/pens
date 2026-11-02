#!/usr/bin/env bun
/**
 * gen-ports.ts — replace the ports.env ALL_CAPS-KEY convention with a
 * conventional `ports.json` registry (lowercase product keys, structured owner,
 * preserved aliases). Per the 2026-11-01 fabric plan decision: "scrap the
 * ports.env KEYS convention".
 *
 * Reads pens/estate/config/ports.env once and mints ports.json with the shape:
 *   { "minted_at": ISO, "ports": {
 *     "<service>": { "port": 25100, "owner": "<product>", "aliases": ["HERD_PORT"] }
 *   } }
 * The keystone for each port is the FIRST (canonical) KEY; every later key
 * aliasing the same value becomes an `aliases` entry. `# owner:` comments are
 * captured as owner. All-caps symbols are dropped — callers look services up by
 * lowercase name, the same contract products.registry.json uses.
 *
 * Usage: bun gen-ports.ts [--out /path/ports.json]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PENS_ROOT = process.env.PENS_ROOT ?? "/home/toxic/pens";
const PORTS_ENV = join(PENS_ROOT, "estate", "config", "ports.env");

interface PortEntry { port: string; owner: string; aliases: string[]; }

export function parsePortsEnv(text: string): { portByValue: Map<string, PortEntry>; keyByValue: Map<string, string[]> } {
  const canonicalByValue = new Map<string, string>(); // value -> canonical key
  const ownerByValue = new Map<string, string>();
  const allKeys = new Map<string, string[]>(); // value -> all keys
  let pendingOwner: string | null = null;

  const canonical = (key: string, value: string): void => {
    if (!canonicalByValue.has(value)) canonicalByValue.set(value, key);
    const keys = allKeys.get(value) ?? [];
    if (!keys.includes(key)) { keys.push(key); allKeys.set(value, keys); }
  };

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "") { pendingOwner = null; continue; }
    if (line.startsWith("#")) {
      const m = line.match(/^\s*#\s*owner:\s*([\w.\-]+)/i);
      if (m && !trimmed.includes("legacy alias") && !trimmed.includes("deprecated")) pendingOwner = m[1].toLowerCase();
      continue;
    }
    const kv = line.match(/^\s*([A-Z0-9_]+)=(\d+)\s*(?:#.*)?$/);
    if (kv) {
      canonical(kv[1], kv[2]);
      if (pendingOwner && !ownerByValue.has(kv[2])) ownerByValue.set(kv[2], pendingOwner);
      pendingOwner = null;
      continue;
    }
    if (!line.startsWith("#")) pendingOwner = null;
  }

  const out = new Map<string, PortEntry>();
  for (const [value, entries] of allKeys) {
    const canonicalKey = canonicalByValue.get(value) ?? entries[0];
    const stem = canonicalKey.replace(/_PORT$/, "").toLowerCase().replace(/_/g, "-");
    const owner = ownerByValue.get(value) ?? stem;
    const aliases = entries.filter((k) => k !== canonicalKey);
    out.set(stem, { port: value, owner, aliases });
  }
  return { portByValue: out, keyByValue: allKeys };
}

export function buildPortsJson(text: string): { minted_at: string; ports: Record<string, PortEntry> } {
  const { portByValue } = parsePortsEnv(text);
  const ports: Record<string, PortEntry> = {};
  for (const [key, entry] of portByValue) ports[key] = entry;
  return { minted_at: new Date().toISOString(), ports };
}

const arg = process.argv.slice(2);
const outFlag = arg.indexOf("--out");
const outPath = outFlag >= 0 ? arg[outFlag + 1] : join(PENS_ROOT, "toolkit", "ports.json");

if (!existsSync(PORTS_ENV)) {
  console.error(`ports.env not found at ${PORTS_ENV}`);
  process.exit(1);
}
const json = buildPortsJson(readFileSync(PORTS_ENV, "utf8"));
writeFileSync(outPath, JSON.stringify(json, null, 2));
console.log(`wrote ${outPath} (${Object.keys(json.ports).length} conventional ports)`);
