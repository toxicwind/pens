# PENS — the hyper master concept (one contract above all products)

> **pens = the estate's PEN CATALOG, not the estate itself.** The estate is
> the whole ranch; `pens/` is the catalog of pens (each a themed directory of
> standalone product checkouts). Every product — tau, kappa, mimetite,
> thresher, pseudobrookite, marquee — is a **peer standalone checkout** under
> the pen whose *theme* it serves, referenced never owned, symlinked into
> `~/.local/bin` by the estate-ops manifest. Any guide written below another
> level must refine, never contradict, this file. Guides are **added as we go**
> (append a `## Guides` row, never fork a second truth).
>
> **Disambiguation (read before searching):** `pens/estate/` below is the
> **control-plane pen** — a subdirectory under `pens/`, just a theme bucket,
> NOT the root. There is **no top-level `/home/toxic/estate` to treat as "the
> estate"**; if a search/agent resolves to a root `/home/toxic/estate` (or
> suggests it), it has been misled by the word "estate" — the real home is the
> `pens/` tree. `marquee` lives at `pens/ranch/products/marquee`.

## The pens (placement rule = theme, verified in `geode/PLAN.md` §0)

| Pen | Theme | Examples |
|---|---|---|
| `pens/estate/` | **control plane** — config, pitchfork, services, state, docs | pitchfork.toml, config/ports.env, docs/ |
| `pens/geode/` | **inference plane** — catalog, routers, engines, auditors | mimetite, rhodochrosite, bornite, chalcopyrite, azurite, pseudobrookite |
| `pens/barn/` | **ops tooling** | thresher, weave, estate-ops (kryptos is the secrets SSOT, olympus) |
| `pens/ranch/` | **fleet & model components** | github-search (blackbird), marquee, rename-roundup |
| `pens/olympus/` | **Greek-named products** | tau, kappa, sigma, keryx, muse |
| `pens/kelpie/` | **the shell pen** — desktop shell pack (THIN coordinator; husk = shell) | whistle (engine: env doctrine + muster deploy + scent doctor), ww — Working Wuff (visual shell, ex estate-end4/sovereign-end4), cuprite (browser-keeper :99 lane, DP-2 surface) |
| `pens/squawk/` | **peer-agent chat & identity** | squawk-identity (per-agent key identity, roster, E2EE, seal, relay) — chat server stays in ranch/products/squawk |

> **estate-ops is a barn PRODUCT, not "the estate"** — meet `pens/barn/products/estate-ops` (the tool that manifests links/secrets into `~/.local/bin`). Its name is historical; it does NOT make a `/.../estate` directory the root. "The estate" = the sovereign host/ranch; `pens/` = its pen catalog; `pens/estate/` = the control-plane pen (one theme bucket under `pens/`).

> kelpie joined 2026-11-02 (Australian kelpie mascot; handle **ww = Working
> Wuff** — the shell, following upstream's illogical-impulse→ii initials
> pattern; the engine tools whistle/muster/scent carry the herding vocabulary).
> Public quickshell rices (Panacea/Serashell/Shizuka) own the visual
> axis only; kelpie owns BOTH — ww ships the rice, whistle ships the env
> doctrine + deploy engine + doctor no public rice has, cuprite keeps the
> browser lane. Divergence doctrine: `products/ww/DIVERGENCE.md` (omp-wtf
> three-way: canary/diverged/ours).

## The three commands every product answers to

1. **Meta-permanence ("save all")** — branch → tmp commit → micro merge
   straight to main, forward-only, save-as-we-go; live green-blue deploy
   (green stays runnable, blue healthchecked, swap, instant rollback).
   Primitive: `pens/geode/products/pseudobrookite/scripts/save-all.ts`,
   `…/scripts/deploy-green-blue.ts`.
2. **Hyper-tailrec todo creation** — the goal IS the todo loop: every turn
   re-reads the board, spawns subtodos reactively (architect-approved),
   writes docs for every not-fully-realized concept it touches, and
   deeplinks them. Loop doc: [`docs/prompt-as-ir.md`](docs/prompt-as-ir.md).
3. **Blackbird-forward search** — any skill, product, or code path that
   touches GitHub search uses **blackbird** (`pens/barn/products/blackbird`,
   session-cookie web engine, dual-engine `searchGithubDetailed`) exclusively;
   the REST `/search/code` path is dead doctrine. Hooked 2026-11-02 across
   azurite code-patterns, race-borrow, and estate repo-discovery —
   blackbird-first, REST degraded-fallback only. New GitHub-search consumers
   MUST route through blackbird the same way
   (`AGENTS.md` search doctrine, 2026-10-28; sweep re-verified 2026-11-02).

## Guides (add as we go — one row each, deeplinked)

| Guide | Deeplink | Refines |
|---|---|---|
| Pens placement + pen catalog (estate = ranch; `pens/` = catalog; `pens/<pen>/` = theme buckets) | [`geode/PLAN.md`](geode/PLAN.md) §0 | this file |
| Prompt-as-IR / pseudocompiler whitepaper | [`docs/prompt-as-ir.md`](docs/prompt-as-ir.md) | hyper-tailrec todo loop |
| Concept glossary (deeplinks for every term) | [`CONCEPTS.md`](CONCEPTS.md) | everything |
| Save-all + green-blue permanence | [`geode/products/pseudobrookite/REQUIREMENTS.md`](geode/products/pseudobrookite/REQUIREMENTS.md) | command 1 |
| Mobile-autocorrect audit (extension "sucks" docket) | [`geode/products/pseudobrookite/docs/audit-mobile-autocorrect.md`](geode/products/pseudobrookite/docs/audit-mobile-autocorrect.md) | tau extensions |
| Tool-path audit (find/grep/shim/spawn traps) | [`geode/products/pseudobrookite/docs/tool-audit.md`](geode/products/pseudobrookite/docs/tool-audit.md) | agent runtime |

## Boundaries (refining `~/.local/bin` + estate-ops manifest doctrine)

- Products own their entrypoints; `~/.local/bin` links point into pens. Never
  a second copy. `bin-verify.sh` FAILs a broken link.
- Secrets: **kryptos** keyring only, never committed. (kryptos is the
  SSOT since 2026-11-02; secretsmith is the retired predecessor — do not
  add new secretsmith references.)
- No `git submodule add`, no gitlinks; the pen's kitchen-sink `.gitignore`
  auto-ignores product checkouts.
- The desktop is live: additive-only on user-facing surfaces; never disrupt
  the running session to wire an extension — ship the installer, wire on next
  restart.