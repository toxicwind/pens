# AGENTS.md — Sovereign Agent (Universal)

You are a gateway-routed agent. You have one permanent capability: talk to the gateway.
Everything else is discovered at runtime. You do not guess roots, tools, or repos.

## 0. Operational reality — the operator has ADHD, and interrupts are the default

**Treat interruption as the norm, not the edge case.** Measured cadence in real
sessions: one interjection every ~30s–3min. You will be cut off mid-thought,
mid-tool, mid-edit, and mid-window constantly. This section is how you hold state
so an interrupt never loses work and never makes you thrash.

### How to hold state under interruption (what you DO, moment to moment)

- **Open every non-trivial turn with one line: "thread: <what I'm doing>, parked:
  <what I'm deliberately not doing>"**. If you get interrupted, that line is your
  single source of truth to re-ground from in seconds.
- **A new user message is always the new priority.** Drop the current tool/thread
  immediately. Read the new instruction. Only after honoring it decide whether the
  old thread is still wanted. Never "finish what you were doing" first — the
  operator redirecting *is* the instruction.
- **Any backgrounded/`&`/detached process dies on interrupt.** Never background a
  long task inside a tool call and walk away. If the work must outlive the turn,
  the deliverable is a **persistable artifact** (a script, a session file to
  `--restore`, a written–to–disk note) that can survive and be re-run — never a
  running process.
- **Mid-tool interrupt = the result is unreliable.** Do NOT re-run blindly and do
  NOT assume it completed. Inspect the actual state (files, processes, sessions)
  before continuing. A partial result may already have landed.
- **Checkpoint before anything long.** Before a multi-step operation, write the
  state — the exact command, the target, the expected artifact — in one line so a
  kill loses nothing that can't be re-derived.
- **Keep ONE active objective.** When redirected, park the old thread in the
  `parked:` line. Do not quietly keep two threads alive; that is how you drift.
- **Interruption is not a rebuke.** An abort is a signal the previous work's
  result is untrusted — verify it, don't apologize for it, don't fight the redirect.

### Command discipline for ADHD operators (shorthand that survives interruption)
- Prefer commands that print their own full result (no `| tail`, no `/dev/null`,
  no `sleep`-then-probe — probe immediately and read what's there).
- Prefer idempotent, re-runnable commands so a re-run after interrupt is safe.
- When a step legitimately needs to run long, hand it to a persistent context
  (a session, a queueable script) — never a shell `&` you'll lose.

## 1. Route doctrine — how to reach a tool

There is exactly one rule that governs every tool call. It resolves the recurring
agent failure, so read it before anything else.

- **Native tools are called by name**: `read`, `bash`, `edit`, `write`, `glob`,
  `grep`, `find`, `ast_grep`, `eval`. They are gated by their own `*.enabled`
  config and `tools.approval.<name>` policy (`deny` hard-blocks the tool).
- **Mounted MCP devices are reached by device-write**: `xd://mcp__<server>_<tool>`.
  To execute one, `write` the JSON arguments object to `xd://mcp__<server>_<tool>`.
  `read xd://` lists the mounted devices for this session; `read xd://<tool>`
  shows one device's docs + JSON schema. Never invent a device name — if it is
  not in `read xd://`, it does not exist.
- **Bare `mcp__<server>_<tool>` is the invoke *name* of an already-mounted device,
  not a separate spelling.** Use it only where the mounted tool is exposed as an
  active native tool in the same session; otherwise route through `xd://`.
- If a tool fails, pick a different one. Never retry the same `grep`/`find`
  command in a loop.

### Confirmed device names (do not invent others)
These are verified-mounted MCP devices you may call via `xd://mcp__…`:

- thresher gateway (:25127): `mcp__thresher_retrieve_tools`,
  `mcp__thresher_call_tool_read`, `mcp__thresher_call_tool_write`,
  `mcp__thresher_call_tool_destructive`
- blackbird gateway (:25113, serverInfo "blackbird-mcp" v0.6.0):
  `mcp__blackbird_search_repositories`, `mcp__blackbird_search_code`,
  `mcp__blackbird_search_unified`, `mcp__blackbird_search_issues`,
  `mcp__blackbird_search_pull_requests`, `mcp__blackbird_search_commits`,
  `mcp__blackbird_get_repository`, `mcp__blackbird_get_file_contents`,
  `mcp__blackbird_compare_search`
- HALLUCINATED / nonexistent: `mcp__blackbird_github_search_repositories`,
  `mcp__gateway_*`. `mcp__gateway_*` tools do not exist — thresher IS the gateway.
- Local omp `mcp.json` must point "blackbird" at :25113, NOT :25112 (that is a
  different frontend, api_port 25112 / frontend 25114).

Use these instead of raw `grep`/`find` over crawl-roots.

## 2. Lock one root, then stay there

- First action on every task: pick ONE root from the user's words.
- Examples: "owntv" = /home/toxic/pens/fleet/devices/android-fleet/products/owntv-fork.
  If no root is clear, ask for it. Do NOT search /home/toxic to guess it.
- Never leave the locked root. Never search siblings, Downloads, or home.

## 3. Search doctrine — scoped, pruned, fast

- No unscoped `find /home/toxic`, no `grep -r /home/toxic`, no unscoped glob.
- **`find`, `grep -r`, and even `rg` are TOO SLOW** over pens trees. Prefer, in
  order: **`ffs` MCP** (indexed, token-budget aware — `ffs mcp`; the fast lane),
  then `glob` (tool), then `rg --files`/`rg -l` with prune globs, then `bun -e`.
  Never `find /home/toxic/pens` bare, never `grep -r /home/toxic/pens`, and avoid
  unscoped `rg` — they walk node_modules/build trees and can take minutes. If you
  must use `find`, scope it with `-maxdepth` AND prune (`.git`, `node_modules`,
  `build`, `dist`, `target`, `cache`, `blobs`, `sessions`). For content search use
  `ffs grep` (with `--root`) or `rg` with `-g` prune globs, never `grep -r`.
- Always prune: node_modules, .git, target, dist, build, .cache, .npm, Downloads,
  .openfang, venv, __pycache__, installs, blobs, sessions, cache.
- If you need a file, search inside the locked root only, with prune.
- One scoped, pruned listing inside the locked root is allowed if no gateway tool fits.
- MASS operations (rename/patch across pens) use the fast lane: `bun -e` + `rg -l`/
  `find` with prune globs, in-place write, timing printed. Never hand-roll slow
  walkers in Python for bulk edits.
- MCP-backed searching routes through section 1: prefer `mcp__thresher_*` /
  `mcp__blackbird_*` devices over shell `grep`/`find` for repository/code lookups.

## 4. Git is per repo — .gitignore * does not hide nested repos

- A parent .gitignore containing `*` does NOT mean nested repos are clean or have
  nothing to push.
- Each directory with its own `.git` is an independent repo.
- Never judge a nested repo from parent `git status`.
- For any git check, push, or commit, run it from inside that repo:
  `git -C <nested-repo> status --porcelain --branch`.
- Never run `git add .` from a parent to cover a nested repo. Never assume parent
  git covers nested.
- Before saying "nothing to push", run the nested-repo check below.

### Nested repo check (run this, do not infer)
- List nested `.git` dirs inside the locked root only, depth <= 3, with prune.
- For each, report: path, branch, ahead/behind, dirty files.
- If ahead > 0, it needs push even if parent shows clean.

## 5. Tool execution rules

- Discovery first: use `mcp__thresher_retrieve_tools` with a shallow verb + noun query.
- Call via `mcp__thresher_call_tool_read` / `write` / `destructive`.
- **Thresher config hot-reloads — never restart it to add/change an MCP server.**
  Editing `pens/barn/products/thresher/mcp_config.json` is picked up automatically
  by its fsnotify config watcher (`internal/runtime/config_watcher.go` →
  `Runtime.ReloadConfiguration`). A restart is only needed for non-hot-reloadable
  changes (listen addr, api_key, require_mcp_auth). Restarting to apply a config
  edit is a mistake that can wedge the gateway.
- **`ffs` is ALREADY a registered thresher MCP server** (`mcp_config.json`, stdio,
  root `/home/toxic`). Use `mcp__thresher_retrieve_tools`/`call_tool_read` against
  the `ffs:*` tools for indexed, token-budget-aware search — never fall back to
  bare `find`/`grep -r`/unscoped `rg`.

## 6. Polyglot forks & topology

- These are complex forks, not one monorepo, not one language.
- Read the locked repo's own manifest before any build/test command.
- owntv-fork = Kotlin/Android, build.gradle.kts. Provider = TypeScript, package.json.
- Do not copy a command from one fork to another.
- **`pens/` is the root.** SSOTs = `pens/olympus/ssot/{tau,kappa}` (`config.yml`,
  `models.yml`, `kappa.jsonc`, `keyring-env.py`); control plane =
  `pens/control-plane/ssot`; products = `pens/{pen}/products/*`. All renames are
  applied tree-wide by lapidary — dirs, filenames, content, refs — nothing is left
  behind.
- **Main code TUI triplet: thresher, tau, kappa — plus hermes.** thresher = MCP
  gateway (:25127, `mcp__thresher_*`); tau = coding agent (`~/.tau`, SSOT
  `pens/olympus/ssot/tau`); kappa = session agent (SSOT `pens/olympus/ssot/kappa`);
  hermes = chat/gateway runtime (`pens/hermes`, config `pens/hermes/config.yaml`).
  Model routing goes through mimetite (:25193) for tau/kappa/hermes lanes.
- **The :25193 router is mimetite, not rhodochrosite.** `rhodochrosite` is a dead
  ghost name — mass-renamed to `mimetite` across pens + ~/.tau (2026-11-12). Never
  reintroduce it.
- **Headless SSH ≠ non-headed.** The box HAS a live X display at `:0`
  (`/tmp/.X11-unix/X0`). Export `DISPLAY=:0` in serve lanes; GUI MCP servers
  (wezterm-agent-mcp) work with it. A missing DISPLAY env is a config fix, not a
  reason to disable the server.
- **hermes gateway**: restarted via `serve.sh` (injects keyring env via
  keyring-env.py, sets HERMES_HOME). Never start with bare `hermes gateway run` —
  no keys → providers 401. The running gateway loads config at startup; restart
  after config changes.
- **429 doctrine**: `unlimited_retry_on_429: true` in hermes config.yaml — 429 is
  transient capacity, retry indefinitely with adaptive backoff, never eager model
  fallback on a concurrency shed. Same doctrine across tau
  (`retry.unlimitedRetryOnConcurrency429`) and kappa (`unlimitedRetryOn429`). A 429
  with a genuine quota/billing body is NOT transient — rotate credentials / surface.
- **hermes MCP servers** (config.yaml `mcp_servers`): thresher =
  http://127.0.0.1:25127/mcp; websearch-skill =
  `pens/ranch/products/mcp/websearch-mcp/server.py` (wrapper, not on PATH); ash =
  `/home/toxic/.local/bin/ash mcp` (CLI has an `mcp` subcommand — bare `ash` prints
  usage); wezterm = `pens/ranch/products/wezterm-agent-mcp/build/cli.js` with
  DISPLAY set.

## 7. Canonical location

- Canonical file: /home/toxic/pens/AGENTS.md
- /home/toxic/AGENTS.md is a symlink to the canonical file. Do not edit the symlink
  target separately.
- Per-project AGENTS.md / CLAUDE.md files are LOCAL to that project. Do NOT symlink
  all of them to the canonical file. Do NOT reroute them. Leave
  `CLAUDE.md -> AGENTS.md` inside each project alone.
- Only /home/toxic/.grok/AGENTS.md points to the canonical file.
- The pens contract (pens structure, nested-git, prune list, federation, monotau
  discipline) lives SEPARATELY in /home/toxic/pens/PENS.agents.md.