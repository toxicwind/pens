# ranch/* fork audit (generated 2026-11-07T00:09:54.723Z)

36 immediate subdirs; **0** have an obvious upstream reference.

By source:

| dir | upstream | source | origin remote |
|---|---|---|---|
| `agentic-moment` | — | — | github.com/toxicwind/agentic-moment.git |
| `archive` | — | — | — |
| `army` | — | — | github.com/toxicwind/army.git |
| `backups` | — | — | — |
| `barn` | — | — | github.com/toxicwind/barn.git |
| `bench` | — | — | github.com/toxicwind/bench.git |
| `codeflux` | — | — | github.com/toxicwind/codeflux.git |
| `dedicated` | — | — | — |
| `docs` | — | — | — |
| `flux` | — | — | github.com/toxicwind/flux.git |
| `estate` | — | — | github.com/toxicwind/estate.git |
| `fathom` | — | — | github.com/toxicwind/fathom.git |
| `fleet` | — | — | github.com/toxicwind/fleet.git |
| `fleets` | — | — | github.com/toxicwind/fleet.git |
| `flux` | — | — | github.com/toxicwind/flux.git |
| `forge` | — | — | — |
| `forge-raw` | — | — | — |
| `geode` | — | — | github.com/toxicwind/geode.git |
| `guide` | — | — | — |
| `hatch-kite-cli` | — | — | github.com/toxicwind/kite-cli.git |
| `kelpie` | — | — | github.com/toxicwind/kelpie.git |
| `logs` | — | — | — |
| `mesh` | — | — | github.com/toxicwind/mesh.git |
| `mosaic` | — | — | github.com/toxicwind/mosaic.git |
| `netrace` | — | — | github.com/toxicwind/netrace.git |
| `nomenclator` | — | — | — |
| `olympus` | — | — | github.com/toxicwind/olympus.git |
| `products` | — | — | — |
| `ranch` | — | — | github.com/toxicwind/ranch.git |
| `recon` | — | — | github.com/toxicwind/recon.git |
| `squawk` | — | — | — |
| `tmp` | — | — | — |
| `toolkit` | — | — | github.com/toxicwind/toolkit.git |
| `v1` | — | — | — |
| `wip` | — | — | — |
| `wtf` | — | — | github.com/toxicwind/wtf.git |



## Sources, in order

1. `.gitmodules` path — the canonical submodule entry
2. `package.json` / `Cargo.toml` / `pyproject.toml` / `go.mod` — package manifest's `repository` field
3. `README.md` — first 50KB scanned for `(upstream X)`, `Forked from`, `Based on`, `Copyright © YYYY <Author> (upstream X)`, `Originally from`
4. `git remote upstream` (or non-toxicwind `origin`) — the remote URL itself
5. **GitHub `parent.full_name`** — for every dir with a GitHub origin (parallel `gh api` calls, cached)

## Regenerate

```bash
cd <ranch-repo-root>
bun toolkit/audit-forks.ts                    # local + cached GitHub lookups
bun toolkit/audit-forks.ts --resolve-origins  # bust the GitHub cache
```
