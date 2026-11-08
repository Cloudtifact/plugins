# Submitting Cloudy to Grok (xAI)

Checked 2026-11-08 with Grok CLI `grok 1.0.77 (50ca579fa996) [stable]` and xai-org/plugin-marketplace at commit `7d901de1fa75a6ecbeedd0dc46ca28b2254d4626` (2026-11-06).

There are two separate places:

1. **Grok Build** (the `grok` CLI): a plugin marketplace. The official catalog is the public GitHub repo **xai-org/plugin-marketplace**, and you get listed by opening a pull request. This folder is the plugin for it.
2. **grok.com connectors** (the chat app): users can add any remote MCP server by URL. There is **no directory that third parties can apply to**; only xAI's own built-in connectors are listed. Nothing to submit there; see "grok.com" below.

Sources:
- https://x.ai/news/grok-plugin-marketplace (2026-06-11: "submit a pull request to xai-org/plugin-marketplace")
- https://github.com/xai-org/plugin-marketplace (README.md, CONTRIBUTING.md, .github/PULL_REQUEST_TEMPLATE.md)
- Grok CLI user guide, shipped with the CLI: `~/.grok/docs/user-guide/09-plugins.md`, `07-mcp-servers.md`
- https://docs.x.ai/grok/connectors and https://docs.x.ai/grok/connectors/custom-mcp-tunneling

No fees, no developer account, no agreement to sign beyond GitHub's own. Review is a code-owner review on the PR, plus CI. No screenshots or video.

## What's in this folder

| File | Why |
|---|---|
| `.grok-plugin/plugin.json` | Manifest (name `cloudy`, version 0.3.3, author, license, keywords, logo). |
| `.mcp.json` | The hosted MCP server. **The only place the MCP address lives** in this package. |
| `skills/cloudtifact/SKILL.md` | **Copy** of `plugins/cloudy/skills/cloudtifact/SKILL.md`. Grok refuses to load skills that sit or link outside the plugin folder, so it can't be referenced by `../`. **Resync it whenever the CLI's skill changes** (`cp plugins/cloudy/skills/cloudtifact/SKILL.md grok/skills/cloudtifact/`). |
| `commands/*.md` | Copies of `plugins/cloudy/commands/*.md` (`/cloudy:publish`, `/cloudy:comments`, `/cloudy:status`). Resync with the skill. |
| `assets/icon.png` | 256x256 copy of `assets/icon-256.png` (manifest `logo`). |
| `README.md` | Install, what it does, what data it sends. xAI asks that the README states the endpoints and credentials. |
| `marketplace-entry.json` | The exact entry to add to xai-org's catalog. |

## MCP address

`.mcp.json` points at `https://mcp.cloudtifact.com/mcp`. If the server moves to `mcp.usecloudy.ai`, change that one line, commit, and bump the pinned `sha` in xai-org's catalog (see "Updating" below). Also add `mcp.usecloudy.ai` to `domains` in the catalog entry then.

## Before the PR (lead / John)

1. Merge this `grok/` folder to `main` of github.com/Cloudtifact/plugins (must be public, which it is).
2. Get the commit to pin: `git ls-remote https://github.com/Cloudtifact/plugins.git HEAD`. Use the full 40-character sha.
3. Put that sha in `marketplace-entry.json` in place of `REPLACE_WITH_40_CHAR_COMMIT_SHA_ON_MAIN`.
4. Optional, but makes `grok plugin marketplace add Cloudtifact/plugins` install this folder (with MCP) instead of `plugins/cloudy` (no MCP): add `.grok-plugin/marketplace.json` at the repo root (Grok reads it before `.claude-plugin/marketplace.json`). Contents: the same as `.claude-plugin/marketplace.json` but with `"source": { "type": "local", "path": "./grok" }`. Not needed for the xai-org listing.

## The PR (John)

1. Fork https://github.com/xai-org/plugin-marketplace, branch from `main` (e.g. `add-cloudy`).
2. Append the object in `marketplace-entry.json` to the `plugins` array in `.grok-plugin/marketplace.json` (keep 2-space indent, trailing newline).
3. Run, from the fork's root (needs Python 3 and git; it fetches every listed plugin, takes a few minutes):
   ```
   python3 scripts/generate-plugin-index.py
   python3 scripts/validate-catalog.py
   python3 scripts/generate-plugin-index.py --check
   ```
4. Commit both `.grok-plugin/marketplace.json` and the regenerated `.grok-plugin/plugin-index.json`. Never hand-edit the index.
5. Open the PR. Title: `Add cloudy plugin`. Fill the template:

```
## What this PR does

- Plugin name: cloudy
- Type: remote source
- Source URL + pinned SHA (remote), or vendored path (local): https://github.com/Cloudtifact/plugins.git @ <sha>, path `grok`
- Homepage: https://usecloudy.ai

## Ownership

- [x] I own this plugin or have the right to distribute it.
- [x] The `source` repo is published under our official org (or I've explained why not below).

## Checklist

- [x] Added/updated exactly one entry in `.grok-plugin/marketplace.json` (valid JSON, kebab-case `name`).
- [x] Remote source pins a full 40-char lowercase commit `sha`, and that commit is public + reachable.
- [x] Regenerated `.grok-plugin/plugin-index.json` (`python3 scripts/generate-plugin-index.py`).
- [x] `python3 scripts/validate-catalog.py` passes locally.
- [x] `python3 scripts/generate-plugin-index.py --check` passes locally.
- [x] `homepage` + clear `description` set; local plugins include `README.md` + `.grok-plugin/plugin.json`.
- [x] License is stated. (MIT)

## Security

- [x] No `curl | bash`, remote-code download/exec, or `postinstall` RCE.
- [x] No reading/exfiltration of secrets, tokens, `.env`, or env vars.
- [x] Hooks and MCP scope are least-privilege.
- Network endpoints this plugin calls (and why): Cloudy's hosted MCP server (the URL in `grok/.mcp.json`), to publish pages and read and answer comments. The commands run the Cloudy CLI (`usecloudy` on npm), which calls Cloudy's API. No hooks, no scripts.
- Credentials/permissions it requires (and why): the user signs in with their Cloudy account through MCP OAuth 2.1 + PKCE (dynamic client registration) on first connect. No API key.

## Notes for reviewers

Cloudy was called Cloudtifact until recently; the GitHub org (`Cloudtifact`), the MCP host and the skill id `cloudtifact` keep the old name. The org is ours: usecloudy.ai links to it, and the npm package `usecloudy` is published by the same team.
```

6. Wait for CI + review. Answer reviewer comments on the PR.

## Updating later

xai-org runs a daily job (`bump-plugin-shas.yml`) that opens a bump PR when our repo's HEAD moved **and** the version in `grok/.grok-plugin/plugin.json` changed. So: bump `version` in `grok/.grok-plugin/plugin.json` with each release and the catalog follows (after their manual review). Otherwise open a PR that changes `sha` and regenerates the index.

## Art

None required. The catalog has no icon, screenshot or banner fields. The manifest `logo` uses `assets/icon.png` (256x256 PNG, already copied). Some listed plugins ship an SVG logo; if the lead has an SVG of the mark, `assets/logo.svg` would be nicer, but it isn't needed.

## Blockers / risks

- The `grok/` folder must be on a public commit before the PR (step 1 above).
- Brand vs org name: CONTRIBUTING.md says a brand sourced from a differently named account "reads as a possible impersonation and will be questioned". `cloudy` from `Cloudtifact/plugins` may get a question; the reviewer note above covers it. Linking https://github.com/Cloudtifact/plugins from usecloudy.ai (footer or docs) makes it verifiable.
- `keywords`/`domains` must be brand-scoped (they drive Grok's "suggest this plugin" prompt). Generic words like `publish`, `html`, `share` would be pushed back, so they're left out.
- Not tested: completing the MCP sign-in inside Grok (needs a browser sign-in with a real account). `grok mcp doctor` reached the server and got the expected 401 with `resource_metadata`, so discovery starts. John can check: install, `/mcps`, select `cloudy`, press `i`.
- `/status` collides with Grok's built-in, so the command shows as `/cloudy:status`. Fine.

## grok.com (chat app) connectors

From https://docs.x.ai/grok/connectors: go to grok.com/connectors, **New Connector**, **Custom**, paste the MCP server URL, and sign in. The server must be reachable on the public internet. Business and Enterprise teams need an admin to provision connectors in the console first. There is no application form or public directory for third-party connectors, so nothing to submit. Users can add Cloudy themselves with the URL in `.mcp.json`. The docs don't say which OAuth redirect URIs grok.com uses; our server accepts dynamic client registration, so it should work, but no one has tried it yet. Worth a manual test from John's grok.com account.

## Validation run (2026-11-08)

```
$ grok plugin validate ~/Documents/cloudy-plugins/grok
Plugin manifest is valid.
  name: cloudy
  version: 0.3.3
  components: 1 skill dir(s), 1 command dir(s), 0 agent dir(s), MCP servers
```

Isolated install (temp `HOME=/tmp/t0279-grok/home`, own leader socket; John's `~/.grok` untouched):

```
$ grok plugin install ~/Documents/cloudy-plugins/grok --trust
Installed 1 plugin(s) ...: cloudy
$ grok inspect
  Skills: cloudtifact, comments, publish, status [collides with /status -> /cloudy:status]  (plugin: cloudy)
  Plugins: cloudy (user, enabled)  1 skills, 1 MCPs
  MCP Servers: cloudy (http)  plugin: cloudy
$ grok mcp doctor
  cloudy (http: https://mcp.cloudtifact.com/mcp)  server started; handshake: Auth required (expected before sign-in)
```

xai-org's own scripts, on a scratch copy of their repo with Cloudy vendored as a local source (the remote form can't be fetched until `grok/` is pushed):

```
$ python3 scripts/generate-plugin-index.py   -> Wrote .grok-plugin/plugin-index.json
$ python3 scripts/validate-catalog.py        -> Catalog OK (.grok-plugin/marketplace.json)
$ python3 scripts/generate-plugin-index.py --check -> Plugin index OK (.grok-plugin/plugin-index.json)
index entry for cloudy: version 0.3.3; commands comments/publish/status; mcpServers cloudy (http); skills cloudtifact
```

Root marketplace option (step 4 under "Before the PR"), tried on a scratch copy of the repo with `.grok-plugin/marketplace.json` pointing at `./grok`: `grok plugin list --json --available` showed `cloudy` 0.3.3 with `"has_mcp": true`, `grok plugin install cloudy --trust` installed it, and `grok inspect` listed the `cloudy (http)` MCP server.

The existing `plugins/cloudy` (Claude layout) also loads in Grok as-is via `grok plugin marketplace add <repo>` + `grok plugin install cloudy`: skill and 3 commands, no MCP, and version shows as null because Grok reads `plugins/cloudy/plugin.json` (name and description only) before `.claude-plugin/plugin.json`.
