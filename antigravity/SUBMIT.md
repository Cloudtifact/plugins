# Submitting Cloudy to the Antigravity Marketplace

Researched 2026-11-08 from Google's docs. Nothing has been submitted.

## What it is

- The Plugin Marketplace in Antigravity launched on 29 Oct 2026 (blog: https://antigravity.google/blog/plugin-marketplace-in-antigravity). It's a curated catalog of Google and partner plugins, shown in the Antigravity App (Customizations > Marketplace) and the CLI (`/plugin`, `agy plugin install <name>`). The official marketplace id is `antigravity-plugins-official`.
- A plugin is a folder with `plugin.json` plus optional `skills/`, `mcp_config.json`, `agents/`, `rules/` and `hooks.json`. Slash commands aren't a plugin component: commands become skills. Docs: https://antigravity.google/docs/build-plugins, https://antigravity.google/docs/plugins, https://antigravity.google/docs/marketplace, https://antigravity.google/docs/mcp. Schema: https://antigravity.google/schemas/v1/plugin.json
- **How to get listed:** there's no self-serve portal, PR repo or fee. Partners fill in the **Antigravity Plugin Interest Form** (https://forms.gle/2EX5RFYPoJe1UgxR9), and Google follows up and reviews the plugin. The docs and the blog don't publish review criteria, timelines, fees or an agreement. Expect a partner agreement or terms to arrive during review if Google accepts.
- Even without a listing, anyone can install it today straight from GitHub (tested: `agy plugin install` accepts `.../tree/<branch>/<path>` URLs):
  `agy plugin install https://github.com/Cloudtifact/plugins/tree/main/antigravity/cloudy`

## The package

`antigravity/cloudy/` is the plugin root. This file sits outside it so it doesn't ship in the bundle.

| File | What it is |
|---|---|
| `plugin.json` | Manifest: name `cloudy`, displayName `Cloudy`, version `0.3.3`, logo, three starter prompts, author, license MIT |
| `mcp_config.json` | The remote MCP server. **The address lives only here** (one line) |
| `skills/cloudtifact/SKILL.md` | A **copy** of `plugins/cloudy/skills/cloudtifact/SKILL.md` (v0.3.3) |
| `assets/logo.png` | 512×512, made from `assets/icon-512.png` scaled to 80% on a transparent canvas (the docs ask for a 1:1 icon, at least 128×128, with about 10% transparent padding, legible on light and dark) |
| `README.md` | Shown in the Marketplace detail view before install |

Notes:
- **The skill is a copy.** Plugin bundles must be self-contained (a `"skills": "../plugins/cloudy/skills"` path passes validation locally, but a Marketplace bundle or a GitHub subfolder install wouldn't include it). Resync it whenever the CLI ships a new skill: `cp plugins/cloudy/skills/cloudtifact/SKILL.md antigravity/cloudy/skills/cloudtifact/SKILL.md`, then bump `version` in `plugin.json` so installed clients update.
- **MCP sign-in:** no `oauth` block is needed. Antigravity does OAuth 2.1 + PKCE using CIMD (`client_id=https://antigravity.google/oauth/client-metadata.json`, `redirect_uri=https://antigravity.google/oauth-callback`), falling back to dynamic registration. Our server advertises `client_id_metadata_document_supported: true`. I tested it: our `/authorize` with Antigravity's client id and redirect shows "Connect Google Antigravity to Cloudy". With OAuth only (no `variables`), the plugin installs enabled and asks the user to sign in when the server first connects.
- The MCP server key `cloudy` shows up at runtime as `cloudy_cloudy` (Antigravity adds the plugin name as a prefix).

## MCP address note

The server is `https://mcp.cloudtifact.com/mcp` today. It may move to `https://mcp.usecloudy.ai/mcp` (another thread is doing that). If it does, change the one line in `antigravity/cloudy/mcp_config.json` (the README mentions it too), bump `version`, and re-run validation. The new host has to serve the same CIMD-enabled metadata, with the protected-resource `resource` exactly equal to the new MCP URL (Antigravity checks that).

## Validation (done)

```
$ brew install --cask antigravity-cli      # agy 1.5.3
$ agy plugin validate --strict ./antigravity/cloudy
Validating cloudy (cloudy/plugin.json)
  skills 1 · agents 0 · rules 0 · hooks 0 · mcpServers 1 · sidecars 0
✔ Validation passed                        # exit 0, findings: []

$ npx ajv-cli@5 validate --spec=draft2020 -s plugin.schema.json -d antigravity/cloudy/plugin.json
antigravity/cloudy/plugin.json valid

$ HOME=/tmp/scratch agy plugin install ./antigravity/cloudy
  [ok] cloudy  ✔ skills: 1 installed (cloudtifact)  ✔ mcpServers: 1 installed (cloudy)
$ HOME=/tmp/scratch agy plugin list --json  ->  cloudy, enabled, 0.3.3, skills [cloudtifact], mcpServers [cloudy]
```

Not yet done: signing in through the real app and calling a tool, which needs a Cloudy account in Antigravity. John should do this once before submitting: install from the GitHub URL above, run "List my Cloudy spaces", and sign in when the browser opens.

## Before submitting

1. Merge `antigravity/` to `main` of github.com/Cloudtifact/plugins, so the GitHub install URL and the repository link work for Google's reviewers.
2. Do the real sign-in test above.
3. Make sure https://usecloudy.ai/docs/mcp mentions Antigravity (optional but helps): `agy plugin install https://github.com/Cloudtifact/plugins/tree/main/antigravity/cloudy`.

## The form: Antigravity Plugin Interest Form

URL: https://forms.gle/2EX5RFYPoJe1UgxR9. It has 8 fields and all are required. There's no upload, and no field for the repo or the bundle, so add the GitHub link to the description (below). Google says it uses the company details "to verify your organization and send automated status updates regarding your Plugin review."

| Field | Value to paste |
|---|---|
| Email | John's email (the one that should get status updates) |
| Company Name | `Cloudy` (or the legal entity name, if Google asks for it: John to confirm) |
| Company Primary Website (Domain) | `https://usecloudy.ai` |
| Primary Contact Name | John's full name |
| Primary Contact Email | John's email |
| Public-facing support email or helpdesk URL | `support@usecloudy.ai` |
| Plugin Description | see below |
| Documentation URL | `https://usecloudy.ai/docs/mcp` |

Plugin Description (plain, 1 paragraph):

> Cloudy gives the pages, reports and docs an agent makes a stable link. People comment on the exact text they mean; the agent reads the comments, fixes the page, replies and resolves them. Every version is kept and spaces are private by default. The plugin bundles our remote MCP server (OAuth with CIMD, no API key) and one skill. It passes `agy plugin validate --strict`. Source (MIT): https://github.com/Cloudtifact/plugins/tree/main/antigravity/cloudy

Tagline, if Google asks for one later: `DRAFT (John writes this)`.

## Art

The form asks for none. The Marketplace card uses `logo` from `plugin.json` (done: `assets/logo.png`, 512×512, padded). The docs ask for no banner, screenshots or video. Make them only if Google asks during review.

## What John clicks, signs or agrees to

- Fills in and sends the Google Form (a Google account may be needed to open it, depending on the form's settings).
- Agrees to whatever partner terms Google sends if it accepts the plugin. None are published yet.
- No fee, no developer account, no signing key.

## Blockers

- Listing is at Google's discretion: it's a partner intake, not an open store, and has no published SLA.
- `antigravity/` must be on `main` before the form goes in.
- Real in-app sign-in and tool call not yet tested (needs John's account).
