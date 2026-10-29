# pens

> **The pens are the places.** Every pen is a farmstead on the AI Harvest Moon
> map: a checkout area on disk (`/home/toxic/pens/<name>`), a GitHub repo of the
> same name, and — per the resident-rig law — a **rig**: a named agent persona
> who owns the pen's lane and cycles through the [rig](https://github.com/toxicwind/rig)
> runtime hourly.

## The pens

| Pen | Repo | Resident rig | Owns |
|---|---|---|---|
| **estate** | [toxicwind/estate](https://github.com/toxicwind/estate) | — (the control plane itself) | pitchfork process table · ports SSOT · mise toolchain floor · anomaly program · fleet docs |
| **ranch** | [toxicwind/ranch](https://github.com/toxicwind/ranch) | **geode** 💎 | the service catalog: squawk bus, thresher MCP gateway, roundup evals, android-fleet, arroyo/telegram, eidolon image forge |
| **geode** | [toxicwind/geode](https://github.com/toxicwind/geode) | **geode** 💎 (double-duty: her namesake) | the gem fleet — the routers: rhodochrosite (canonical, :25193), bornite, chalcopyrite, azurite · mimetite provider catalog |
| **barn** | [toxicwind/barn](https://github.com/toxicwind/barn) | **tack** 🔩 | ops: estate-ops (pitchfork plumbing, bin manifest, shims), corral, forge plumbing |
| **olympus** | [toxicwind/olympus](https://github.com/toxicwind/olympus) | **hephaistos** ⚒ | the Greek lineage: tau, kappa, kairos, keryx, skopos, kryptos, muse |
| **ergasterion** | [toxicwind/ergasterion](https://github.com/toxicwind/ergasterion) | **hephaistos** ⚒ (the smith's atelier) | the workshop: hephaistos plugin platform, ergane, hestia, eidolon |

## The doctrine

- **Products own their entrypoints; bins merely point at them.** `~/.local/bin`
  is the one PATH surface; every link resolves into a pen. A copied binary in
  the bin surface is a bug.
- **Five-shape scaffold** (enforced 2026-10-29): product pens (`barn`,
  `ranch`, `geode`, `olympus`) hold ALL products under `products/<name>/`;
  litter archives to `archive/`. The **estate pen is exempt** — it is the
  control plane: its root dirs (`stack/`, `bridge/`, `tools/`, `config/`,
  `services/`, `pitchfork.toml` stanzas) are live daemon homes referenced by
  absolute pens paths; reorganizing them kills daemons. `reorganize-pen.ts`
  refuses control-plane pens (exit 3). Scaffold tooling lives in
  `pens/toolkit/scaffold/` — never inside a product it reorganizes.
- **Resident-rig law** (2026-10-28): every pen ships with a rig persona
  (`estate/agents/<name>/`), registered in the rig runtime, on an hourly
  day-cycle cron, present on `#village` (IRC :25241) and the squawk bus
  (:25120). The village tasking loop runs from the fleet todo board —
  fractures get filed as todos, nobody waits for a human.
- **Submoduleless**: products are peer checkouts inside a pen, auto-ignored by
  the kitchen-sink `.gitignore` — never submodules, never snapshots of peers.
- **Two truths are a bug**: pitchfork monolith + its `pens/estate` mirror must
  stay consistent (`sync-estate-ns.sh` is the only writer of the namespace).

## Facts (generated — do not hand-edit)

<!-- FACTS:START -->
| pens on disk | 6 (of 6 declared) |
| rhodochrosite port | 25193 (from ports.env RHODOCHROSITE_PORT) |
| squawk port | 25120 (from ports.env ESTATE_CHAT_PORT) |
| thresher port | 25127 (from ports.env THRESHER_PORT) |
| village-irc port | 25241 (from ports.env VILLAGE_IRC_PORT) |
| taas port | 25243 (from ports.env TAAS_PORT) |
| eidolon port | 25244 (from ports.env EIDOLON_PORT) |
| gemini-mcp port | 25227 (from ports.env GEMINI_MCP_PORT) |
<!-- FACTS:END -->

## Support dirs (not pens)

`scaffold/` — the pen-creation template (resident-rig section included) ·
`archive/` · `toolkit/` · `hatch-kite-cli/`.

## The agents

See [toxicwind/estate](https://github.com/toxicwind/estate) `agents/` for every
rig's `agent.toml` + `system.md` (persona bound to an engineering lane, never
roleplay fluff), and the anomaly program in `docs/anomalies/` — every fix
ships with a live capability-contract test before it is trusted.
