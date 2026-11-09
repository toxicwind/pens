<div align="center">

[![ci](https://github.com/toxicwind/pens/actions/workflows/ci.yml/badge.svg)](https://github.com/toxicwind/pens/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![stars](https://github.com/toxicwind/pens/stargazers)](https://github.com/toxicwind/pens/stargazers)
[![bun](https://img.shields.io/badge/bun-1.4.4-f9f1e1?logo=bun)](https://bun.sh)
[![mise](https://img.shields.io/badge/toolchains-mise-ffd55a)](https://mise.jdx.dev)

# pens

The **pens** organization — a pointer superproject that tracks the four planes of the self-hosted AI estate. One directory per component, every peer repo lives at [https://github.com/toxicwind](https://github.com/toxicwind). The whole mesh on one box.

<details>
<summary><b>Table of Contents</b></summary>
<ol>
<li><a href="#-the-four-planes">The Four Planes</a></li>
<li><a href="#-%EF%B8%8F-olympus-pantheon-greek-coded-products-18">Olympus Pantheon (18)</a></li>
<li><a href="#-monorepo-statistics">Monorepo Statistics</a></li>
<li><a href="#-bounded-context-holders-peer-repositories">Bounded-Context Holders (222)</a></li>
<li><a href="#-full-component-map">Full Component Map</a></li>
<li><a href="#-upstream-sources">Upstream Sources</a></li>
<li><a href="#-languages-by-tracked-files">Languages</a></li>
<li><a href="#-top-10-largest-directories">Top 10 Largest Dirs</a></li>
<li><a href="#-top-upstreams-by-fork-count">Top Upstreams</a></li>
<li><a href="#-similarity-clusters-readme-based">Similarity Clusters</a></li>
<li><a href="#-directory-type-breakdown">Directory Type Breakdown</a></li>
<li><a href="#-generators--cli-pensctl--toolkit">Generators & CLI</a></li>
</ol>
</details>

---

## 🏛️ The Four Planes

| Plane | GitHub | Local Path | Role |
| --- | --- | --- | --- |
| [**estate**](https://github.com/toxicwind/estate) | [toxicwind/estate](https://github.com/toxicwind/estate) | `/home/toxic/pens/estate` | Control plane & deploy plane |
| [**pens**](https://github.com/toxicwind/pens) | [toxicwind/pens](https://github.com/toxicwind/pens) | `/home/toxic/pens` | Pointer superproject + registry |
| [**olympus**](https://github.com/toxicwind/olympus) | [toxicwind/olympus](https://github.com/toxicwind/olympus) | `/home/toxic/pens/olympus` | Greek-coded products registry |
| [**ranch**](https://github.com/toxicwind/ranch) | [toxicwind/ranch](https://github.com/toxicwind/ranch) | `/home/toxic/pens/ranch` | Bounded-context peer repos |

## ⚡ Olympus Pantheon — Greek-Coded Products (18)

| Codename | Greek Root | Meaning | Stack / Lang | GitHub Repo | Local Path |
| --- | --- | --- | --- | --- | --- |
| **tau** | τ | Greek letter | ⚡ `Bun` | [toxicwind/tau](https://github.com/toxicwind/tau) | `olympus/products/tau` |
| **kappa** | κ | Greek letter | 🔷 `TypeScript` | [toxicwind/kappa-code](https://github.com/toxicwind/kappa-code) | `olympus/products/kappa` |
| **skopos** | σκοπός | watcher / lookout / scout | ⚡ `Bun` | [toxicwind/skopos](https://github.com/toxicwind/skopos) | `olympus/products/skopos` |
| **kilo** | χίλιοι | thousand | ⚡ `Bun` | [toxicwind/kilo](https://github.com/toxicwind/kilo) | `olympus/products/kilo` |
| **muse** | μοῦσα | the muse (inspiration) | 🐍 `Python` | [toxicwind/muse-cli](https://github.com/toxicwind/muse-cli) | `olympus/products/muse` |
| **keryx** | κῆρυξ | herald | 📖 `Docs/Data` | [toxicwind/keryx](https://github.com/toxicwind/keryx) | `olympus/products/keryx` |
| **kairos** | καιρός | the opportune moment | `—` | [toxicwind/kairos](https://github.com/toxicwind/kairos) | `olympus/products/kairos` |
| **kryptos** | κρυπτός | hidden | ⚡ `Bun` | [toxicwind/kryptos](https://github.com/toxicwind/kryptos) | `olympus/products/kryptos` |
| **agele** | ἀγέλη | herd (of cattle) | `—` | [toxicwind/agele](https://github.com/toxicwind/agele) | `olympus/products/agele` |
| **mimetite** | πίναξ | tablet / catalog | `—` | [toxicwind/mimetite](https://github.com/toxicwind/mimetite) | `olympus/products/mimetite` |
| **agon** | ἀγών | contest / race | 🐍 `Python` | [toxicwind/agon](https://github.com/toxicwind/agon) | `olympus/products/agon` |
| **antilogos** | ἀντίλογος | counter-argument / debate | 📖 `Docs/Data` | [toxicwind/antilogos](https://github.com/toxicwind/antilogos) | `olympus/products/antilogos` |
| **pylae** | πύλαι | gates | `—` | [toxicwind/pylae](https://github.com/toxicwind/pylae) | `olympus/products/pylae` |
| **propylon** | πρόπυλον | monumental gateway | 📖 `Docs/Data` | [toxicwind/propylon](https://github.com/toxicwind/propylon) | `olympus/products/propylon` |
| **opsis** | ὄψις | sight / appearance | 📖 `Docs/Data` | [toxicwind/opsis](https://github.com/toxicwind/opsis) | `olympus/products/opsis` |
| **didymos** | δίδυμος | twin | 📖 `Docs/Data` | [toxicwind/didymos](https://github.com/toxicwind/didymos) | `olympus/products/didymos` |
| **chronos-forge** | χρόνος | time | ⚡ `Bun` | [toxicwind/chronos-forge](https://github.com/toxicwind/chronos-forge) | `olympus/products/chronos-forge` |

## 📊 Monorepo Statistics (generated 11/5/2026, 5:51:38 PM)

| Metric | Value |
| --- | --- |
| Total directories | 206 |
| Directories with obvious upstream | 143 / 206 (69.4%) |
| Git-tracked directories | 0 |
| Components (peer repos) | 142 |
| Total size | 0.94 GB |
| Total tracked files | 0 |

## 🤠 Bounded-Context Holders & Peer Repositories

Parsed from `ranch/.meta.yaml` + `.meta-themes.yaml` — all peer repos enriched with `detectLanguage` + descriptions from `FORKS-report.json` and GitHub API cache.

*(`.meta.yaml` not readable)*

## 🗂️ Full Component Map

Flat table of all peer repos: Path · Holder · Stack/Lang · GitHub Repo · Upstream · Description.

| Component | Holder | Stack / Lang | GitHub Repo | Upstream | Description |
| --- | --- | --- | --- | --- | --- |
*(flat map requires .meta.yaml)*

## 🔭 Upstream Sources

| Source | Count |
| --- | --- |
| .gitmodules | 142 |
| Cargo.toml repository | 1 |

## 🌐 Languages (by tracked files)

| Language | Files |
| --- | --- |

## 📦 Top 10 Largest Directories

| Directory | Size | Files | Upstream |
| --- | --- | --- | --- |
| `forge` | 387.7 MB | 4,086 | github.com/toxicwind/forge |
| `range` | 177.0 MB | 333 | — |
| `qed` | 122.4 MB | 4,522 | — |
| `propylon` | 113.7 MB | 7 | — |
| `barn` | 58.5 MB | 2,410 | github.com/toxicwind/barn |
| `herd` | 22.7 MB | 2 | github.com/toxicwind/herd |
| `rustdesk-server` | 18.8 MB | 10 | — |
| `github-search` | 10.5 MB | 643 | github.com/toxicwind/github-search |
| `roundup` | 8.2 MB | 605 | — |
| `vendor` | 8.2 MB | 484 | — |

## 🔮 Top Upstreams by Fork Count

| Upstream | Forks |
| --- | --- |
| [github.com/aparnaa19/AgentForensics](https://github.com/aparnaa19/AgentForensics) | 1 |
| [github.com/toxicwind/OmniRoute](https://github.com/toxicwind/OmniRoute) | 1 |
| [github.com/toxicwind/VansRouter](https://github.com/toxicwind/VansRouter) | 1 |
| [github.com/toxicwind/agent-customization-style-guide](https://github.com/toxicwind/agent-customization-style-guide) | 1 |
| [github.com/toxicwind/agent-dashboard](https://github.com/toxicwind/agent-dashboard) | 1 |
| [github.com/toxicwind/agon](https://github.com/toxicwind/agon) | 1 |
| [github.com/toxicwind/ai-merge-resolve](https://github.com/toxicwind/ai-merge-resolve) | 1 |
| [github.com/toxicwind/android-fleet](https://github.com/toxicwind/android-fleet) | 1 |
| [github.com/toxicwind/antilogos](https://github.com/toxicwind/antilogos) | 1 |
| [github.com/toxicwind/arroyo](https://github.com/toxicwind/arroyo) | 1 |

## 🔲 Similarity Clusters (README-based)

Directories with similar README content (Jaccard on first 500 chars):

| Dir A | Dir B | Similarity |
| --- | --- | --- |

## 📁 Directory Type Breakdown

| Type | Count |
| --- | --- |
| Submodule | 142 |
| Vendored (snapshot) | 63 |
| Experimental | 59 |
| Stub/Empty | 84 |

## 🛠️ Generators & CLI (`pensctl` + `toolkit/`)

| Command | Description |
| --- | --- |
| `bun toolkit/generate-readme.ts --update` | Regenerate this README at `README.md` |
| `bun toolkit/generate-readme.ts --update --ranch` | Regenerate ranch README at `ranch/README.md` |
| `bun toolkit/generate-manifest.ts` | Generate `pens.yaml`, `olympus/README.md` (with GitHub Repo column), and `olympus-pantheon.md` |
| `bun toolkit/gen-meta-manifest.ts` | Regenerate `ranch/.meta.yaml` from peer model |
| `bun toolkit/audit-forks.ts` | Run fork audit → `FORKS-report.json` |
| `bun toolkit/audit-submodule-dupes.ts` | Audit duplicate submodule references |
| `./pensctl generate-all` | Run `generate-ignore` + manifest + readme |
| `./pensctl generate-ignore` | Regenerate `.gitignore` (pointer superproject `*` ignore) |
| `./pensctl generate-yaml` | Generate `pens.yaml` from live pen dirs |
| `./pensctl generate-pantheon` | Generate `olympus-pantheon.md` from registry |
| `./pensctl doctor` | Health check: pens root git-less per-dir, no stray tracked content |

_Do not edit this file directly — it is generated from `FORKS-report.json` + `.meta.yaml` + `olympus/README.md`._
_Run `bun toolkit/generate-readme.ts --update` (or `./pensctl generate-all`) to regenerate._
