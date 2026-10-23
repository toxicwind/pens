# ranch/FORKS.md

Every `ranch/*` directory is a vendored fork, indexed here with its upstream and
`toxicwind/*` counterpart. Pinned SHAs capture the exact tip; bump intentionally
and re-record.

| ranch dir              | Upstream                 | toxicwind fork                   | Pinned SHA     | Status                                     |
| ---------------------- | ------------------------ | -------------------------------- | -------------- | ------------------------------------------ |
| AgentForensics         | aparnaa19/AgentForensics | (none)                           | 962a28b        | upstream-only                              |
| doorbell               | (none)                   | toxicwind/doorbell               | 24d228c        | first-party                                |
| estate-scripts         | (none)                   | (estates internal)               | 5150e09        | first-party                                |
| ferret-den             | (none)                   | toxicwind/ferret-den             | aa575f7        | first-party                                |
| gayxxx-estate-scripts  | (none)                   | toxicwind/ranch                  | 57d56a3        | estate-internal                            |
| gear                   | (none)                   | (estate internal)                | 326d7bd        | first-party                                |
| hyprgrid               | Aetherall/hyprgrid       | (none)                           | 5c6bbb1        | upstream-only                              |
| Hyprgrid-gestures      | jairnarvaez/Hyprgrid     | (none)                           | af395bc        | upstream-only                              |
| **kilo-code**          | **Kilo-Org/kilocode**    | **toxicwind/kilo-code**          | **a72ad30628** | **first-party fork (2026-10-15)**          |
| **kilo-cli**           | **Kilo-Org/kilo-cli**    | **toxicwind/kilo-cli**           | **6f08110d4**  | **first-party fork (2026-10-15)**          |
| kitty-mcp-server       | (none)                   | toxicwind/kitty-mcp-server       | f223c5c        | first-party                                |
| muse-cli               | (none)                   | toxicwind/muse-cli               | 8de07a3        | first-party                                |
| nvidia-alive           | (none)                   | toxicwind/nvidia-alive           | d78720f        | first-party                                |
| nvidia-kernel-guard    | (none)                   | toxicwind/nvidia-kernel-guard    | a7089eb        | first-party                                |
| nvidia-nim-model-probe | (none)                   | toxicwind/nvidia-nim-model-probe | 21e8136        | first-party                                |
| outlier-toolkit        | (none)                   | toxicwind/outlier-toolkit        | b242ba2        | first-party                                |
| paper-poller           | (none)                   | toxicwind/paper-poller           | f65799f        | first-party                                |
| pd-mcp-standalone      | (none)                   | toxicwind/pd-mcp                 | 43b6056        | first-party                                |
| pearlctl               | (none)                   | toxicwind/pearlctl               | f07ea5b        | first-party                                |
| pj-fast                | (none)                   | toxicwind/pj-fast                | 5333d10        | first-party                                |
| ralph-dashboard        | (none)                   | toxicwind/ralph-dashboard        | 567758e        | first-party                                |
| refusal-hunt           | (none)                   | toxicwind/refusal-hunt           | 39e0d46        | first-party                                |
| repo-first-class       | (none)                   | toxicwind/repo-first-class       | 09d1f21        | first-party                                |
| rig                    | (none)                   | toxicwind/rig                    | 0dad0aa        | first-party                                |
| rsync-mcp              | (none)                   | toxicwind/rsync-mcp              | 5b79242        | first-party                                |
| safety-review-gate     | (none)                   | toxicwind/safety-review-gate     | f9f0223        | first-party                                |
| secretsmith            | (none)                   | toxicwind/secretsmith            | b5b4632        | first-party                                |
| qed                    | (none)                   | (none)                           | (vendored)     | first-party                                |
| ranch/tau              | (none)                   | (own repo)                       | (own repo)     | first-party                                |
| **borrowed/delendai**  | **CartagoGit/DelendAI**  | **toxicwind/DelendAI**           | **b9f8d51**    | **maximal Bun scaffold fork (2026-10-20)** |

(Excerpt — full inventory is regenerable via `for d in */; do if [ -d "$d/.git" ]; then git -C "$d" remote get-url origin 2>/dev/null; fi; done`.)

## Naming policy

- **Dodge-name landmines**: avoid names that collide with upstream product names.
  The "hatch" dodge was retired 2026-10-15 because Meta's VM gateway is
  literally named `hatch.metaaivm.com` (see `~/kite/docs-meta-muse-hatch.md`).
  Our cell is **kite** (real) / hatch (dodge); agents are **eyas**.
- **Submodule structure** is the target end-state for every fork (per
  standing doctrine); vendored-in-tree (qed/zed pattern) is the current
  intermediate. The `ranch/` gitignore line 1210 keeps ranch as its own
  subrepo boundary; submodules would live _under_ ranch/ as separate git
  trees with their own .git.

## Bump procedure

1. Update the SHA in this table.
2. `git pull --rebase origin main` in the affected dir.
3. Bump the KILO_VERSION file (or equivalent) in the fork.
4. Push the fork's `main` to `toxicwind/<name>`.
5. Commit the FORKS.md change to `ranch` and push.
