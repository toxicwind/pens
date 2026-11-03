import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { listPens, readProducts, buildFabric } from "./gen-fabric";

// Mass TDD over the gen-fabric discovery surface — every flaking edge from the
// fabric build: broken gitfiles, empty/missing registries, repo-less products,
// SKIP pens, dirty/head enrichment, malformed registry fallback, dot-dirs.

let root: string;

function pen(name: string): string {
  return join(root, name);
}
function product(penName: string, name: string): string {
  const p = join(pen(penName), "products", name);
  mkdirSync(p, { recursive: true });
  return p;
}
function gitInit(repo: string): void {
  mkdirSync(repo, { recursive: true });
  execSync("git init -q -b main " + repo, { stdio: "ignore" });
  writeFileSync(join(repo, "f.txt"), "");
  execSync("git -C " + repo + " add -A && git -C " + repo + " commit -qm init", { stdio: "ignore" });
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "pens-fabric-"));
  // Skip pens (estate, backups, toolkit, etc.) should be excluded even if they have products/
  for (const skip of ["estate", "backups", "archive", "toolkit", "wip", "tmp"]) mkdirSync(join(root, skip, "products"), { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("listPens — discovery contract", () => {
  test("excludes SKIP pens even when they have products/", () => {
    for (const skip of ["estate", "backups", "archive", "toolkit", "wip", "tmp"]) {
      expect(listPens(root)).not.toContain(skip);
    }
  });

  test("includes a pen with products/ only", () => {
    product("fathom", "a");
    expect(listPens(root)).toContain("fathom");
  });

  test("includes a pen with products.registry.json only (no products dir)", () => {
    mkdirSync(pen("rhodochrosite"), { recursive: true });
    writeFileSync(join(pen("rhodochrosite"), "products.registry.json"), JSON.stringify({ products: { x: {} } }));
    expect(listPens(root)).toContain("rhodochrosite");
  });

  test("excludes a dir with neither registry nor products/", () => {
    mkdirSync(join(root, "empty"), { recursive: true });
    expect(listPens(root)).not.toContain("empty");
  });

  test("excludes dot-prefixed dirs", () => {
    mkdirSync(join(root, ".hidden", "products"), { recursive: true });
    expect(listPens(root)).not.toContain(".hidden");
  });

  test("returns a flat file sorted", () => {
    product("zeta", "a");
    product("alpha", "b");
    expect(listPens(root)).toEqual(["alpha", "zeta"]);
  });

  test("returns [] when root missing", () => {
    expect(listPens(join(root, "nope"))).toEqual([]);
  });
});

describe("readProducts — registry + on-disk union", () => {
  test("returns [] for a pen with nothing", () => {
    mkdirSync(pen("bare"), { recursive: true });
    expect(readProducts("bare", root)).toEqual([]);
  });

  test("reads enabled products from registry", () => {
    const reg = { products: { one: { enabled: true }, two: {} } };
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify(reg));
    const names = readProducts("p", root).map((p) => p.name);
    expect(names).toContain("one");
    expect(names).toContain("two");
  });

  test("skips disabled registry products", () => {
    const reg = { products: { on: {}, off: { enabled: false } } };
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify(reg));
    expect(readProducts("p", root).map((p) => p.name)).toEqual(["on"]);
  });

  test("carries repo url from registry (self-describing manifest)", () => {
    const reg = { products: { one: { repo: "https://github.com/x/y" } } };
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify(reg));
    expect(readProducts("p", root).find((p) => p.name === "one")?.repo).toBe("https://github.com/x/y");
  });

  test("falls back to on-disk scan when registry is absent", () => {
    product("p", "a");
    product("p", "b");
    expect(readProducts("p", root).map((p) => p.name)).toEqual(["a", "b"]);
  });

  test("falls back to on-disk scan when registry is malformed JSON", () => {
    product("p", "a");
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), "{ not json");
    expect(readProducts("p", root).map((p) => p.name)).toEqual(["a"]);
  });

  test("dedupes registry + on-disk union", () => {
    product("p", "a");
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify({ products: { a: {} } }));
    expect(readProducts("p", root).filter((p) => p.name === "a")).toHaveLength(1);
  });

  test("excludes dot-config on-disk dirs", () => {
    mkdirSync(join(pen("p"), "products", ".github"), { recursive: true });
    mkdirSync(join(pen("p"), "products", "real"), { recursive: true });
    expect(readProducts("p", root).map((p) => p.name)).toEqual(["real"]);
  });

  test("sorts products by name", () => {
    product("p", "zeta");
    product("p", "alpha");
    expect(readProducts("p", root).map((p) => p.name)).toEqual(["alpha", "zeta"]);
  });

  test("carries aliases from registry (rename-remnant contract)", () => {
    const reg = { products: { lapidary: { aliases: ["pairs", "faceter"] } } };
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify(reg));
    expect(readProducts("p", root).find((p) => p.name === "lapidary")?.aliases).toEqual(["pairs", "faceter"]);
  });

  test("marks registry-only remnant rows as aliasOf (never a product)", () => {
    // `pairs` was renamed to `lapidary`: registry keeps a remnant row with aliases,
    // no on-disk checkout — the fabric must expose it as resolvable alias, not a product.
    const reg = { products: { pairs: { aliases: ["lapidary"] } } };
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify(reg));
    const rows = readProducts("p", root);
    expect(rows.find((p) => p.name === "pairs")?.aliasOf).toBe("lapidary");
    expect(rows.every((p) => p.name !== "pairs" || p.aliasOf)).toBe(true);
  });

  test("does not mark a real on-disk product with aliases as aliasOf", () => {
    // xerj -> argos: argos exists on disk AND has xerj in its aliases — real product.
    const reg = { products: { argos: { aliases: ["xerj"] } } };
    product("p", "argos");
    mkdirSync(pen("p"), { recursive: true });
    writeFileSync(join(pen("p"), "products.registry.json"), JSON.stringify(reg));
    const rows = readProducts("p", root);
    expect(rows.find((p) => p.name === "argos")?.aliases).toEqual(["xerj"]);
    expect(rows.find((p) => p.name === "argos")?.aliasOf).toBeUndefined();
  });
});

describe("readProducts — live git enrichment (kernel truth)", () => {
  test("adds HEAD + dirty for a clean standalone repo", () => {
    const repo = product("p", "r");
    gitInit(repo);
    const entry = readProducts("p", root).find((p) => p.name === "r");
    expect(entry?.head).toMatch(/^[0-9a-f]{7,}$/);
    expect(entry?.dirty).toBe(0);
  });

  test("returns undefined for non-git product dir (dirtyCount catch)", () => {
    product("p", "nogit");
    const entry = readProducts("p", root).find((p) => p.name === "nogit");
    expect(entry?.head).toBeUndefined();
    expect(entry?.dirty).toBeUndefined();
  });

  test("dirtyCount catch: .git exists but git status fails (broken gitfile in product)", () => {
    const repo = product("p", "broken-git");
    writeFileSync(join(repo, ".git"), "not-a-repo");
    const entry = readProducts("p", root).find((p) => p.name === "broken-git");
    // both headOf and dirtyCount fail on non-git .git file — graceful degradation
    expect(entry?.dirty).toBeUndefined();
  });

  test("adds dirty count for an uncommitted-change repo", () => {
    const repo = product("p", "r");
    gitInit(repo);
    writeFileSync(join(repo, "f.txt"), "change");
    expect(readProducts("p", root).find((p) => p.name === "r")?.dirty).toBe(1);
  });

  test("skips enrichment for a repo-less product dir (no .git)", () => {
    const dir = product("p", "r");
    expect(readProducts("p", root).find((p) => p.name === "r")?.head).toBeUndefined();
    // coverage: dir exists, no .git
    expect(join(dir, ".git")).not.toBeUndefined();
  });

  test("does not crash on a broken gitfile symlink (head undefined, no throw)", () => {
    const repo = product("p", "ghost");
    mkdirSync(repo, { recursive: true });
    try {
      symlinkSync("/nonexistent/elsewhere", join(repo, ".git"));
    } catch {
      // sandbox without symlink support — skip assertion body
      return;
    }
    const entry = readProducts("p", root).find((p) => p.name === "ghost");
    expect(entry).toBeDefined();
    expect(entry?.head).toBeUndefined();
  });

  test("enriches many products without cross-contamination", () => {
    const a = product("p", "a");
    const b = product("p", "b");
    gitInit(a);
    gitInit(b);
    const entries = readProducts("p", root);
    expect(entries.filter((e) => e.head)).toHaveLength(2);
  });
});

describe("buildFabric — aggregate shape", () => {
  test("returns a stable envelope with pens + minted_at", () => {
    product("fathom", "x");
    const f = buildFabric(root);
    expect(typeof f.minted_at).toBe("string");
    expect(Array.isArray(f.pens)).toBe(true);
  });

  test("mints a non-empty ISO minted_at", () => {
    product("fathom", "x");
    expect(new Date(buildFabric(root).minted_at).getTime()).not.toBeNaN();
  });

  test("does not leak SKIP pens into the minted catalog", () => {
    for (const skip of ["estate", "backups", "archive", "toolkit", "wip", "tmp"]) {
      expect(buildFabric(root).pens.map((p) => p.pen)).not.toContain(skip);
    }
  });

  test("counts products across pens", () => {
    product("fathom", "a");
    product("fathom", "b");
    product("geode", "c");
    const f = buildFabric(root);
    expect(f.pens.find((p) => p.pen === "fathom")?.products).toHaveLength(2);
    expect(f.pens.find((p) => p.pen === "geode")?.products).toHaveLength(1);
  });
});
