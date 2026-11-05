# AGENTS.md — Fleet (`pens/fleet`)

> **Part of the estate's pens family** (`pens/{estate,geode,barn,ranch,olympus}`).
> A pens repo is a **thin coordinator**, not a product monorepo. It owns only
> its own metadata, `bin/`, and `docs/`. Devices are peer standalone
> checkouts, referenced-not-owned (this pen owns hardware devices, so its
> checkout dir is `devices/`, not `products/`).

## This repo is submoduleless by design

There are **no submodules** here. The repo's `.gitignore` is the kitchen-sink:
`*` with a whitelist. Any device checkout dropped into `devices/` is
**auto-ignored** — nothing to register, no gitlink, no nested `.git` in the
index.

```
*
!.gitignore
!README.md
!LICENSE
!package.json
!mise.toml
!AGENTS.md
!bin/
!bin/**
!docs/
!docs/**
```

## Rules

1. **Never** `git submodule add` and never commit a gitlink (mode 160000).
2. A device is a peer clone: `git clone <url> devices/<name>`. It brings
   its own history and its own remote.
3. The pen repo's `git status` must stay clean regardless of what the
   devices are doing.
4. `bin/` entries are symlinked into `~/.local/bin` and pinned by the
   estate-ops manifest; `bin-verify.sh` treats a broken link as FAIL.
5. Runtime language is **Bun/TypeScript**.
6. Secrets never live in this repo. They live in the kryptos keyring.
7. **DISPLAY 2 IS THE PERMANENT DEFAULT FOR ALL ANDROID WORK** (architect
   order 2026-11-05): every launch, automation, screenshot, and UI drive
   targets the secondary android desktop (display 2 — the transparent
   full-control overlay), NEVER the main screen (display 0). The user's
   main screen is never interrupted. `am start --display 2`,
   `screencap -d 2`, windowing via `flotilla:mosaic_desktop_windowing`
   (freeform/fullscreen per display), desks via `flotilla:mosaic_desktop_desks`.

## Where things go

- **A new device** → `devices/<name>/`, plus a row in this pen's README
  member table and an entry in the estate-ops bin manifest.
- **Pen-owned documentation** → `docs/`.
- **Estate-wide documentation** (architecture, daemons, conventions) →
  `pens/estate/docs/`.