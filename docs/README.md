# pens/docs — the master docs of all pens

The single documentation root for the whole pens namespace. Every pen ships its
own `docs/` next to its products; this index is the connective surface that
links them, plus the fabric-wide documents that span pens.

It is the stigmergic shared trace for docs: docs-mcp indexes every `*.md` under
`/home/toxic/pens/**`, so anything placed here (and in every pen/product `docs/`)
is queryable through the docs MCP.

## Fabric (cross-pen connective tissue)

- [`fabric-plan.md`](../estate/docs/fabric-plan.md) — the 2026-11-01 decision doc:
  stigmergy+holarchy+panarchy, fabric.json registry SSOT, toolkit-mcp, blue-green.
- [`fabric.json`](../toolkit/fabric.json) — the live service catalog (13 pens /
  305 products, git HEAD + dirty), minted by `toolkit/gen-fabric.ts`.

## Pen index

| Pen | Master docs | Products |
|-----|-------------|----------|
| agentic-moment | [`agentic-moment/docs`](../agentic-moment/docs/) | audit engine, moments, site |
| barn | [`barn/docs`](../barn/docs/) | estate-ops + utility products |
| dedicated | [`dedicated/docs`](../dedicated/docs/) | dedicated-server-ops, dedicated-mcp |
| estate | [`estate/docs`](../estate/docs/) | control-plane, docs-mcp, config |
| ergasterion | [`ergasterion/docs`](../ergasterion/docs/) | hephaistos + forge products |
| fathom | [`fathom/docs`](../fathom/docs/) | strudel/audio products (fathom-docs) |
| forge | [`forge/docs`](../forge/docs/) | operator/DSP products |
| geode | [`geode/docs`](../geode/docs/) | azurite skills, trio, catalog products |
| mesh | [`mesh/docs`](../mesh/docs/) | mesh products |
| nomenclator | [`nomenclator/docs`](../nomenclator/docs/) | naming/catalog products |
| olympus | [`olympus/docs`](../olympus/docs/) | coding agents (tau, kappa), Greek lineage |
| ranch | [`ranch/docs`](../ranch/docs/) | component products (oh-my-pi, nuvio, ...) |
| recon | [`recon/docs`](../recon/docs/) | recon products |

## Conventions

- Pen `docs/` = that pen's master docs; product `docs/` = that product's docs.
- docs-mcp is the query surface; `fabric.json` is the live service truth.
- Add fabric-level notes here, per-pen notes in the pen's own `docs/`.
