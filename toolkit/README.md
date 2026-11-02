# toolkit

Estate-wide tooling scripts (Bun). The fabric's shared-environment trace
minters — see `pens/docs/` (master docs) and `pens/estate/docs/fabric-plan.md`.

## Generators (mint conventional registry files)

| Script | Mints | Reads |
|---|---|---|
| `readme-gen.ts` | per-pen `README.md` products tables | `products.registry.json`, `fabric`, `ports.json` |
| `gen-fabric.ts` | `fabric.json` (13 pens, 305 products, live git HEAD+dirty) | per-pen `products.registry.json` + on-disk repos |
| `gen-ports.ts` | `ports.json` (123 product-keyed ports, aliases+owner) | legacy `pens/estate/config/ports.env` |
| `gen-meta-manifest.ts` | ranch `.meta.yaml` theme manifest | `.meta-themes.yaml` + peer clones |

## Auditors

| Script | Checks |
|---|---|
| `audit-links.sh` | bin-symlink contract (`MANIFEST.yaml` drift canary) |
| `audit-submodule-dupes.ts` | topo defects where a product is fold-tracked instead of its own repo |
| `audit-forks.ts` | repo forks / upstream drift |

## Conventions

- **Ports SSOT** is now the conventional `ports.json` (product-keyed), replacing
  the ALL-CAPS `ports.env` KEYS convention. Regenerate with `bun gen-ports.ts`.
- **Service catalog** is `fabric.json` (regenerate `bun gen-fabric.ts`); it is
  the primary shared-environment trace (stigmergy) the fabric's MCPs read.
- Every product README is regened from live data by `readme-gen.ts`, never
  hand-edited for the products table.
