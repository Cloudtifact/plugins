# Amp: how to get Cloudy listed

## Short answer

Amp (ampcode.com) has **no store, marketplace or listing form** for third-party plugins, skills or MCP servers (checked 2026-11-08). Users add things themselves by URL or repo path. The only places Cloudy could show up are:

1. **`ampcode/amp-contrib`**: a GitHub repo of "Curated skills, tools, MCPs and commands for Amp", installed with `amp skill add ampcode/amp-contrib/<name>`. You get in by opening a PR. It's barely maintained: 2 PRs merged (both from 2026-01 to 2026-03, one by an Amp staffer), 2 third-party PRs still open since July and October 2026, 1 closed. Expect no reply. **Optional, low value.**
2. **The official MCP registry** (registry.modelcontextprotocol.io). Amp's enterprise "MCP Registry Allowlist" uses that protocol, so enterprise admins can only allow servers that are in a registry. Being in the official registry makes Cloudy easy for them to add. That listing is shared across harnesses, so it isn't Amp-specific (another thread may own it).

`ampcode/official-plugins` is not open to us. It holds the skills Amp itself sends to every user, and only Amp staff write them.

Plugins (`amp plugins add <url>`) are TypeScript code run by Bun, shared by URL or through a workspace's plugin repo. They have no public directory, and there is no plugin API for bundling an MCP server. So no plugin was built: the server URL plus the existing skill covers everything.

## What's in this folder

- `mcp.json`: the server entry, the **only** file here that holds the server address. Use it with `amp --mcp-config mcp.json`, or copy the entry into `amp.mcpServers` in `~/.config/amp/settings.json`.
- `README.md`: install steps for users (server, or skill + CLI) and what data it sends.
- The skill is **not copied**. Amp installs it straight from this repo: `amp skill add Cloudtifact/plugins/plugins/cloudy/skills/cloudtifact`. Amp also reads `~/.agents/skills/`, where `cloudy skill install` writes it.

**MCP domain note:** the server may move from `mcp.cloudtifact.com` to `mcp.usecloudy.ai`. Then change `mcp.json` (one line) and the `amp mcp add` line in `README.md`. Also update the PR body below. `grep -rn mcp.cloudtifact.com amp/` finds all of them (the validation log can stay as it is).

**Path note:** on GitHub `main` today the skill is still at `plugins/cloudtifact/skills/cloudtifact`. The README path (`plugins/cloudy/...`) works only after the `cloudy-every-harness` branch merges.

## Steps (only if you want the amp-contrib PR)

John needs a GitHub account (gczh or the Cloudtifact org). There's no form, fee, review checklist, icon or screenshot, and no agreement beyond GitHub's terms. Contributions are MIT, matching the repo licence.

1. Fork `https://github.com/ampcode/amp-contrib`.
2. Add `.agents/skills/cloudtifact/SKILL.md` (copy of `plugins/cloudy/skills/cloudtifact/SKILL.md`; the folder name must match `name: cloudtifact`).
   - **Resync:** this copy goes stale when the CLI updates the skill. Refresh it with a follow-up PR each time, or skip the PR.
   - Optional: add `.agents/skills/cloudtifact/mcp.json` with the content of this folder's `mcp.json` plus `"includeTools": ["*"]`. This makes Amp start the Cloudy server whenever the skill loads. The skill text is written for the CLI, though, so leave this out unless the skill also explains the tools.
3. Open the PR:
   - **Title:** `Add cloudtifact skill (Cloudy: publish pages, read and resolve comments)`
   - **Body:**
     ```
     Adds the Cloudy skill. Cloudy gives the pages and docs an agent makes a stable link; people comment on the exact text, and the agent reads, fixes, replies to and resolves those comments. Every version is kept; spaces are private by default.

     Install: amp skill add ampcode/amp-contrib/cloudtifact
     Needs the Cloudy CLI (npm i -g usecloudy, Node 20+); first run gives a browser sign-in link.
     Optional server, no API key (OAuth): amp mcp add cloudy https://mcp.cloudtifact.com/mcp

     Homepage: https://usecloudy.ai · Docs: https://usecloudy.ai/docs · Privacy: https://usecloudy.ai/privacy · MIT
     ```
   - Tagline, if one is wanted: `DRAFT (John writes this)`.
4. John clicks "Create pull request". Nothing else to sign.

## Art

None. Amp shows no icons or screenshots for skills, MCP servers or plugins.

## Blockers

- No official listing exists. amp-contrib is the only place to submit, and nobody is merging PRs there.
- Signing in through the server needs a Cloudy account (Amp registers itself with the server and opens the sign-in page; checked below).

## Validation (2026-11-08, amp 0.0.1790078445-g3dd8f6, already installed at ~/.local/bin/amp)

Scratch settings in `/tmp/t0279-amp/`; the user's Amp settings weren't touched.

```
$ amp mcp list --settings-file /tmp/t0279-amp/settings.json --mcp-config mcp.json --json
[{"name":"cloudy","type":"url","source":"global","spec":{"url":"https://mcp.cloudtifact.com/mcp","_target":"flag"}}]

$ amp mcp add cloudy https://mcp.cloudtifact.com/mcp --settings-file /tmp/t0279-amp/settings.json
Added amp.mcpServers.cloudy to /tmp/t0279-amp/settings.json

$ amp mcp doctor cloudy --settings-file /tmp/t0279-amp/settings.json
OAuth Authorization Required ... https://mcp.cloudtifact.com/authorize?response_type=code&client_id=gLtK1DEWUfkyEGvH&code_challenge=...&code_challenge_method=S256&redirect_uri=http%3A%2F%2Flocalhost%3A41592%2Foauth%2Fcallback&...&scope=cloudtifact&resource=https%3A%2F%2Fmcp.cloudtifact.com%2Fmcp
cloudy (user settings): authenticating (waiting for OAuth)...
```
Amp found the OAuth settings from the 401, registered itself with the server, and built a PKCE sign-in link with a loopback redirect. The check stopped there (stopped after 45 s); no account was signed in.

```
$ amp skill add ~/Documents/cloudy-plugins/plugins/cloudy/skills/cloudtifact --target /tmp/t0279-amp/skills
✓ Installed cloudtifact
$ amp skill add Cloudtifact/plugins/plugins/cloudtifact/skills/cloudtifact --target /tmp/t0279-amp/gh-skills
✓ Installed cloudtifact      (current GitHub main, skill v0.3.1)
$ amp skill info cloudtifact --json
{"name":"cloudtifact","description":"Use when the user wants a page, ...","path":"file:///Users/johndotowl/.agents/skills/cloudtifact"}
```

## Sources

- Skills (format, search paths, `mcp.json` bundling, `amp skill add`, sharing only by personal or workspace repos): https://ampcode.com/docs/customize/skills
- MCP (`amp.mcpServers`, `url` entries, OAuth with CIMD and DCR fallback, workspace approval): https://ampcode.com/docs/customize/mcp
- Plugins (TS/JS, locations, `amp plugins add <url>`, share by URL, no directory): https://ampcode.com/docs/customize/plugins, and `amp plugins show-docs`
- Enterprise MCP Registry Allowlist (uses the registry.modelcontextprotocol.io protocol): https://ampcode.com/docs/enterprise/mcp-registry-allowlist
- https://github.com/ampcode/amp-contrib (PRs #1–#6) and https://github.com/ampcode/official-plugins (README: "the official skills that Amp serves to every user")
