# Submitting Cloudy to Cline

Researched 2026-11-08. Sources:

- Marketplace rules: https://github.com/cline/mcp-marketplace (README)
- Issue form: https://github.com/cline/mcp-marketplace/blob/main/.github/ISSUE_TEMPLATE/mcp-server-submission.yml
- Cline MCP docs (remote servers, `streamableHttp`): https://github.com/cline/cline/blob/main/docs/mcp/mcp-overview.mdx (published at https://docs.cline.bot)
- Cline OAuth for remote MCP (VS Code "Authenticate" button, loopback callback `http://127.0.0.1:1456-1461/mcp/oauth/callback`, client name "Cline"): https://github.com/cline/cline/blob/main/apps/vscode/src/services/mcp/McpOAuthManager.ts
- Settings schema (flat and nested CLI shapes): https://github.com/cline/cline/blob/main/apps/vscode/src/services/mcp/schemas.ts
- Skills: https://github.com/cline/cline/blob/main/docs/customization/skills.mdx. Rules: `docs/customization/cline-rules.mdx`. Plugins (code only, CLI/SDK only): `docs/customization/plugins.mdx`
- Live marketplace feed the extension reads: https://api.cline.bot/v1/mcp/marketplace

## What Cline has

| Thing | Store? | What we do |
|---|---|---|
| MCP Marketplace (in VS Code / JetBrains / CLI) | Yes, curated. GitHub issue, free, reviewed by Cline staff | Submit this folder |
| Skills (`SKILL.md`) | No store. Read from `~/.cline/skills/`, `.cline/skills/`, `.claude/skills/` (CLI also reads `~/.agents/skills/`) | Already covered: `cloudy skill install` writes `~/.cline/skills/cloudtifact/SKILL.md` (checked on this Mac) |
| Rules / workflows | "Prompts Library" fed by PRs to https://github.com/cline/prompts | Skip: looks dormant (last merge 2026-02-27, 4 PRs open since March to August, https://cline.bot/prompts returns 404). A rule would only repeat the skill |
| Plugins (`cline plugin install`) | No store; TypeScript code; CLI/SDK only, not the IDE extensions | Skip |

## Files in this folder

- `README.md`: what Cline's reviewers and installer read first.
- `llms-install.md`: the steps Cline follows on one-click install (remote server, OAuth, no key).
- `logo-400.png`: 400x400 PNG, resized from `assets/icon-512.png` (`magick assets/icon-512.png -resize 400x400 -strip cline/logo-400.png`). If Cline's tile looks wrong with transparent corners, make it from `assets/icon-square-512.png` instead.

No banners, screenshots or video are asked for.

## Before submitting

1. Merge `cloudy-every-harness` to `main` in Cloudtifact/plugins, so the URL below shows this folder. The repo must be public.
2. Test the install the way the form asks (it's a required checkbox): in VS Code with Cline, start a fresh task and say: "Set up the MCP server from https://github.com/Cloudtifact/plugins/tree/main/cline, following its llms-install.md". Watch Cline add the entry, click **Authenticate**, sign in, then have it call `list_spaces` and `publish_page` on a small test page. Only tick the box after this works.

## The form

Open https://github.com/cline/mcp-marketplace/issues/new?template=mcp-server-submission.yml while signed in to GitHub as the account that should own the listing (ideally a member of the Cloudtifact org, since reviewers weigh "developer credibility").

| Field | Value |
|---|---|
| Title | `[Server Submission]: Cloudy` |
| GitHub Repository URL | `https://github.com/Cloudtifact/plugins/tree/main/cline` |
| Logo Image | Drag in `cline/logo-400.png` |
| Installation Testing: "I have tested that Cline can successfully set up this server using only the README.md and/or llms-install.md file" | Tick (after the test above) |
| Installation Testing: "The server is stable and ready for public use" | Tick |
| Additional Information | Paste the block below |

Additional Information:

```
Cloudy is a hosted MCP server (Streamable HTTP): https://mcp.cloudtifact.com/mcp
No API key and nothing to run locally. Sign-in is OAuth 2.1 with PKCE, discovered from the 401 (dynamic client registration supported; works with Cline's loopback callback).

What it does: the agent publishes an HTML page or report and gets a stable link. People comment on the exact text they mean; the agent reads the comments, fixes the page, replies and resolves them. Every version is kept, and spaces are private by default.

DRAFT (John writes this): why Cline users want it, one or two sentences.

Suggested category: developer-tools. Tags: publishing, html, comments, collaboration, docs.
Docs: https://usecloudy.ai/docs/mcp
Privacy: https://usecloudy.ai/privacy
Contact: support@usecloudy.ai
```

Nothing to sign or pay. Cline's team picks the final name, description, category and tags themselves (the feed has `name`, `author`, `description`, `category`, `tags`, `logoUrl`, `requiresApiKey`); expect `requiresApiKey: false`.

## Blockers and risks

- **Review backlog.** On 2026-11-08 the repo had 3,239 open submissions, and the newest entry in the live feed was added 2026-03-27 (Postman). Issues closed in Oct/Nov were withdrawn by their submitters, not approved. Listing may take months or not happen. Asking in the `#mcp` channel of Cline's Discord (https://discord.gg/cline) is the only other route the README gives.
- **Approval criteria** favour traction (GitHub stars, community presence) and known maintainers. Cloudtifact/plugins is a small repo; link the main site and docs.
- **Legacy domain.** The server address is `mcp.cloudtifact.com`. If it moves to `mcp.usecloudy.ai`, change the one line in `llms-install.md` (it's the only file here with the address, plus the paste block above): `sed -i '' 's#mcp.cloudtifact.com#mcp.usecloudy.ai#g' cline/llms-install.md cline/SUBMIT.md`. Do that before submitting if the move is close, because Cline's team copies the README and llms-install text at review time. Keep the old address answering (or redirecting) for people who installed earlier.
- The repo URL contains "Cloudtifact" (the org name). That's a technical id; fine.

## Validation done

```
$ CLINE_MCP_SETTINGS_PATH=/tmp/t0279-cline/from-doc.json cline config mcp --json   # JSON block copied out of llms-install.md, Cline CLI 3.0.74
[{"name":"cloudy","transportType":"streamableHttp","disabled":false,"path":"/tmp/t0279-cline/from-doc.json"}]

$ CLINE_MCP_SETTINGS_PATH=/tmp/t0279-cline/mcp_settings.json cline mcp add cloudy https://mcp.cloudtifact.com/mcp --transport streamableHttp --yes --json
{"name":"cloudy","status":"installed","transport":{"type":"streamableHttp","url":"https://mcp.cloudtifact.com/mcp"},"warnings":[]}

$ curl -i -X POST https://mcp.cloudtifact.com/mcp ... initialize
HTTP/2 401
www-authenticate: Bearer realm="OAuth", resource_metadata="https://mcp.cloudtifact.com/.well-known/oauth-protected-resource/mcp", scope="cloudtifact"
(protected-resource and authorization-server metadata both resolve; registration_endpoint present, S256 PKCE, token auth "none" allowed)

$ cline config skills        # skill already loaded from the CLI-written copies
  cloudtifact (/Users/johndotowl/.agents/skills/cloudtifact/SKILL.md)
```

Not done: a full OAuth sign-in in Cline (needs a person at the browser). That's the test in "Before submitting".
