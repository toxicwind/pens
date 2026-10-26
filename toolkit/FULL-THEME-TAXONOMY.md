# Full theme taxonomy — the complete holder set (fully theme the estate)

> The goal is NOT 2 holders (ranch/olympus). It is a RICH set of themed
> bounded-contexts so EVERY repo has a thematic home and `general` shrinks to
> near-zero. Each holder is a first-class, named context in the ranch metaphor.

## The complete holder palette

| #   | Holder                   | Holds (themed context)                                                            | Members (from the 214)                                                                                                                                                                                            |
| --- | ------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **olympus**              | Greek-coded products (τ κ skopos kilo muse keryx hodos) + Greek/mythic-root names | tau, kappa, skopos, kilo, muse-cli, keryx, hodos, kairos, kryptos, agon, campfire, chronos-forge, didymos, drover, gavel(+vendor/agora, auction-agent11, contract-net-router), loom, strudel-*, antilogos, arroyo |
| 2   | **ranch-structure**      | the venture's pens/shelters/gates                                                 | barn(+ /flatbread /rosec /weave /nativelink), corral, chute, roost, herd, thresher, cuttinggate, forge, coyote, yote, stable, straw                                                                              |
| 3   | **thresher-mcp**        | MCP gateways + drop-in servers                                                    | mcp, mcp/mcpproxy-go, mcpproxy-go, mcp/mcp-prompt-injection-detector, mcp/pd-mcp-standalone, mcp/rsync-mcp, mcp-dropin-guide, forge-mcp, feedlot-mcp, websearch-mcp-server, wezterm-agent-mcp                     |
| 4   | **corral-orchestration** | agent-market + orchestration/swarms                                               | corral, emergent, doorbell, bridge, cron-trust, mission-control, fanout, stream-broker, session-bus-refresh, oracle                                                                                               |
| 5   | **estate-brain/ops**     | control-plane brains + persona/fleet                                              | estate-brain, estate-recon, estate-chat, estate-monitor, estate-scripts, estate-shell, estate-dispersal, estate-skills, fleet, fleetd, fleet-ops, fleet-chat, squawk, squawk-ws, kodi-fleet, super-board          |
| 6   | **models/herd**          | the model fleet + local inference                                                 | herd, models, hf-model-sync, llama/*, godzilla-llama.cpp, ml-serve, nvidia-alive, nvidia-kernel-guard, nvidia-nim-model-probe                                                                                     |
| 7   | **nim-echo**             | NVIDIA Nim ecosystem clones                                                       | nim-repos/_, nim-_ (api-evangelist, bauka0, david-eve-za, diegovisk, furqanafridi, etc.)                                                                                                                          |
| 8   | **tools/util**           | utility toolkits + probes                                                         | toolkit, outlier-toolkit, meta-research-toolkit, openrouter-probe, ffs-*, ast-grep-rules, naming-audit, safety-review-gate, provider-fuzz                                                                         |
| 9   | **websites/ops**         | deployable sites                                                                  | websites/arlockworks/_, websites/effusionlabs/_                                                                                                                                                                   |
| 10  | **classifier/safety**    | safety/classifier tooling                                                         | classifier, classifier-preflight, safety-review-gate                                                                                                                                                              |
| 11  | **general**              | residual (only truly unthemeable/foreign)                                         | long tail (~40) — shrink target                                                                                                                                                                                   |

## Principles

- **More categories, full theme**: 10-11 holders so near-every repo is themed.
- **`general` is the shrinking residual**, not a catch-all: as repos get mapped to
  a bounded context, general → near-zero.
- **Bounded-context naming** (DDD): each holder is a coherent domain with a clear
  boundary (olympus=Greeks, corral=orchestration, thresher=MCP).
- **Data-driven**: the map lives in `.meta-themes.yaml` (explicit repo→holder);
  the generator is dumb (read map, unknown→general). Grounded by paper-finder
  (subagent `ses_e9dda30a3ffe`).

## Next

Fold this full palette into `.meta-themes.yaml` as the explicit map, then
regenerate. `general` should drop from 145 → ~40 (the truly foreign long tail).
