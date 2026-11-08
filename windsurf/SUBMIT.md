# Submitting Cloudy to Windsurf / Devin (Cognition)

Checked 2026-11-08 against the official docs. docs.windsurf.com now redirects to docs.devin.ai.

## Where things stand

- **Windsurf is now Devin Desktop.** Its agent is **Devin Local**. **Cascade is legacy**: Devin Desktop no longer starts new Cascade conversations ([Cascade (legacy)](https://docs.devin.ai/desktop/cascade)). Cascade lives on in the Windsurf plugins for JetBrains, VS Code and other editors, which read `mcp_config.json` with `serverUrl` or `url` ([Windsurf Cascade MCP](https://docs.devin.ai/windsurf/plugins/cascade/mcp)).
- **The old "Windsurf MCP Plugin Store"** is still named in those admin docs, but I found no public way to submit to it. It isn't where new listings go.
- **The live store is the Devin marketplace.** It's the public GitHub repo [CognitionAI/devin-marketplace](https://github.com/CognitionAI/devin-marketplace). Devin cloud shows it under Customize → Plugins → **Browse marketplace** ([Plugins guide](https://docs.devin.ai/product-guides/plugins)). Plugins load in Devin cloud sessions, the Devin CLI and Devin Desktop (Devin Local), but not in classic Cascade ([plugin ecosystem](https://docs.devin.ai/product-guides/plugin-ecosystem)).
- **Third parties get listed by opening a PR.** Of 183 PRs, 53 are merged and 114 are open. Vendor PRs that were merged recently: Crossmint (#107, 6 days, official remote OAuth MCP, same shape as ours), WordPress.com (#82, 11 days), Strix (#29, 5 days), Snowflake (#126). There's no fee and no portal.
- **Devin Desktop's MCPs tab** also lists servers from "MCP registries" that enterprise admins configure, using the official MCP registry schema ([Devin Local customizations](https://docs.devin.ai/desktop/devin-local/customizations)). A listing in the official MCP Registry helps there. That's another thread's job, not this package's.
- **Devin reads Claude plugins as they are.** It falls back to `.claude-plugin/plugin.json` ([CLI plugins](https://docs.devin.ai/cli/extensibility/plugins/overview)). So `devin plugins install Cloudtifact/plugins#plugins/cloudy` should already install the skill from `plugins/cloudy/`. I didn't run it, because it would change this machine's Devin install.

## What's in this folder

| File | What it is |
|---|---|
| `mcp_config.json` | Cascade / Windsurf plugins config, `serverUrl` form |
| `devin-marketplace/plugins/cloudy/.devin-plugin/plugin.json` | The plugin manifest, laid out exactly as it goes in the marketplace repo |
| `devin-marketplace/plugins/cloudy/logo.png` | Copy of `assets/icon-512.png` (512×512) |
| `README.md` | Manual install and what data it sends |

The marketplace entry is MCP-only, like Crossmint. It leaves out the CLI skill because cloud Devin sessions would also need the CLI and a second sign-in. Local users can add the skill with `cloudy skill install`.

## Steps (John)

1. Fork `CognitionAI/devin-marketplace` from a GitHub account that may speak for Cloudy.
2. Copy `devin-marketplace/plugins/cloudy/` into the fork as `plugins/cloudy/`.
3. In the fork's `.devin-plugin/plugin.json`, add `"./plugins/cloudy"` to `optionalPlugins`. Then run `python3 scripts/validate.py --fix` and `python3 scripts/validate.py`, which put it between `./plugins/cloudinary` and `./plugins/cockroachdb`.
4. Optional test before the PR: in Devin cloud, go to Customize → Plugins → Add plugin → Upload .zip, upload a zip of `plugins/cloudy`, start a session and have Devin call `list_spaces`. That checks Devin's OAuth redirect against our server, which I couldn't test. Locally, `devin plugins install --local ./plugins/cloudy` does the same.
5. Open the PR. **Opening it means agreeing to their [CLA](https://github.com/CognitionAI/devin-marketplace/blob/main/CLA.md)** (copyright and patent licence to Cognition for the contribution, and a statement that you're authorised by your employer). John or Gabriel has to be the one who agrees.

### PR title

`Add Cloudy plugin for the hosted MCP`

### PR body (paste)

```
Adds Cloudy's official remote MCP server (https://mcp.cloudtifact.com/mcp, Streamable HTTP, OAuth 2.1 + PKCE discovered from the 401's protected-resource metadata, dynamic client registration supported; no API key).

Lets Devin publish HTML pages and docs to a stable link, then read, reply to and resolve the comments people leave on exact text. Spaces are private by default; every version is kept. Write tools (publish, comment, resolve, archive) are separate tools so they can be approved individually.

- Docs: https://usecloudy.ai/docs/mcp
- Repo: https://github.com/Cloudtifact/plugins
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

Files: plugins/cloudy/.devin-plugin/plugin.json, plugins/cloudy/logo.png (512×512), plus the optionalPlugins entry. `python3 scripts/validate.py` passes.
```

### Manifest fields (already filled in)

| Field | Value |
|---|---|
| `name` | `cloudy` (not taken in the marketplace) |
| `displayName` | `Cloudy` |
| `description` | `Publish pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them` (111 characters; the guide asks for 60 to 130 and no trailing period) |
| `shortDescription` | `Shareable pages with comments` — **DRAFT (John writes this)**, 40 characters at most |
| `homepage` | `https://usecloudy.ai` |
| `repository` | `https://github.com/Cloudtifact/plugins` |
| `logo` | `logo.png` |
| `keywords` | `["Productivity"]` (their categories are Productivity, Development Tools, Design & Creative and others; Featured is set by Cognition) |
| `mcpServers.cloudy.url` | `https://mcp.cloudtifact.com/mcp` |

No `setup` block, because the install form handles OAuth sign-in.

## Art

- One logo: a square PNG or SVG, kept in the repo next to the manifest. Existing entries range from 180×180 to 512×512. We use `assets/icon-512.png`. If they want a full-bleed mark, `assets/icon-square-512.png` is the alternative.
- No banners, screenshots or video are asked for.

## Blockers and risks

- **CLA:** opening the PR accepts it.
- **Review backlog:** 114 PRs are open. Several vendor PRs have waited weeks, and Cognition decides what gets merged. There's no SLA.
- **OAuth from Devin cloud is untested.** Devin cloud connects from its own servers with its own redirect URI. Step 4 tests it before the PR.
- **Cognition pins the marketplace by commit, and the URL lives in their repo.** Once merged, changing the URL means another PR to `CognitionAI/devin-marketplace`.

## MCP address note

The address may move from `mcp.cloudtifact.com` to `mcp.usecloudy.ai`; another thread is handling that. In this package it's only in the two JSON files and the README's install command:

```sh
grep -rl mcp.cloudtifact.com windsurf/ | xargs sed -i '' 's#mcp.cloudtifact.com#mcp.usecloudy.ai#g'
```

If the move happens after the marketplace PR merges, open a follow-up PR to the marketplace that changes `plugins/cloudy/.devin-plugin/plugin.json` there. Merged precedent: the Atlassian and Parallel URL changes (#71, #128).

## Validation run

1. The marketplace's own validator, on a scratch copy of the repo at `f7458caa6f8c9ee7a10aea57226486a3c94140b6` with `plugins/cloudy` added:
   ```
   python3 -I /tmp/t0279-windsurf/val/scripts/validate.py --fix   -> rewrote .devin-plugin/plugin.json
   python3 -I /tmp/t0279-windsurf/val/scripts/validate.py         -> ok: 233 entries (227 authored, 6 upstream)
   ```
2. Devin CLI 3000.11.3, run in a scratch project whose `.devin/mcp_config.json` has the same `url` entry:
   ```
   devin mcp get cloudy   -> Server: cloudy / URL: https://mcp.cloudtifact.com/mcp
   ```
3. The server answers an unauthenticated POST with `401` and `WWW-Authenticate: Bearer ... resource_metadata="https://mcp.cloudtifact.com/.well-known/oauth-protected-resource/mcp"`. That's what Devin uses to start OAuth.
4. There's no public schema for Cascade's `mcp_config.json`. It's checked as valid JSON with the `serverUrl` field the docs show.
