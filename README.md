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
| [**estate**](https://github.com/toxicwind/estate) | [toxicwind/estate](https://github.com/toxicwind/estate) | `/home/toxic/estate` | Control plane & deploy plane |
| [**pens**](https://github.com/toxicwind/pens) | [toxicwind/pens](https://github.com/toxicwind/pens) | `/home/toxic/pens` | Pointer superproject + registry |
| [**olympus**](https://github.com/toxicwind/olympus) | [toxicwind/olympus](https://github.com/toxicwind/olympus) | `/home/toxic/pens/olympus` | Greek-coded products registry |
| [**ranch**](https://github.com/toxicwind/ranch) | [toxicwind/ranch](https://github.com/toxicwind/ranch) | `/home/toxic/pens/ranch` | Bounded-context peer repos |

## ⚡ Olympus Pantheon — Greek-Coded Products (18)

| Codename | Greek Root | Meaning | Stack / Lang | GitHub Repo | Local Path |
| --- | --- | --- | --- | --- | --- |
| **tau** | tau | Greek letter | ⚡ `Bun` | [toxicwind/tau](https://github.com/toxicwind/tau) | `olympus/products/tau` |
| **kappa** | kappa | Greek letter | 📖 `Docs/Data` | [toxicwind/kilo](https://github.com/toxicwind/kilo) | `olympus/products/kappa` |
| **skopos** | skopos | watcher / lookout / scout | ⚡ `Bun` | [toxicwind/skopos](https://github.com/toxicwind/skopos) | `olympus/products/skopos` |
| **kilo** | kilo | thousand | ⚡ `Bun` | [toxicwind/kilo-code](https://github.com/toxicwind/kilo-code) | `olympus/products/kilo` |
| **muse** | muse | the muse (inspiration) | 🐍 `Python` | [toxicwind/muse-cli](https://github.com/toxicwind/muse-cli) | `olympus/products/muse` |
| **keryx** | keryx | herald | 📖 `Docs/Data` | [toxicwind/keryx](https://github.com/toxicwind/keryx) | `olympus/products/keryx` |
| **hodos** | hodos | way / road | 📁 `Workspace` | [toxicwind/hodos](https://github.com/toxicwind/hodos) | `olympus/products/hodos` |
| **kairos** | kairos | the opportune moment | 🔷 `TypeScript` | [toxicwind/kairos](https://github.com/toxicwind/kairos) | `olympus/products/kairos` |
| **kryptos** | kryptos | hidden | 🐍 `Python` | [toxicwind/kryptos](https://github.com/toxicwind/kryptos) | `olympus/products/kryptos` |
| **agele** | agele | herd (of cattle) | 🐹 `Go` | [toxicwind/herd](https://github.com/toxicwind/herd) | `olympus/products/agele` |
| **pinax** | pinax | tablet / catalog | 🔷 `TypeScript` | [toxicwind/pinax](https://github.com/toxicwind/pinax) | `olympus/products/pinax` |
| **agon** | agon | contest / race | 🐍 `Python` | [toxicwind/agon](https://github.com/toxicwind/agon) | `olympus/products/agon` |
| **antilogos** | antilogos | counter-argument / debate | 📖 `Docs/Data` | [toxicwind/antilogos](https://github.com/toxicwind/antilogos) | `olympus/products/antilogos` |
| **pylae** | pylae | gates | 🔷 `TypeScript` | [toxicwind/flocksync](https://github.com/toxicwind/flocksync) | `olympus/products/pylae` |
| **propylon** | propylon | monumental gateway | 🐍 `Python` | [toxicwind/olympus](https://github.com/toxicwind/olympus) | `olympus/products/propylon` |
| **opsis** | opsis | sight / appearance | 📖 `Docs/Data` | [toxicwind/opsis](https://github.com/toxicwind/opsis) | `olympus/products/opsis` |
| **didymos** | didymos | twin | 📖 `Docs/Data` | [toxicwind/didymos](https://github.com/toxicwind/didymos) | `olympus/products/didymos` |
| **chronos-forge** | chronos-forge | time | 🔷 `TypeScript` | [toxicwind/chronos-forge](https://github.com/toxicwind/chronos-forge) | `olympus/products/chronos-forge` |

## 📊 Monorepo Statistics (generated 10/22/2026, 9:47:45 PM)

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

<details>
<summary><b>olympus</b> — 17 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `agon` | 🐍 `Python` | [toxicwind/agon](https://github.com/toxicwind/agon) | — |
| `antilogos` | 📖 `Docs/Data` | [toxicwind/antilogos](https://github.com/toxicwind/antilogos) | — |
| `arroyo` | 📖 `Docs/Data` | [toxicwind/arroyo](https://github.com/toxicwind/arroyo) | — |
| `chronos-forge` | 🔷 `TypeScript` | [toxicwind/chronos-forge](https://github.com/toxicwind/chronos-forge) | — |
| `didymos` | 📖 `Docs/Data` | [toxicwind/didymos](https://github.com/toxicwind/didymos) | — |
| `hodos` | 📁 `Workspace` | [toxicwind/hodos](https://github.com/toxicwind/hodos) | — |
| `kairos` | 🔷 `TypeScript` | [toxicwind/kairos](https://github.com/toxicwind/kairos) | — |
| `keryx` | 📖 `Docs/Data` | [toxicwind/keryx](https://github.com/toxicwind/keryx) | — |
| `kilo` | `—` | [toxicwind/kilo](https://github.com/toxicwind/kilo) | — |
| `kryptos` | 🐍 `Python` | [toxicwind/kryptos](https://github.com/toxicwind/kryptos) | — |
| `muse-cli` | 🐍 `Python` | [toxicwind/muse-cli](https://github.com/toxicwind/muse-cli) | — |
| `olympus` | `—` | [toxicwind/olympus](https://github.com/toxicwind/olympus) | — |
| `opsis` | 📖 `Docs/Data` | [toxicwind/opsis](https://github.com/toxicwind/opsis) | — |
| `pinax` | 🔷 `TypeScript` | [toxicwind/pinax](https://github.com/toxicwind/pinax) | — |
| `skopos` | `—` | [toxicwind/skopos](https://github.com/toxicwind/skopos) | — |
| `tau-verify` | ⚡ `Bun` | [toxicwind/tau](https://github.com/toxicwind/tau) | — |
| `tau/tau-extensions` | ⚡ `Bun` | [toxicwind/tau-extensions](https://github.com/toxicwind/tau-extensions) | — |

</details>

<details>
<summary><b>ranch-structure</b> — 16 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `barn` | 🐚 `Shell` | [toxicwind/barn](https://github.com/toxicwind/barn) | — |
| `barn/corral` | `—` | [./barn/corral](./barn/corral) | — |
| `barn/flatbread` | 🔷 `TypeScript` | [toxicwind/flatbread](https://github.com/toxicwind/flatbread) | — |
| `barn/nativelink` | 🦀 `Rust` | [toxicwind/nativelink](https://github.com/toxicwind/nativelink) | — |
| `barn/rosec` | 🦀 `Rust` | [toxicwind/rosec](https://github.com/toxicwind/rosec) | — |
| `barn/weave` | 🦀 `Rust` | [toxicwind/weave](https://github.com/toxicwind/weave) | — |
| `barn/weave-sub` | 🦀 `Rust` | [toxicwind/weave](https://github.com/toxicwind/weave) | — |
| `borrowed/herdr` | 🦀 `Rust` | [ogulcancelik/herdr](https://github.com/ogulcancelik/herdr) | — |
| `corral` | ⚡ `Bun` | [toxicwind/corral](https://github.com/toxicwind/corral) | — |
| `flicker` | 🐹 `Go` | [toxicwind/flicker](https://github.com/toxicwind/flicker) | — |
| `forge` | 🐚 `Shell` | [toxicwind/forge](https://github.com/toxicwind/forge) | — |
| `forge/router/weasel` | 🔷 `TypeScript` | [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) | — |
| `forge/web` | 🔷 `TypeScript` | [toxicwind/CMSaasStarter](https://github.com/toxicwind/CMSaasStarter) | — |
| `herd` | 🐹 `Go` | [toxicwind/herd](https://github.com/toxicwind/herd) | — |
| `herdproof-bun` | 📁 `Workspace` | [toxicwind/herdproof-bun](https://github.com/toxicwind/herdproof-bun) | — |
| `skillforge` | 📖 `Docs/Data` | [toxicwind/skillforge](https://github.com/toxicwind/skillforge) | — |

</details>

<details>
<summary><b>gatehouse-mcp</b> — 15 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `bridge` | 📖 `Docs/Data` | [toxicwind/bridge](https://github.com/toxicwind/bridge) | — |
| `doorbell` | ⚡ `Bun` | [toxicwind/doorbell](https://github.com/toxicwind/doorbell) | — |
| `identity-router` | 🐍 `Python` | [toxicwind/identity-router](https://github.com/toxicwind/identity-router) | — |
| `mcp` | 📁 `Workspace` | [toxicwind/mcp](https://github.com/toxicwind/mcp) | — |
| `mcp/mcp-prompt-injection-detector` | 📖 `Docs/Data` | [thilinawishvekeerthi/mcp-prompt-injection-detector](https://github.com/thilinawishvekeerthi/mcp-prompt-injection-detector) | — |
| `mcp/mcpproxy-go` | 🐹 `Go` | [toxicwind/mcpproxy-go](https://github.com/toxicwind/mcpproxy-go) | — |
| `mcp/pd-mcp-standalone` | ⚡ `Bun` | [toxicwind/pd-mcp](https://github.com/toxicwind/pd-mcp) | — |
| `mcp/rsync-mcp` | 🔷 `TypeScript` | [toxicwind/rsync-mcp](https://github.com/toxicwind/rsync-mcp) | — |
| `mcpproxy-go` | 🐹 `Go` | [toxicwind/mcpproxy-go](https://github.com/toxicwind/mcpproxy-go) | — |
| `null-g-proxy` | ⚡ `Bun` | [toxicwind/null-g-proxy](https://github.com/toxicwind/null-g-proxy) | — |
| `OmniRoute` | 🔷 `TypeScript` | [toxicwind/OmniRoute](https://github.com/toxicwind/OmniRoute) | — |
| `session-bus-refresh` | 🐍 `Python` | [toxicwind/session-bus-refresh](https://github.com/toxicwind/session-bus-refresh) | — |
| `universal-keypool-bun` | 🔷 `TypeScript` | [toxicwind/universal-keypool-bun](https://github.com/toxicwind/universal-keypool-bun) | — |
| `universal-keypool-gateway` | 🔷 `TypeScript` | [toxicwind/universal-keypool-gateway](https://github.com/toxicwind/universal-keypool-gateway) | — |
| `VansRouter` | 🔷 `TypeScript` | [toxicwind/VansRouter](https://github.com/toxicwind/VansRouter) | — |

</details>

<details>
<summary><b>oracle</b> — 10 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `antilogos/vendor/argus-ai-debate` | 🐍 `Python` | [Argus-Framework/argus-ai-debate](https://github.com/Argus-Framework/argus-ai-debate) | — |
| `antilogos/vendor/ChatEval` | 🐍 `Python` | [thunlp/ChatEval](https://github.com/thunlp/ChatEval) | — |
| `antilogos/vendor/debate-or-vote` | 📖 `Docs/Data` | [deeplearning-wisc/debate-or-vote](https://github.com/deeplearning-wisc/debate-or-vote) | — |
| `antilogos/vendor/llm_debate` | 🐍 `Python` | [ucl-dark/llm_debate](https://github.com/ucl-dark/llm_debate) | — |
| `gavel` | 🐍 `Python` | [toxicwind/gavel](https://github.com/toxicwind/gavel) | — |
| `gavel/vendor/agora` | 🐍 `Python` | [KAIJUJO/Agora](https://github.com/KAIJUJO/Agora) | — |
| `gavel/vendor/auction-agent11` | 🐍 `Python` | [wushuchris/11-distributed-auction-task-allocation-agent](https://github.com/wushuchris/11-distributed-auction-task-allocation-agent) | — |
| `gavel/vendor/contract-net-router` | 🐍 `Python` | [M00C1FER/contract-net-router](https://github.com/M00C1FER/contract-net-router) | — |
| `outsource` | 🐹 `Go` | [toxicwind/outsource](https://github.com/toxicwind/outsource) | — |
| `trading-post` | 🔷 `TypeScript` | [toxicwind/trading-post](https://github.com/toxicwind/trading-post) | — |

</details>

<details>
<summary><b>corral</b> — 12 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `android-fleet` | 📖 `Docs/Data` | [toxicwind/android-fleet](https://github.com/toxicwind/android-fleet) | — |
| `dots-client` | 🐍 `Python` | [toxicwind/dots-client](https://github.com/toxicwind/dots-client) | — |
| `drover` | 🔷 `TypeScript` | [toxicwind/drover](https://github.com/toxicwind/drover) | — |
| `extensions/drover` | 🔷 `TypeScript` | [toxicwind/drover](https://github.com/toxicwind/drover) | — |
| `fleet` | 🔷 `TypeScript` | [toxicwind/fleet](https://github.com/toxicwind/fleet) | — |
| `fleet-chat` | 🔷 `TypeScript` | [toxicwind/fleet-chat](https://github.com/toxicwind/fleet-chat) | — |
| `fleet-ops` | 🐍 `Python` | [toxicwind/fleet-ops](https://github.com/toxicwind/fleet-ops) | — |
| `fleetd` | 🐍 `Python` | [toxicwind/fleetd](https://github.com/toxicwind/fleetd) | — |
| `kodi-fleet` | 📖 `Docs/Data` | [toxicwind/kodi-fleet](https://github.com/toxicwind/kodi-fleet) | — |
| `mission-control` | 📖 `Docs/Data` | [toxicwind/mission-control](https://github.com/toxicwind/mission-control) | — |
| `super-board` | 🐚 `Shell` | [toxicwind/super-board](https://github.com/toxicwind/super-board) | — |
| `workmux` | 🦀 `Rust` | [toxicwind/workmux](https://github.com/toxicwind/workmux) | — |

</details>

<details>
<summary><b>estate-ops</b> — 26 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `ai-merge-resolve` | 🔷 `TypeScript` | [toxicwind/ai-merge-resolve](https://github.com/toxicwind/ai-merge-resolve) | — |
| `cron-trust` | 📖 `Docs/Data` | [toxicwind/cron-trust](https://github.com/toxicwind/cron-trust) | — |
| `dashboard` | 📁 `Workspace` | [toxicwind/dashboard](https://github.com/toxicwind/dashboard) | — |
| `dedicated/dedicated-server-ops` | 🐍 `Python` | [toxicwind/dedi-ops](https://github.com/toxicwind/dedi-ops) | — |
| `estate-chat` | 🔷 `TypeScript` | [toxicwind/estate-chat](https://github.com/toxicwind/estate-chat) | — |
| `estate-dispersal` | ⚡ `Bun` | [toxicwind/estate-dispersal](https://github.com/toxicwind/estate-dispersal) | — |
| `estate-dispersal-monolith` | 📁 `Workspace` | [toxicwind/estate-dispersal-monolith](https://github.com/toxicwind/estate-dispersal-monolith) | — |
| `estate-end4` | 📖 `Docs/Data` | [toxicwind/estate-end4](https://github.com/toxicwind/estate-end4) | — |
| `estate-hatch-toolkit` | 🐍 `Python` | [toxicwind/estate-hatch-toolkit](https://github.com/toxicwind/estate-hatch-toolkit) | — |
| `estate-kappa-plugin` | 🔷 `TypeScript` | [toxicwind/estate-kappa-plugin](https://github.com/toxicwind/estate-kappa-plugin) | — |
| `estate-monitor` | 🔷 `TypeScript` | [toxicwind/estate-monitor](https://github.com/toxicwind/estate-monitor) | — |
| `estate-recon` | 📖 `Docs/Data` | [toxicwind/estate-recon](https://github.com/toxicwind/estate-recon) | — |
| `estate-scripts-dispersal` | `—` | [toxicwind/estate-scripts-dispersal](https://github.com/toxicwind/estate-scripts-dispersal) | — |
| `estate-scripts-end4` | `—` | [toxicwind/estate-scripts-end4](https://github.com/toxicwind/estate-scripts-end4) | — |
| `estate-scripts-scripts` | `—` | [toxicwind/estate-scripts-scripts](https://github.com/toxicwind/estate-scripts-scripts) | — |
| `estate-scripts-skills` | `—` | [toxicwind/estate-scripts-skills](https://github.com/toxicwind/estate-scripts-skills) | — |
| `estate-shell` | ⚡ `Bun` | [toxicwind/estate-shell](https://github.com/toxicwind/estate-shell) | — |
| `estate-skills` | 📖 `Docs/Data` | [toxicwind/estate-skills](https://github.com/toxicwind/estate-skills) | — |
| `estate-skills-hub` | 🔷 `TypeScript` | [toxicwind/estate-skills-hub](https://github.com/toxicwind/estate-skills-hub) | — |
| `estate-whoa-breakthrough` | ⚡ `Bun` | [toxicwind/estate-whoa-breakthrough](https://github.com/toxicwind/estate-whoa-breakthrough) | — |
| `host-proof` | 🐚 `Shell` | [toxicwind/host-proof](https://github.com/toxicwind/host-proof) | — |
| `ledger` | 🔷 `TypeScript` | [toxicwind/ledger](https://github.com/toxicwind/ledger) | — |
| `ops` | 📖 `Docs/Data` | [toxicwind/ops](https://github.com/toxicwind/ops) | — |
| `pack-fix` | 📖 `Docs/Data` | [toxicwind/pack-fix](https://github.com/toxicwind/pack-fix) | — |
| `paper-poller` | 📖 `Docs/Data` | [toxicwind/paper-poller](https://github.com/toxicwind/paper-poller) | — |
| `toxicwind-repos` | 🐍 `Python` | [toxicwind/toxicwind-repos](https://github.com/toxicwind/toxicwind-repos) | — |

</details>

<details>
<summary><b>herd</b> — 7 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `godzilla-llama.cpp` | 🐍 `Python` | [toxicwind/godzilla-llama.cpp](https://github.com/toxicwind/godzilla-llama.cpp) | — |
| `hf-model-sync` | 🔷 `TypeScript` | [toxicwind/hf-model-sync](https://github.com/toxicwind/hf-model-sync) | — |
| `ml-serve` | 🐍 `Python` | [toxicwind/ml-serve](https://github.com/toxicwind/ml-serve) | — |
| `nvidia-alive` | 🐚 `Shell` | [toxicwind/nvidia-alive](https://github.com/toxicwind/nvidia-alive) | — |
| `nvidia-kernel-guard` | 🐚 `Shell` | [toxicwind/nvidia-kernel-guard](https://github.com/toxicwind/nvidia-kernel-guard) | — |
| `nvidia-nim-model-probe` | 🐍 `Python` | [toxicwind/nvidia-nim-model-probe](https://github.com/toxicwind/nvidia-nim-model-probe) | — |
| `openrouter-probe` | 🐍 `Python` | [toxicwind/openrouter-probe](https://github.com/toxicwind/openrouter-probe) | — |

</details>

<details>
<summary><b>skills</b> — 7 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `agent-customization-style-guide` | 🐚 `Shell` | [toxicwind/agent-customization-style-guide](https://github.com/toxicwind/agent-customization-style-guide) | — |
| `bash-style-guide` | 🐚 `Shell` | [toxicwind/bash-style-guide](https://github.com/toxicwind/bash-style-guide) | — |
| `classifier` | 🔷 `TypeScript` | [toxicwind/classifier](https://github.com/toxicwind/classifier) | — |
| `classifier-preflight` | 🔷 `TypeScript` | [toxicwind/classifier-preflight](https://github.com/toxicwind/classifier-preflight) | — |
| `naming-audit` | 🐍 `Python` | [toxicwind/naming-audit](https://github.com/toxicwind/naming-audit) | — |
| `outlier-toolkit` | 🐍 `Python` | [toxicwind/outlier-toolkit](https://github.com/toxicwind/outlier-toolkit) | — |
| `safety-review-gate` | 📖 `Docs/Data` | [toxicwind/safety-review-gate](https://github.com/toxicwind/safety-review-gate) | — |

</details>

<details>
<summary><b>security</b> — 6 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `keep` | 🦀 `Rust` | [toxicwind/keep](https://github.com/toxicwind/keep) | — |
| `leakfix-src` | 📁 `Workspace` | [toxicwind/leakfix-src](https://github.com/toxicwind/leakfix-src) | — |
| `pdfshield` | 🐍 `Python` | [purvalsingh/pdfshield](https://github.com/purvalsingh/pdfshield) | — |
| `rust-wrappers` | 📁 `Workspace` | [toxicwind/rust-wrappers](https://github.com/toxicwind/rust-wrappers) | — |
| `secretsmith` | 🐍 `Python` | [toxicwind/secretsmith](https://github.com/toxicwind/secretsmith) | — |
| `stealthprint` | 🐍 `Python` | [toxicwind/stealthprint](https://github.com/toxicwind/stealthprint) | — |

</details>

<details>
<summary><b>research</b> — 22 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `AgentForensics` | 🐍 `Python` | [aparnaa19/AgentForensics](https://github.com/aparnaa19/AgentForensics) | — |
| `agon/vendor/coder_reviewer_reranking` | 🐍 `Python` | [facebookresearch/coder_reviewer_reranking](https://github.com/facebookresearch/coder_reviewer_reranking) | — |
| `agon/vendor/RACE` | 🐍 `Python` | [jszheng21/RACE](https://github.com/jszheng21/RACE) | — |
| `agon/vendor/speed-run` | 📖 `Docs/Data` | [2389-research/speed-run](https://github.com/2389-research/speed-run) | — |
| `agon/vendor/SRank-CodeRanker` | 🐍 `Python` | [FSoft-AI4Code/SRank-CodeRanker](https://github.com/FSoft-AI4Code/SRank-CodeRanker) | — |
| `bench-radar` | 🔷 `TypeScript` | [toxicwind/bench-radar](https://github.com/toxicwind/bench-radar) | — |
| `bugbounty` | 🔷 `TypeScript` | [toxicwind/bugbounty](https://github.com/toxicwind/bugbounty) | — |
| `disparate-latent-experiment` | ⚡ `Bun` | [toxicwind/disparate-latent-experiment](https://github.com/toxicwind/disparate-latent-experiment) | — |
| `dualspace-ast-bm25-hybrid` | 🔷 `TypeScript` | [toxicwind/dualspace-ast-bm25-hybrid](https://github.com/toxicwind/dualspace-ast-bm25-hybrid) | — |
| `emergent` | 🔷 `TypeScript` | [toxicwind/emergent](https://github.com/toxicwind/emergent) | — |
| `fanout` | 📖 `Docs/Data` | [toxicwind/fanout](https://github.com/toxicwind/fanout) | — |
| `fast-race` | 🐍 `Python` | [toxicwind/fast-race](https://github.com/toxicwind/fast-race) | — |
| `ferret-den` | ⚡ `Bun` | [toxicwind/ferret-den](https://github.com/toxicwind/ferret-den) | — |
| `ffs-diff` | 🔷 `TypeScript` | [toxicwind/ffs-diff](https://github.com/toxicwind/ffs-diff) | — |
| `gayxxx-estate` | 📖 `Docs/Data` | [toxicwind/gayxxx-estate](https://github.com/toxicwind/gayxxx-estate) | — |
| `meta-research-toolkit` | ⚡ `Bun` | [toxicwind/meta-research-toolkit](https://github.com/toxicwind/meta-research-toolkit) | — |
| `metaaivm` | 🔷 `TypeScript` | [toxicwind/metaaivm](https://github.com/toxicwind/metaaivm) | — |
| `metaaivm-profile` | 🔷 `TypeScript` | [toxicwind/metaaivm-profile](https://github.com/toxicwind/metaaivm-profile) | — |
| `metaclaw-runtime` | 🔷 `TypeScript` | [toxicwind/metaclaw-runtime](https://github.com/toxicwind/metaclaw-runtime) | — |
| `refusal-hunt` | 🐍 `Python` | [toxicwind/refusal-hunt](https://github.com/toxicwind/refusal-hunt) | — |
| `roundup-site` | 🔷 `TypeScript` | [owieth/turborepo-example](https://github.com/owieth/turborepo-example) | — |
| `wezterm` | `—` | [toxicwind/wezterm](https://github.com/toxicwind/wezterm) | — |

</details>

<details>
<summary><b>websites</b> — 4 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `websites/arlockworks/app` | ⚡ `Bun` | [toxicwind/arlockworks-next](https://github.com/toxicwind/arlockworks-next) | — |
| `websites/arlockworks/main` | 📖 `Docs/Data` | [toxicwind/arlockworks-core](https://github.com/toxicwind/arlockworks-core) | — |
| `websites/effusionlabs/main` | ⚡ `Bun` | [toxicwind/effusion-labs](https://github.com/toxicwind/effusion-labs) | — |
| `websites/effusionlabs/tickets` | ⚡ `Bun` | [toxicwind/effusion-labs-tickets](https://github.com/toxicwind/effusion-labs-tickets) | — |

</details>

<details>
<summary><b>nim</b> — 27 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `nim-inkling-api-research` | 🐹 `Go` | [toxicwind/nim-inkling-api-research](https://github.com/toxicwind/nim-inkling-api-research) | — |
| `nim-omnibus` | 🐚 `Shell` | [toxicwind/nim-omnibus](https://github.com/toxicwind/nim-omnibus) | — |
| `nim-repos/api-evangelist-nvidia-nim` | 📖 `Docs/Data` | [api-evangelist/nvidia-nim](https://github.com/api-evangelist/nvidia-nim) | — |
| `nim-repos/bauka0-nvidia-nim-provider` | 🔷 `TypeScript` | [bauka0/nvidia-nim-provider](https://github.com/bauka0/nvidia-nim-provider) | — |
| `nim-repos/david-eve-za-nvidia-nim-mcp` | 🔷 `TypeScript` | [david-eve-za/nvidia-nim-mcp](https://github.com/david-eve-za/nvidia-nim-mcp) | — |
| `nim-repos/diegovisk-pi-nvidia-nim` | 🔷 `TypeScript` | [diegovisk/pi-nvidia-nim](https://github.com/diegovisk/pi-nvidia-nim) | — |
| `nim-repos/furqanafridi-free-claude-code` | 🐍 `Python` | [furqanafridi/free-claude-code](https://github.com/furqanafridi/free-claude-code) | — |
| `nim-repos/gabriel-ferraresi-NIMGEN` | 🔷 `TypeScript` | [gabriel-ferraresi/NIMGEN](https://github.com/gabriel-ferraresi/NIMGEN) | — |
| `nim-repos/Gitlawb-openclaude` | ⚡ `Bun` | [Gitlawb/openclaude](https://github.com/Gitlawb/openclaude) | — |
| `nim-repos/h0rcrux-hermes-backup` | 🐍 `Python` | [h0rcrux/hermes-backup](https://github.com/h0rcrux/hermes-backup) | — |
| `nim-repos/iammalego-keymux` | 🔷 `TypeScript` | [iammalego/keymux](https://github.com/iammalego/keymux) | — |
| `nim-repos/joeldg-nvidiarouter` | 🐍 `Python` | [joeldg/nvidiarouter](https://github.com/joeldg/nvidiarouter) | — |
| `nim-repos/lizhebio-nim-qwen-model-router` | 🐍 `Python` | [lizhebio/nim-qwen-model-router](https://github.com/lizhebio/nim-qwen-model-router) | — |
| `nim-repos/lucky-mandator-gocode-router` | 🐹 `Go` | [lucky-mandator/gocode-router](https://github.com/lucky-mandator/gocode-router) | — |
| `nim-repos/mschwarzmueller-pi_agent_rust` | 🦀 `Rust` | [mschwarzmueller/pi_agent_rust](https://github.com/mschwarzmueller/pi_agent_rust) | — |
| `nim-repos/musistudio-claude-code-router` | 🔷 `TypeScript` | [musistudio/claude-code-router](https://github.com/musistudio/claude-code-router) | — |
| `nim-repos/nezerkc-opencode-provider-nvidia-nim` | 🔷 `TypeScript` | [nezerkc/opencode-provider-nvidia-nim](https://github.com/nezerkc/opencode-provider-nvidia-nim) | — |
| `nim-repos/nirholas-three.ws` | 🔷 `TypeScript` | [nirholas/three.ws](https://github.com/nirholas/three.ws) | — |
| `nim-repos/NVIDIA-NemoClaw` | 🔷 `TypeScript` | [NVIDIA/NemoClaw](https://github.com/NVIDIA/NemoClaw) | — |
| `nim-repos/olszalsik-a0-nvidia-nim` | 🐍 `Python` | [olszalsik/a0-nvidia-nim](https://github.com/olszalsik/a0-nvidia-nim) | — |
| `nim-repos/rickeshtn-nim-code` | 🐚 `Shell` | [rickeshtn/nim-code](https://github.com/rickeshtn/nim-code) | — |
| `nim-repos/Sateeshreddymaddi-Custom-Nvidia-Nim-Node` | 🔷 `TypeScript` | [Sateeshreddymaddi/Custom-Nvidia-Nim-Node](https://github.com/Sateeshreddymaddi/Custom-Nvidia-Nim-Node) | — |
| `nim-repos/shaivpidadi-freeridev3` | 🐍 `Python` | [shaivpidadi/freeridev3](https://github.com/shaivpidadi/freeridev3) | — |
| `nim-repos/stillhue-claudio` | 📖 `Docs/Data` | [stillhue/claudio](https://github.com/stillhue/claudio) | — |
| `nim-repos/thispointon-kondi` | 📖 `Docs/Data` | [thispointon/kondi](https://github.com/thispointon/kondi) | — |
| `nim-repos/tibbee-pi-nvidia-nim-provider` | 🔷 `TypeScript` | [tibbee/pi-nvidia-nim-provider](https://github.com/tibbee/pi-nvidia-nim-provider) | — |
| `nim-repos/xRyul-pi-nvidia-nim` | 🔷 `TypeScript` | [xRyul/pi-nvidia-nim](https://github.com/xRyul/pi-nvidia-nim) | — |

</details>

<details>
<summary><b>general</b> — 53 peer repositories</summary>

| Component | Stack / Lang | GitHub Repo | Description |
| --- | --- | --- | --- |
| `ast-grep-rules` | 📁 `Workspace` | [toxicwind/ast-grep-rules](https://github.com/toxicwind/ast-grep-rules) | — |
| `auto1m` | 🐍 `Python` | [toxicwind/auto1m](https://github.com/toxicwind/auto1m) | — |
| `awesome-free-ai-coding` | 🐍 `Python` | [toxicwind/awesome-free-ai-coding](https://github.com/toxicwind/awesome-free-ai-coding) | — |
| `borrowed/loom` | 🦀 `Rust` | [rjwalters/loom](https://github.com/rjwalters/loom) | — |
| `campfire` | 🔷 `TypeScript` | [toxicwind/campfire](https://github.com/toxicwind/campfire) | — |
| `codebase-memory` | 🐚 `Shell` | [toxicwind/codebase-memory](https://github.com/toxicwind/codebase-memory) | — |
| `computer-use-linux` | 🦀 `Rust` | [toxicwind/computer-use-linux](https://github.com/toxicwind/computer-use-linux) | — |
| `duel/vendor/argus-ai-debate` | `—` | [Argus-Framework/argus-ai-debate](https://github.com/Argus-Framework/argus-ai-debate) | — |
| `duel/vendor/ChatEval` | `—` | [thunlp/ChatEval](https://github.com/thunlp/ChatEval) | — |
| `duel/vendor/debate-or-vote` | `—` | [deeplearning-wisc/debate-or-vote](https://github.com/deeplearning-wisc/debate-or-vote) | — |
| `duel/vendor/llm_debate` | `—` | [ucl-dark/llm_debate](https://github.com/ucl-dark/llm_debate) | — |
| `examples` | 🐚 `Shell` | [toxicwind/examples](https://github.com/toxicwind/examples) | — |
| `extensions` | 📁 `Workspace` | [toxicwind/extensions](https://github.com/toxicwind/extensions) | — |
| `freebuffet` | 🔷 `TypeScript` | [toxicwind/freebuffet](https://github.com/toxicwind/freebuffet) | — |
| `furlong/vendor/coder_reviewer_reranking` | `—` | [facebookresearch/coder_reviewer_reranking](https://github.com/facebookresearch/coder_reviewer_reranking) | — |
| `furlong/vendor/RACE` | `—` | [jszheng21/RACE](https://github.com/jszheng21/RACE) | — |
| `furlong/vendor/speed-run` | `—` | [2389-research/speed-run](https://github.com/2389-research/speed-run) | — |
| `furlong/vendor/SRank-CodeRanker` | `—` | [FSoft-AI4Code/SRank-CodeRanker](https://github.com/FSoft-AI4Code/SRank-CodeRanker) | — |
| `ghq` | 🐹 `Go` | [toxicwind/ghq](https://github.com/toxicwind/ghq) | — |
| `github-search` | ⚡ `Bun` | [toxicwind/github-search](https://github.com/toxicwind/github-search) | — |
| `gito` | 🐍 `Python` | [toxicwind/gito](https://github.com/toxicwind/gito) | — |
| `hatch` | 📖 `Docs/Data` | [toxicwind/hatch](https://github.com/toxicwind/hatch) | — |
| `hatch-decode` | 📖 `Docs/Data` | [toxicwind/hatch-decode](https://github.com/toxicwind/hatch-decode) | — |
| `hatch/kite-cli` | 🐍 `Python` | [toxicwind/kite-cli](https://github.com/toxicwind/kite-cli) | — |
| `kimi-auto` | 📁 `Workspace` | [toxicwind/kimi-auto](https://github.com/toxicwind/kimi-auto) | — |
| `kimi-claw` | 🔷 `TypeScript` | [toxicwind/kimi-claw](https://github.com/toxicwind/kimi-claw) | — |
| `lasso` | 🐍 `Python` | [toxicwind/lasso](https://github.com/toxicwind/lasso) | — |
| `lib` | 🔷 `TypeScript` | [toxicwind/lib](https://github.com/toxicwind/lib) | — |
| `loom` | 🦀 `Rust` | [toxicwind/loom](https://github.com/toxicwind/loom) | — |
| `matter-server` | 🔷 `TypeScript` | [toxicwind/matter-server](https://github.com/toxicwind/matter-server) | — |
| `maw` | 🦀 `Rust` | [toxicwind/maw](https://github.com/toxicwind/maw) | — |
| `mesh` | 📖 `Docs/Data` | [toxicwind/mesh](https://github.com/toxicwind/mesh) | — |
| `mesh/pylae` | 🔷 `TypeScript` | [toxicwind/flocksync](https://github.com/toxicwind/flocksync) | — |
| `nuvio` | 📖 `Docs/Data` | [toxicwind/nuvio](https://github.com/toxicwind/nuvio) | — |
| `oh-my-pi` | ⚡ `Bun` | [toxicwind/oh-my-pi](https://github.com/toxicwind/oh-my-pi) | — |
| `openfang` | 📖 `Docs/Data` | [toxicwind/openfang](https://github.com/toxicwind/openfang) | — |
| `openfang-join` | 📖 `Docs/Data` | [toxicwind/openfang-join](https://github.com/toxicwind/openfang-join) | — |
| `pearlctl` | 🔷 `TypeScript` | [toxicwind/pearlctl](https://github.com/toxicwind/pearlctl) | — |
| `phone-lane` | 📖 `Docs/Data` | [toxicwind/phone-lane](https://github.com/toxicwind/phone-lane) | — |
| `phone-ocr-sweep` | 🐚 `Shell` | [toxicwind/phone-ocr-sweep](https://github.com/toxicwind/phone-ocr-sweep) | — |
| `pj-fast` | 🔷 `TypeScript` | [toxicwind/pj-fast](https://github.com/toxicwind/pj-fast) | — |
| `plugin-ecosystem` | 📁 `Workspace` | [toxicwind/plugin-ecosystem](https://github.com/toxicwind/plugin-ecosystem) | — |
| `plugin-ecosystem/agentpluginzoo` | 🐍 `Python` | [tezansahu/agentpluginzoo](https://github.com/tezansahu/agentpluginzoo) | — |
| `ralph-dashboard` | 📖 `Docs/Data` | [toxicwind/ralph-dashboard](https://github.com/toxicwind/ralph-dashboard) | — |
| `repo-first-class` | 🐍 `Python` | [toxicwind/repo-first-class](https://github.com/toxicwind/repo-first-class) | — |
| `rig` | 🦀 `Rust` | [toxicwind/rig](https://github.com/toxicwind/rig) | — |
| `strudel-dev-vite` | 🔷 `TypeScript` | [toxicwind/strudel-dev-vite](https://github.com/toxicwind/strudel-dev-vite) | — |
| `strudel-sampler-server-vite` | 🔷 `TypeScript` | [toxicwind/strudel-sampler-server-vite](https://github.com/toxicwind/strudel-sampler-server-vite) | — |
| `submodules/phone-sentinel` | 🔷 `TypeScript` | [/home/toxic/phone-sentinel](/home/toxic/phone-sentinel) | — |
| `tok` | ⚡ `Bun` | [toxicwind/tok](https://github.com/toxicwind/tok) | — |
| `tools/c8` | 🔷 `TypeScript` | [bcoe/c8](https://github.com/bcoe/c8) | — |
| `vendor/tailnet-doctor` | `—` | [toxicwind/tailnet-doctor](https://github.com/toxicwind/tailnet-doctor) | — |
| `zed-android-port` | 🦀 `Rust` | [toxicwind/zed-android-port](https://github.com/toxicwind/zed-android-port) | — |

</details>

**Total: 13 categories, 222 components.**

## 🗂️ Full Component Map

Flat table of all peer repos: Path · Holder · Stack/Lang · GitHub Repo · Upstream · Description.

| Component | Holder | Stack / Lang | GitHub Repo | Upstream | Description |
| --- | --- | --- | --- | --- | --- |
| `agent-customization-style-guide` | skills | 📁 `Workspace` | [toxicwind/agent-customization-style-guide](https://github.com/toxicwind/agent-customization-style-guide) | [toxicwind/agent-customization-style-guide](https://github.com/toxicwind/agent-customization-style-guide) | — |
| `agent-dashboard` | general | 📁 `Workspace` | [toxicwind/agent-dashboard](https://github.com/toxicwind/agent-dashboard) | [toxicwind/agent-dashboard](https://github.com/toxicwind/agent-dashboard) | — |
| `AgentForensics` | research | 📁 `Workspace` | [aparnaa19/AgentForensics](https://github.com/aparnaa19/AgentForensics) | [aparnaa19/AgentForensics](https://github.com/aparnaa19/AgentForensics) | — |
| `agon` | olympus | 📁 `Workspace` | [toxicwind/agon](https://github.com/toxicwind/agon) | [toxicwind/agon](https://github.com/toxicwind/agon) | — |
| `ai-merge-resolve` | estate-ops | 📁 `Workspace` | [toxicwind/ai-merge-resolve](https://github.com/toxicwind/ai-merge-resolve) | [toxicwind/ai-merge-resolve](https://github.com/toxicwind/ai-merge-resolve) | — |
| `android-fleet` | corral | 📁 `Workspace` | [toxicwind/android-fleet](https://github.com/toxicwind/android-fleet) | [toxicwind/android-fleet](https://github.com/toxicwind/android-fleet) | — |
| `antilogos` | olympus | 📁 `Workspace` | [toxicwind/antilogos](https://github.com/toxicwind/antilogos) | [toxicwind/antilogos](https://github.com/toxicwind/antilogos) | — |
| `arroyo` | olympus | 📁 `Workspace` | [toxicwind/arroyo](https://github.com/toxicwind/arroyo) | [toxicwind/arroyo](https://github.com/toxicwind/arroyo) | — |
| `ast-grep-rules` | general | 📁 `Workspace` | [toxicwind/ast-grep-rules](https://github.com/toxicwind/ast-grep-rules) | [toxicwind/ast-grep-rules](https://github.com/toxicwind/ast-grep-rules) | — |
| `audits` | general | 📁 `Workspace` | `—` | `—` | — |
| `auto1m` | general | 📁 `Workspace` | [toxicwind/auto1m](https://github.com/toxicwind/auto1m) | [toxicwind/auto1m](https://github.com/toxicwind/auto1m) | — |
| `awesome-free-ai-coding` | general | 📁 `Workspace` | [toxicwind/awesome-free-ai-coding](https://github.com/toxicwind/awesome-free-ai-coding) | [toxicwind/awesome-free-ai-coding](https://github.com/toxicwind/awesome-free-ai-coding) | — |
| `barn` | ranch-structure | 📁 `Workspace` | [toxicwind/barn](https://github.com/toxicwind/barn) | [toxicwind/barn](https://github.com/toxicwind/barn) | — |
| `bash-style-guide` | skills | 📁 `Workspace` | [toxicwind/bash-style-guide](https://github.com/toxicwind/bash-style-guide) | [toxicwind/bash-style-guide](https://github.com/toxicwind/bash-style-guide) | — |
| `bench-radar` | research | 📁 `Workspace` | [toxicwind/bench-radar](https://github.com/toxicwind/bench-radar) | [toxicwind/bench-radar](https://github.com/toxicwind/bench-radar) | — |
| `bin` | general | 📁 `Workspace` | `—` | `—` | — |
| `borrowed` | general | 📁 `Workspace` | `—` | `—` | — |
| `bridge` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/bridge](https://github.com/toxicwind/bridge) | [toxicwind/bridge](https://github.com/toxicwind/bridge) | — |
| `bugbounty` | research | 📁 `Workspace` | [toxicwind/bugbounty](https://github.com/toxicwind/bugbounty) | [toxicwind/bugbounty](https://github.com/toxicwind/bugbounty) | — |
| `bun-scaffold` | general | 📁 `Workspace` | `—` | `—` | — |
| `campfire` | general | 📁 `Workspace` | [toxicwind/campfire](https://github.com/toxicwind/campfire) | [toxicwind/campfire](https://github.com/toxicwind/campfire) | — |
| `cell-mirror` | general | 📁 `Workspace` | `—` | `—` | — |
| `chronos-forge` | olympus | 📁 `Workspace` | [toxicwind/chronos-forge](https://github.com/toxicwind/chronos-forge) | [toxicwind/chronos-forge](https://github.com/toxicwind/chronos-forge) | — |
| `classifier` | skills | 📁 `Workspace` | [toxicwind/classifier](https://github.com/toxicwind/classifier) | [toxicwind/classifier](https://github.com/toxicwind/classifier) | — |
| `classifier-preflight` | skills | 📁 `Workspace` | [toxicwind/classifier-preflight](https://github.com/toxicwind/classifier-preflight) | [toxicwind/classifier-preflight](https://github.com/toxicwind/classifier-preflight) | — |
| `codebase-memory` | general | 📁 `Workspace` | [toxicwind/codebase-memory](https://github.com/toxicwind/codebase-memory) | [toxicwind/codebase-memory](https://github.com/toxicwind/codebase-memory) | — |
| `computer-use-linux` | general | 📁 `Workspace` | [toxicwind/computer-use-linux](https://github.com/toxicwind/computer-use-linux) | [toxicwind/computer-use-linux](https://github.com/toxicwind/computer-use-linux) | — |
| `cookie-vault` | general | 📁 `Workspace` | `—` | `—` | — |
| `corral` | ranch-structure | 📁 `Workspace` | [toxicwind/corral](https://github.com/toxicwind/corral) | [toxicwind/corral](https://github.com/toxicwind/corral) | — |
| `cron-trust` | estate-ops | 📁 `Workspace` | [toxicwind/cron-trust](https://github.com/toxicwind/cron-trust) | [toxicwind/cron-trust](https://github.com/toxicwind/cron-trust) | — |
| `dashboard` | estate-ops | 📁 `Workspace` | [toxicwind/dashboard](https://github.com/toxicwind/dashboard) | [toxicwind/dashboard](https://github.com/toxicwind/dashboard) | — |
| `data` | general | 📁 `Workspace` | `—` | `—` | — |
| `dedicated` | general | 📁 `Workspace` | `—` | `—` | — |
| `didymos` | olympus | 📁 `Workspace` | [toxicwind/didymos](https://github.com/toxicwind/didymos) | [toxicwind/didymos](https://github.com/toxicwind/didymos) | — |
| `disparate-latent-experiment` | research | 📁 `Workspace` | [toxicwind/disparate-latent-experiment](https://github.com/toxicwind/disparate-latent-experiment) | [toxicwind/disparate-latent-experiment](https://github.com/toxicwind/disparate-latent-experiment) | — |
| `docs` | general | 📁 `Workspace` | `—` | `—` | — |
| `doorbell` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/doorbell](https://github.com/toxicwind/doorbell) | [toxicwind/doorbell](https://github.com/toxicwind/doorbell) | — |
| `dots-client` | corral | 📁 `Workspace` | [toxicwind/dots-client](https://github.com/toxicwind/dots-client) | [toxicwind/dots-client](https://github.com/toxicwind/dots-client) | — |
| `drover` | corral | 📁 `Workspace` | [toxicwind/drover](https://github.com/toxicwind/drover) | [toxicwind/drover](https://github.com/toxicwind/drover) | — |
| `dualspace-ast-bm25-hybrid` | research | 📁 `Workspace` | [toxicwind/dualspace-ast-bm25-hybrid](https://github.com/toxicwind/dualspace-ast-bm25-hybrid) | [toxicwind/dualspace-ast-bm25-hybrid](https://github.com/toxicwind/dualspace-ast-bm25-hybrid) | — |
| `emergent` | research | 📁 `Workspace` | [toxicwind/emergent](https://github.com/toxicwind/emergent) | [toxicwind/emergent](https://github.com/toxicwind/emergent) | — |
| `estate-chat` | estate-ops | 📁 `Workspace` | [toxicwind/estate-chat](https://github.com/toxicwind/estate-chat) | [toxicwind/estate-chat](https://github.com/toxicwind/estate-chat) | — |
| `estate-dispersal` | estate-ops | 📁 `Workspace` | [toxicwind/estate-dispersal](https://github.com/toxicwind/estate-dispersal) | [toxicwind/estate-dispersal](https://github.com/toxicwind/estate-dispersal) | — |
| `estate-dispersal-monolith` | estate-ops | 📁 `Workspace` | [toxicwind/estate-dispersal-monolith](https://github.com/toxicwind/estate-dispersal-monolith) | [toxicwind/estate-dispersal-monolith](https://github.com/toxicwind/estate-dispersal-monolith) | — |
| `estate-end4` | estate-ops | 📁 `Workspace` | [toxicwind/estate-end4](https://github.com/toxicwind/estate-end4) | [toxicwind/estate-end4](https://github.com/toxicwind/estate-end4) | — |
| `estate-hatch-toolkit` | estate-ops | 📁 `Workspace` | [toxicwind/estate-hatch-toolkit](https://github.com/toxicwind/estate-hatch-toolkit) | [toxicwind/estate-hatch-toolkit](https://github.com/toxicwind/estate-hatch-toolkit) | — |
| `estate-kappa-plugin` | estate-ops | 📁 `Workspace` | [toxicwind/estate-kappa-plugin](https://github.com/toxicwind/estate-kappa-plugin) | [toxicwind/estate-kappa-plugin](https://github.com/toxicwind/estate-kappa-plugin) | — |
| `estate-monitor` | estate-ops | 📁 `Workspace` | [toxicwind/estate-monitor](https://github.com/toxicwind/estate-monitor) | [toxicwind/estate-monitor](https://github.com/toxicwind/estate-monitor) | — |
| `estate-recon` | estate-ops | 📁 `Workspace` | [toxicwind/estate-recon](https://github.com/toxicwind/estate-recon) | [toxicwind/estate-recon](https://github.com/toxicwind/estate-recon) | — |
| `estate-shell` | estate-ops | 📁 `Workspace` | [toxicwind/estate-shell](https://github.com/toxicwind/estate-shell) | [toxicwind/estate-shell](https://github.com/toxicwind/estate-shell) | — |
| `estate-skills` | estate-ops | 📁 `Workspace` | [toxicwind/estate-skills](https://github.com/toxicwind/estate-skills) | [toxicwind/estate-skills](https://github.com/toxicwind/estate-skills) | — |
| `estate-skills-hub` | estate-ops | 📁 `Workspace` | [toxicwind/estate-skills-hub](https://github.com/toxicwind/estate-skills-hub) | [toxicwind/estate-skills-hub](https://github.com/toxicwind/estate-skills-hub) | — |
| `estate-whoa-breakthrough` | estate-ops | 📁 `Workspace` | [toxicwind/estate-whoa-breakthrough](https://github.com/toxicwind/estate-whoa-breakthrough) | [toxicwind/estate-whoa-breakthrough](https://github.com/toxicwind/estate-whoa-breakthrough) | — |
| `examples` | general | 📁 `Workspace` | [toxicwind/examples](https://github.com/toxicwind/examples) | [toxicwind/examples](https://github.com/toxicwind/examples) | — |
| `extensions` | general | 📁 `Workspace` | [toxicwind/extensions](https://github.com/toxicwind/extensions) | [toxicwind/extensions](https://github.com/toxicwind/extensions) | — |
| `fanout` | research | 📁 `Workspace` | [toxicwind/fanout](https://github.com/toxicwind/fanout) | [toxicwind/fanout](https://github.com/toxicwind/fanout) | — |
| `fast-race` | research | 📁 `Workspace` | [toxicwind/fast-race](https://github.com/toxicwind/fast-race) | [toxicwind/fast-race](https://github.com/toxicwind/fast-race) | — |
| `feedlot-mcp` | general | 📁 `Workspace` | `—` | `—` | — |
| `ferret-den` | research | 📁 `Workspace` | [toxicwind/ferret-den](https://github.com/toxicwind/ferret-den) | [toxicwind/ferret-den](https://github.com/toxicwind/ferret-den) | — |
| `ffs-diff` | research | 📁 `Workspace` | [toxicwind/ffs-diff](https://github.com/toxicwind/ffs-diff) | [toxicwind/ffs-diff](https://github.com/toxicwind/ffs-diff) | — |
| `fleet` | corral | 📁 `Workspace` | [toxicwind/fleet](https://github.com/toxicwind/fleet) | [toxicwind/fleet](https://github.com/toxicwind/fleet) | — |
| `fleet-chat` | corral | 📁 `Workspace` | [toxicwind/fleet-chat](https://github.com/toxicwind/fleet-chat) | [toxicwind/fleet-chat](https://github.com/toxicwind/fleet-chat) | — |
| `fleet-ops` | corral | 📁 `Workspace` | [toxicwind/fleet-ops](https://github.com/toxicwind/fleet-ops) | [toxicwind/fleet-ops](https://github.com/toxicwind/fleet-ops) | — |
| `fleetd` | corral | 📁 `Workspace` | [toxicwind/fleetd](https://github.com/toxicwind/fleetd) | [toxicwind/fleetd](https://github.com/toxicwind/fleetd) | — |
| `flicker` | ranch-structure | 📁 `Workspace` | [toxicwind/flicker](https://github.com/toxicwind/flicker) | [toxicwind/flicker](https://github.com/toxicwind/flicker) | — |
| `forge` | ranch-structure | 📁 `Workspace` | [toxicwind/forge](https://github.com/toxicwind/forge) | [toxicwind/forge](https://github.com/toxicwind/forge) | — |
| `freebuffet` | general | 📁 `Workspace` | [toxicwind/freebuffet](https://github.com/toxicwind/freebuffet) | [toxicwind/freebuffet](https://github.com/toxicwind/freebuffet) | — |
| `gavel` | oracle | 📁 `Workspace` | [toxicwind/gavel](https://github.com/toxicwind/gavel) | [toxicwind/gavel](https://github.com/toxicwind/gavel) | — |
| `gayxxx-estate` | research | 📁 `Workspace` | [toxicwind/gayxxx-estate](https://github.com/toxicwind/gayxxx-estate) | [toxicwind/gayxxx-estate](https://github.com/toxicwind/gayxxx-estate) | — |
| `ghq` | general | 📁 `Workspace` | [toxicwind/ghq](https://github.com/toxicwind/ghq) | [toxicwind/ghq](https://github.com/toxicwind/ghq) | — |
| `github-search` | general | 📁 `Workspace` | [toxicwind/github-search](https://github.com/toxicwind/github-search) | [toxicwind/github-search](https://github.com/toxicwind/github-search) | — |
| `gito` | general | 📁 `Workspace` | [toxicwind/gito](https://github.com/toxicwind/gito) | [toxicwind/gito](https://github.com/toxicwind/gito) | — |
| `godzilla-llama.cpp` | herd | 📁 `Workspace` | [toxicwind/godzilla-llama.cpp](https://github.com/toxicwind/godzilla-llama.cpp) | [toxicwind/godzilla-llama.cpp](https://github.com/toxicwind/godzilla-llama.cpp) | — |
| `hatch` | general | 📁 `Workspace` | [toxicwind/hatch](https://github.com/toxicwind/hatch) | [toxicwind/hatch](https://github.com/toxicwind/hatch) | — |
| `hatch-decode` | general | 📁 `Workspace` | [toxicwind/hatch-decode](https://github.com/toxicwind/hatch-decode) | [toxicwind/hatch-decode](https://github.com/toxicwind/hatch-decode) | — |
| `herd` | ranch-structure | 📁 `Workspace` | [toxicwind/herd](https://github.com/toxicwind/herd) | [toxicwind/herd](https://github.com/toxicwind/herd) | — |
| `herdproof-bun` | ranch-structure | 📁 `Workspace` | [toxicwind/herdproof-bun](https://github.com/toxicwind/herdproof-bun) | [toxicwind/herdproof-bun](https://github.com/toxicwind/herdproof-bun) | — |
| `hf-model-sync` | herd | 📁 `Workspace` | [toxicwind/hf-model-sync](https://github.com/toxicwind/hf-model-sync) | [toxicwind/hf-model-sync](https://github.com/toxicwind/hf-model-sync) | — |
| `host-proof` | estate-ops | 📁 `Workspace` | [toxicwind/host-proof](https://github.com/toxicwind/host-proof) | [toxicwind/host-proof](https://github.com/toxicwind/host-proof) | — |
| `identity-router` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/identity-router](https://github.com/toxicwind/identity-router) | [toxicwind/identity-router](https://github.com/toxicwind/identity-router) | — |
| `kairos` | olympus | 📁 `Workspace` | [toxicwind/kairos](https://github.com/toxicwind/kairos) | [toxicwind/kairos](https://github.com/toxicwind/kairos) | — |
| `kappa` | general | 📁 `Workspace` | `—` | `—` | — |
| `keep` | security | 📁 `Workspace` | [toxicwind/keep](https://github.com/toxicwind/keep) | [toxicwind/keep](https://github.com/toxicwind/keep) | — |
| `keeper` | general | 📁 `Workspace` | `—` | `—` | — |
| `keryx` | olympus | 📁 `Workspace` | [toxicwind/keryx](https://github.com/toxicwind/keryx) | [toxicwind/keryx](https://github.com/toxicwind/keryx) | — |
| `kilo-cli` | general | 📁 `Workspace` | `—` | `—` | — |
| `kilo-code` | general | 📁 `Workspace` | `—` | `—` | — |
| `kimi-claw` | general | 📁 `Workspace` | [toxicwind/kimi-claw](https://github.com/toxicwind/kimi-claw) | [toxicwind/kimi-claw](https://github.com/toxicwind/kimi-claw) | — |
| `kodi-fleet` | corral | 📁 `Workspace` | [toxicwind/kodi-fleet](https://github.com/toxicwind/kodi-fleet) | [toxicwind/kodi-fleet](https://github.com/toxicwind/kodi-fleet) | — |
| `kryptos` | olympus | 📁 `Workspace` | [toxicwind/kryptos](https://github.com/toxicwind/kryptos) | [toxicwind/kryptos](https://github.com/toxicwind/kryptos) | — |
| `lasso` | general | 📁 `Workspace` | [toxicwind/lasso](https://github.com/toxicwind/lasso) | [toxicwind/lasso](https://github.com/toxicwind/lasso) | — |
| `leakfix-src` | security | 📁 `Workspace` | [toxicwind/leakfix-src](https://github.com/toxicwind/leakfix-src) | [toxicwind/leakfix-src](https://github.com/toxicwind/leakfix-src) | — |
| `ledger` | estate-ops | 📁 `Workspace` | [toxicwind/ledger](https://github.com/toxicwind/ledger) | [toxicwind/ledger](https://github.com/toxicwind/ledger) | — |
| `lib` | general | 📁 `Workspace` | [toxicwind/lib](https://github.com/toxicwind/lib) | [toxicwind/lib](https://github.com/toxicwind/lib) | — |
| `loom` | general | 📁 `Workspace` | [toxicwind/loom](https://github.com/toxicwind/loom) | [toxicwind/loom](https://github.com/toxicwind/loom) | — |
| `matter-server` | general | 📁 `Workspace` | [toxicwind/matter-server](https://github.com/toxicwind/matter-server) | [toxicwind/matter-server](https://github.com/toxicwind/matter-server) | — |
| `maw` | general | 📁 `Workspace` | [toxicwind/maw](https://github.com/toxicwind/maw) | [toxicwind/maw](https://github.com/toxicwind/maw) | — |
| `mcp` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/mcp](https://github.com/toxicwind/mcp) | [toxicwind/mcp](https://github.com/toxicwind/mcp) | — |
| `mcpproxy-go` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/mcpproxy-go](https://github.com/toxicwind/mcpproxy-go) | [toxicwind/mcpproxy-go](https://github.com/toxicwind/mcpproxy-go) | — |
| `mesh` | general | 📁 `Workspace` | [toxicwind/mesh](https://github.com/toxicwind/mesh) | [toxicwind/mesh](https://github.com/toxicwind/mesh) | — |
| `meta-research-toolkit` | research | 📁 `Workspace` | [toxicwind/meta-research-toolkit](https://github.com/toxicwind/meta-research-toolkit) | [toxicwind/meta-research-toolkit](https://github.com/toxicwind/meta-research-toolkit) | — |
| `metaaivm` | research | 📁 `Workspace` | [toxicwind/metaaivm](https://github.com/toxicwind/metaaivm) | [toxicwind/metaaivm](https://github.com/toxicwind/metaaivm) | — |
| `metaaivm-profile` | research | 📁 `Workspace` | [toxicwind/metaaivm-profile](https://github.com/toxicwind/metaaivm-profile) | [toxicwind/metaaivm-profile](https://github.com/toxicwind/metaaivm-profile) | — |
| `metaclaw-runtime` | research | 📁 `Workspace` | [toxicwind/metaclaw-runtime](https://github.com/toxicwind/metaclaw-runtime) | [toxicwind/metaclaw-runtime](https://github.com/toxicwind/metaclaw-runtime) | — |
| `mission-control` | corral | 📁 `Workspace` | [toxicwind/mission-control](https://github.com/toxicwind/mission-control) | [toxicwind/mission-control](https://github.com/toxicwind/mission-control) | — |
| `ml-serve` | herd | 📁 `Workspace` | [toxicwind/ml-serve](https://github.com/toxicwind/ml-serve) | [toxicwind/ml-serve](https://github.com/toxicwind/ml-serve) | — |
| `muse-cli` | olympus | 📁 `Workspace` | [toxicwind/muse-cli](https://github.com/toxicwind/muse-cli) | [toxicwind/muse-cli](https://github.com/toxicwind/muse-cli) | — |
| `muse-web-bundle-decode` | general | 📁 `Workspace` | `—` | `—` | — |
| `naming-audit` | skills | 📁 `Workspace` | [toxicwind/naming-audit](https://github.com/toxicwind/naming-audit) | [toxicwind/naming-audit](https://github.com/toxicwind/naming-audit) | — |
| `nim-inkling-api-research` | nim | 📁 `Workspace` | [toxicwind/nim-inkling-api-research](https://github.com/toxicwind/nim-inkling-api-research) | [toxicwind/nim-inkling-api-research](https://github.com/toxicwind/nim-inkling-api-research) | — |
| `nim-omnibus` | nim | 📁 `Workspace` | [toxicwind/nim-omnibus](https://github.com/toxicwind/nim-omnibus) | [toxicwind/nim-omnibus](https://github.com/toxicwind/nim-omnibus) | — |
| `null-g-proxy` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/null-g-proxy](https://github.com/toxicwind/null-g-proxy) | [toxicwind/null-g-proxy](https://github.com/toxicwind/null-g-proxy) | — |
| `nuvio` | general | 📁 `Workspace` | [toxicwind/nuvio](https://github.com/toxicwind/nuvio) | [toxicwind/nuvio](https://github.com/toxicwind/nuvio) | — |
| `nvidia-alive` | herd | 📁 `Workspace` | [toxicwind/nvidia-alive](https://github.com/toxicwind/nvidia-alive) | [toxicwind/nvidia-alive](https://github.com/toxicwind/nvidia-alive) | — |
| `nvidia-kernel-guard` | herd | 📁 `Workspace` | [toxicwind/nvidia-kernel-guard](https://github.com/toxicwind/nvidia-kernel-guard) | [toxicwind/nvidia-kernel-guard](https://github.com/toxicwind/nvidia-kernel-guard) | — |
| `nvidia-nim-model-probe` | herd | 📁 `Workspace` | [toxicwind/nvidia-nim-model-probe](https://github.com/toxicwind/nvidia-nim-model-probe) | [toxicwind/nvidia-nim-model-probe](https://github.com/toxicwind/nvidia-nim-model-probe) | — |
| `oh-my-pi` | general | 📁 `Workspace` | [toxicwind/oh-my-pi](https://github.com/toxicwind/oh-my-pi) | [toxicwind/oh-my-pi](https://github.com/toxicwind/oh-my-pi) | — |
| `OmniRoute` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/OmniRoute](https://github.com/toxicwind/OmniRoute) | [toxicwind/OmniRoute](https://github.com/toxicwind/OmniRoute) | — |
| `omp-test-runner-watchdog-OzX7V0` | general | 📁 `Workspace` | `—` | `—` | — |
| `openfang` | general | 📁 `Workspace` | [toxicwind/openfang](https://github.com/toxicwind/openfang) | [toxicwind/openfang](https://github.com/toxicwind/openfang) | — |
| `openfang-join` | general | 📁 `Workspace` | [toxicwind/openfang-join](https://github.com/toxicwind/openfang-join) | [toxicwind/openfang-join](https://github.com/toxicwind/openfang-join) | — |
| `openrouter-probe` | herd | 📁 `Workspace` | [toxicwind/openrouter-probe](https://github.com/toxicwind/openrouter-probe) | [toxicwind/openrouter-probe](https://github.com/toxicwind/openrouter-probe) | — |
| `ops` | estate-ops | 📁 `Workspace` | [toxicwind/ops](https://github.com/toxicwind/ops) | [toxicwind/ops](https://github.com/toxicwind/ops) | — |
| `opsis` | olympus | 📁 `Workspace` | [toxicwind/opsis](https://github.com/toxicwind/opsis) | [toxicwind/opsis](https://github.com/toxicwind/opsis) | — |
| `outlier-toolkit` | skills | 📁 `Workspace` | [toxicwind/outlier-toolkit](https://github.com/toxicwind/outlier-toolkit) | [toxicwind/outlier-toolkit](https://github.com/toxicwind/outlier-toolkit) | — |
| `outsource` | oracle | 📁 `Workspace` | [toxicwind/outsource](https://github.com/toxicwind/outsource) | [toxicwind/outsource](https://github.com/toxicwind/outsource) | — |
| `pack-fix` | estate-ops | 📁 `Workspace` | [toxicwind/pack-fix](https://github.com/toxicwind/pack-fix) | [toxicwind/pack-fix](https://github.com/toxicwind/pack-fix) | — |
| `paper-poller` | estate-ops | 📁 `Workspace` | [toxicwind/paper-poller](https://github.com/toxicwind/paper-poller) | [toxicwind/paper-poller](https://github.com/toxicwind/paper-poller) | — |
| `pdfshield` | security | 📁 `Workspace` | [purvalsingh/pdfshield](https://github.com/purvalsingh/pdfshield) | [purvalsingh/pdfshield](https://github.com/purvalsingh/pdfshield) | — |
| `pearlctl` | general | 📁 `Workspace` | [toxicwind/pearlctl](https://github.com/toxicwind/pearlctl) | [toxicwind/pearlctl](https://github.com/toxicwind/pearlctl) | — |
| `phone-lane` | general | 📁 `Workspace` | [toxicwind/phone-lane](https://github.com/toxicwind/phone-lane) | [toxicwind/phone-lane](https://github.com/toxicwind/phone-lane) | — |
| `phone-ocr-sweep` | general | 📁 `Workspace` | [toxicwind/phone-ocr-sweep](https://github.com/toxicwind/phone-ocr-sweep) | [toxicwind/phone-ocr-sweep](https://github.com/toxicwind/phone-ocr-sweep) | — |
| `phone-sentinel` | general | 📁 `Workspace` | `—` | `—` | — |
| `pinax` | olympus | 📁 `Workspace` | [toxicwind/pinax](https://github.com/toxicwind/pinax) | [toxicwind/pinax](https://github.com/toxicwind/pinax) | — |
| `pj-fast` | general | 📁 `Workspace` | [toxicwind/pj-fast](https://github.com/toxicwind/pj-fast) | [toxicwind/pj-fast](https://github.com/toxicwind/pj-fast) | — |
| `plugin-ecosystem` | general | 📁 `Workspace` | [toxicwind/plugin-ecosystem](https://github.com/toxicwind/plugin-ecosystem) | [toxicwind/plugin-ecosystem](https://github.com/toxicwind/plugin-ecosystem) | — |
| `plugins` | general | 📁 `Workspace` | `—` | `—` | — |
| `pollinations-proxy` | general | 📁 `Workspace` | `—` | `—` | — |
| `projects` | general | 📁 `Workspace` | `—` | `—` | — |
| `propylon` | general | 📁 `Workspace` | `—` | `—` | — |
| `provider-fuzz` | general | 📁 `Workspace` | `—` | `—` | — |
| `proxy` | general | 📁 `Workspace` | `—` | `—` | — |
| `pylae` | general | 📁 `Workspace` | `—` | `—` | — |
| `qed` | general | 📁 `Workspace` | `—` | `—` | — |
| `ralph-dashboard` | general | 📁 `Workspace` | [toxicwind/ralph-dashboard](https://github.com/toxicwind/ralph-dashboard) | [toxicwind/ralph-dashboard](https://github.com/toxicwind/ralph-dashboard) | — |
| `ranch-analyze` | general | 📁 `Workspace` | `—` | `—` | — |
| `range` | general | 📁 `Workspace` | `—` | `—` | — |
| `rankings` | general | 📁 `Workspace` | `—` | `—` | — |
| `rawhide` | general | 📁 `Workspace` | `—` | `—` | — |
| `refusal-hunt` | research | 📁 `Workspace` | [toxicwind/refusal-hunt](https://github.com/toxicwind/refusal-hunt) | [toxicwind/refusal-hunt](https://github.com/toxicwind/refusal-hunt) | — |
| `rename-roundup` | general | 📁 `Workspace` | `—` | `—` | — |
| `repo-first-class` | general | 📁 `Workspace` | [toxicwind/repo-first-class](https://github.com/toxicwind/repo-first-class) | [toxicwind/repo-first-class](https://github.com/toxicwind/repo-first-class) | — |
| `research` | general | 📁 `Workspace` | `—` | `—` | — |
| `rig` | general | 📁 `Workspace` | [toxicwind/rig](https://github.com/toxicwind/rig) | [toxicwind/rig](https://github.com/toxicwind/rig) | — |
| `rig-ciwatch` | general | 📁 `Workspace` | `—` | `—` | — |
| `rodeo` | general | 📁 `Workspace` | `—` | `—` | — |
| `roundup` | general | 📁 `Workspace` | `—` | `—` | — |
| `roundup-site` | research | 📁 `Workspace` | [owieth/turborepo-example](https://github.com/owieth/turborepo-example) | [owieth/turborepo-example](https://github.com/owieth/turborepo-example) | — |
| `routing` | general | 📁 `Workspace` | `—` | `—` | — |
| `routing-score` | general | 📁 `Workspace` | `—` | `—` | — |
| `rust-algo-web` | general | 📁 `Workspace` | `—` | `—` | — |
| `rust-wrappers` | security | 📁 `Workspace` | [toxicwind/rust-wrappers](https://github.com/toxicwind/rust-wrappers) | [toxicwind/rust-wrappers](https://github.com/toxicwind/rust-wrappers) | — |
| `rustdesk-server` | general | 📁 `Workspace` | `—` | `—` | — |
| `ryzen3090-whoa` | general | 📁 `Workspace` | `—` | `—` | — |
| `safety-review-gate` | skills | 📁 `Workspace` | [toxicwind/safety-review-gate](https://github.com/toxicwind/safety-review-gate) | [toxicwind/safety-review-gate](https://github.com/toxicwind/safety-review-gate) | — |
| `saturation-guard` | general | 📁 `Workspace` | `—` | `—` | — |
| `secretsmith` | security | 📁 `Workspace` | [toxicwind/secretsmith](https://github.com/toxicwind/secretsmith) | [toxicwind/secretsmith](https://github.com/toxicwind/secretsmith) | — |
| `session-bus-refresh` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/session-bus-refresh](https://github.com/toxicwind/session-bus-refresh) | [toxicwind/session-bus-refresh](https://github.com/toxicwind/session-bus-refresh) | — |
| `shell` | general | 📁 `Workspace` | `—` | `—` | — |
| `skillforge` | ranch-structure | 📁 `Workspace` | [toxicwind/skillforge](https://github.com/toxicwind/skillforge) | [toxicwind/skillforge](https://github.com/toxicwind/skillforge) | — |
| `spark` | general | 📁 `Workspace` | `—` | `—` | — |
| `spark-harvest` | general | 📁 `Workspace` | `—` | `—` | — |
| `squawk` | general | 📁 `Workspace` | `—` | `—` | — |
| `squawk-watchdog` | general | 📁 `Workspace` | `—` | `—` | — |
| `squawk-ws` | general | 📁 `Workspace` | `—` | `—` | — |
| `stable` | general | 📁 `Workspace` | `—` | `—` | — |
| `standalone` | general | 📁 `Workspace` | `—` | `—` | — |
| `stash-guard` | general | 📁 `Workspace` | `—` | `—` | — |
| `stealthprint` | security | 📁 `Workspace` | [toxicwind/stealthprint](https://github.com/toxicwind/stealthprint) | [toxicwind/stealthprint](https://github.com/toxicwind/stealthprint) | — |
| `stream-broker` | general | 📁 `Workspace` | `—` | `—` | — |
| `strudel-dev-vite` | general | 📁 `Workspace` | [toxicwind/strudel-dev-vite](https://github.com/toxicwind/strudel-dev-vite) | [toxicwind/strudel-dev-vite](https://github.com/toxicwind/strudel-dev-vite) | — |
| `strudel-sampler-server-vite` | general | 📁 `Workspace` | [toxicwind/strudel-sampler-server-vite](https://github.com/toxicwind/strudel-sampler-server-vite) | [toxicwind/strudel-sampler-server-vite](https://github.com/toxicwind/strudel-sampler-server-vite) | — |
| `submodules` | general | 📁 `Workspace` | `—` | `—` | — |
| `super-board` | corral | 📁 `Workspace` | [toxicwind/super-board](https://github.com/toxicwind/super-board) | [toxicwind/super-board](https://github.com/toxicwind/super-board) | — |
| `switchboard` | general | 📁 `Workspace` | `—` | `—` | — |
| `task-launch` | general | 📁 `Workspace` | `—` | `—` | — |
| `tau` | general | 📁 `Workspace` | `—` | `—` | — |
| `tau-extensions` | general | 📁 `Workspace` | `—` | `—` | — |
| `tau-verify` | olympus | 📁 `Workspace` | [toxicwind/tau](https://github.com/toxicwind/tau) | [toxicwind/tau](https://github.com/toxicwind/tau) | — |
| `tok` | general | 📁 `Workspace` | [toxicwind/tok](https://github.com/toxicwind/tok) | [toxicwind/tok](https://github.com/toxicwind/tok) | — |
| `toolcall-agent` | general | 📁 `Workspace` | `—` | `—` | — |
| `toolkit` | general | 📁 `Workspace` | `—` | `—` | — |
| `tools` | general | 📁 `Workspace` | `—` | `—` | — |
| `toxicwind-repos` | estate-ops | 📁 `Workspace` | [toxicwind/toxicwind-repos](https://github.com/toxicwind/toxicwind-repos) | [toxicwind/toxicwind-repos](https://github.com/toxicwind/toxicwind-repos) | — |
| `trading-post` | oracle | 📁 `Workspace` | [toxicwind/trading-post](https://github.com/toxicwind/trading-post) | [toxicwind/trading-post](https://github.com/toxicwind/trading-post) | — |
| `universal-keypool-bun` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/universal-keypool-bun](https://github.com/toxicwind/universal-keypool-bun) | [toxicwind/universal-keypool-bun](https://github.com/toxicwind/universal-keypool-bun) | — |
| `universal-keypool-gateway` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/universal-keypool-gateway](https://github.com/toxicwind/universal-keypool-gateway) | [toxicwind/universal-keypool-gateway](https://github.com/toxicwind/universal-keypool-gateway) | — |
| `VansRouter` | gatehouse-mcp | 📁 `Workspace` | [toxicwind/VansRouter](https://github.com/toxicwind/VansRouter) | [toxicwind/VansRouter](https://github.com/toxicwind/VansRouter) | — |
| `vendor` | general | 📁 `Workspace` | `—` | `—` | — |
| `websites` | general | 📁 `Workspace` | `—` | `—` | — |
| `windmill` | general | 📁 `Workspace` | `—` | `—` | — |
| `workmux` | corral | 📁 `Workspace` | [toxicwind/workmux](https://github.com/toxicwind/workmux) | [toxicwind/workmux](https://github.com/toxicwind/workmux) | — |
| `yote` | general | 📁 `Workspace` | [toxicwind/yote](https://github.com/toxicwind/yote) | [toxicwind/yote](https://github.com/toxicwind/yote) | — |
| `yote-maximal` | general | 📁 `Workspace` | `—` | `—` | — |
| `zed-android-port` | general | 📁 `Workspace` | [toxicwind/zed-android-port](https://github.com/toxicwind/zed-android-port) | [toxicwind/zed-android-port](https://github.com/toxicwind/zed-android-port) | — |
| `zero-transport` | general | 📁 `Workspace` | `—` | `—` | — |

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
