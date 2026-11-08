# Submitting Cloudy to OpenAI's Plugins Directory (ChatGPT + Codex)

Checked 8 November 2026 against OpenAI's plugin docs. Nothing has been submitted or published.

ChatGPT and Codex share **one Plugins Directory**. One ZIP, one listing, both surfaces. The app directory moved into this directory on 9 July 2026. Apps built with the Apps SDK are plugins now.

This folder is that ZIP. The same files live in the Cloudtifact monorepo as `apps/mcp/chatgpt-plugin/` (PR [gczh/cloudtifact#321](https://github.com/gczh/cloudtifact/pull/321), not merged). Keep them in sync. Art for the Design tab is already in `~/Documents/cloudtifact/design/plugins/chatgpt/`.

Codex CLI also installs the shared plugin from this repo (`plugins/cloudy/`, including `.codex-plugin/`). That path is already built. This folder is the **directory listing**.

## What's in this folder

| File | Why |
|---|---|
| `plugin.json` | Agent Plugins 1.0.0 manifest, name `cloudy`, OpenAI listing + 5+3 review cases under `extensions.com.openai` |
| `mcp.json` | Hosted MCP server `https://mcp.usecloudy.ai/mcp` (streamable HTTP) |
| `skills/get-started/SKILL.md` | Onboarding skill (first publish) |
| `skills/cloudy/SKILL.md` | Publish, update, comments |
| `assets/logo.png` | 1024×1024 listing logo |
| `assets/composer-icon.png` | 256×256 composer icon (face crop: the full tile blurs at 16 px) |
| `README.md` | Install, what data it sends |
| `LICENSE` | MIT |

These skills are written for ChatGPT/Codex MCP tools. They are **not** copies of the CLI skill. Do not add this folder to `scripts/sync-copies.sh`.

Do not put lifecycle hooks or `.app.json` in the ZIP: OpenAI rejects those for the public directory.

## MCP address

`mcp.json` points at `https://mcp.usecloudy.ai/mcp`. **The URL cannot be changed after the first publish** (contact OpenAI support). Do not submit until that host answers.

On 8 November 2026 `mcp.usecloudy.ai` did not resolve from this machine. It is added in monorepo PR #321. `mcp.cloudtifact.com` still answers (POST `/mcp` returns 401, which is the unauthenticated MCP handshake). Merge #321, wait for the deploy, then check:

```
curl -sS https://mcp.usecloudy.ai/.well-known/oauth-protected-resource/mcp
```

If the server moves, run `scripts/set-mcp-url.sh https://mcp.usecloudy.ai/mcp` for the other harnesses; this package already uses that URL.

OAuth is discovered from the server (DCR / CIMD). The manifest does not embed a client secret.

## Taglines — DRAFT (John writes this)

These go in `plugin.json` `extensions.com.openai.interface` and are imported by the portal. Change the file, re-zip, re-upload.

| Field | Current draft | Limit |
|---|---|---|
| Name / displayName | Cloudy | — |
| Short description | `Publish pages, answer comments` | 30 characters (this is 30) |
| Long description | Cloudy gives pages and docs a stable link… You need a Cloudy account. | listing copy |
| Capabilities | Publish pages · Update pages at the same link · Read and answer comments | — |
| Starter prompts | "Publish this as a page and give me the link." · "What did people say about the pricing page?" · "Reply that it's fixed and resolve the comment." | — |

## ZIP

Same command as the monorepo (`pnpm --filter mcp run plugin:zip`):

```
cd chatgpt
zip -qrX /tmp/cloudy-chatgpt-plugin.zip plugin.json mcp.json skills assets -x '.*'
unzip -l /tmp/cloudy-chatgpt-plugin.zip
```

Leave `SUBMIT.md`, `README.md` and `LICENSE` out of the ZIP. No secrets in the ZIP.

## Local checks (done 8 November 2026)

- `plugin.json` and `mcp.json` parse as JSON.
- `plugin.json` matches Agent Plugins 1.0.0: `$schema`, name `cloudy` (kebab-case, ≤64), `extensions.com.openai` present.
- `mcp.json` matches Agent Plugins MCP schema: one server, `type: streamable-http`, URL `https://mcp.usecloudy.ai/mcp`.
- Five positive and three negative review cases in the manifest.
- Logo 1024×1024, composer icon 256×256.
- No Cloudflare / Workers / R2 / D1 / Durable Objects in this folder's copy.
- OpenAI has no local submit CLI. Portal validation runs after upload.

Not tested: a real ChatGPT or Codex sign-in to `mcp.usecloudy.ai`. That needs the host live, a person, and an account. Do it once before submitting (steps 2–3 below).

## Who can submit, and what John signs

- **Account:** a verified individual or business on [platform.openai.com](https://platform.openai.com/settings/organization/general). Organization owners can submit; others need **Apps Management Write**.
- **Project:** global data residency, not EU. The directory shows the verified identity's name.
- **No platform fee** stated. External checkout only, physical goods for now. Cloudy does not sell in ChatGPT (`review.commerce: false`).
- **Submit for review** shows required **policy attestations** in the portal (wording is there; nothing to sign outside it). Read [plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines) first.
- **Publish** is a separate click after approval. Do not publish until John says.

## Steps (John)

1. Merge monorepo PR #321 and this plugins PR. Confirm `https://mcp.usecloudy.ai/.well-known/oauth-protected-resource/mcp` answers.
2. Test in ChatGPT: [chatgpt.com/plugins](https://chatgpt.com/plugins) → **+** → **Add custom MCP server** → name Cloudy, Public endpoint, OAuth, `https://mcp.usecloudy.ai/mcp` → **I understand and want to continue** → **Create as a plugin** → **Connect** → approve on the Cloudy page. New chat: @Cloudy "Publish this as a page and give me the link."
3. Test in Codex: `codex mcp add cloudy --url https://mcp.usecloudy.ai/mcp`, then `codex mcp login cloudy`, then ask it to publish a page.
4. Reviewer account: a Cloudy account that signs in with **email + password** (no email code, no MFA), with a space named **Sample launch plan** that has a launch date in it and one open comment about the date. Keep the password for step 9. Use sample data, not a real user's account.
5. Record a 1–3 minute screen video of step 2's chat (publish, read comments, reply and resolve) at a link the reviewer can open (unlisted YouTube or Loom). Put the URL in `plugin.json` as `extensions.com.openai.review.demo_recording_url` before the final ZIP (leave it out until the video exists).
6. [platform.openai.com](https://platform.openai.com) → Settings → Organization → General: finish business (or individual) verification. Project must be **global** data residency.
7. [Plugins](https://platform.openai.com/plugins) → **Upload new or existing plugin** → choose the verified identity → **Upload plugin** → the ZIP. Fix anything under **Metadata & Skills → Issues** (edit this folder, re-zip, **Upload plugin to fix issues**).
8. **MCPs** → **Connect** → domain check: host the exact token as plain text at `https://mcp.usecloudy.ai/.well-known/openai-apps-challenge` (HTTPS origin on the MCP hostname; return only the token). From the Cloudtifact repo, cloudtifact Wrangler profile: `wrangler secret put OPENAI_APPS_CHALLENGE --name cloudtifact-mcp`, then **Verify**. Sign in through OAuth with the reviewer account; wait for the tool scan.
9. **Review information → Review details**: reviewer email + password from step 4, login URL `https://app.usecloudy.ai`, the video link from step 5. **Save details**. Test cases are imported from the ZIP.
10. **Submit for review**, tick the policy attestations. After approval: **Publish plugin**. Do not click Publish until John says.

Adding an MCP server to an existing skills-only plugin is not supported, so the first ZIP must include `mcp.json`.

## Review cases (already in `plugin.json`)

Positive: publish a new private page; find the Sample launch plan space; read its open comments; change its launch date and republish at the same link; reply to the launch-date comment and resolve it.

Negative: the capital of Australia (no tool); "permanently delete the space" (no delete tool); a space id the account can't see.

## Art

Already in `~/Documents/cloudtifact/design/plugins/chatgpt/` (logo 1024, composer-icon 256, dark variants, `listing.md`, `export.sh`). Copies used by this package: `assets/logo.png`, `assets/composer-icon.png`. Brand colours `#37668B` / `#71A4C7` (2:1+ on white / `#212121`). No extra screenshots: the directory uses the logo, composer icon, and the review video.

## Open questions for John (from the listing)

- Privacy policy: OpenAI wants it to list what's collected, why, who gets it, how long it's kept. Ours doesn't mention AI-app connections (what a connected app can read). Add a line?
- OpenAI's guidelines say tool replies shouldn't carry internal ids or timestamps. Ours return space ids (the next tool needs them) and dates. Leave as is unless the scan flags it.

## Codex CLI (already built)

Not this ZIP. Users who only want Codex CLI:

```
codex plugin marketplace add Cloudtifact/plugins
codex plugin add cloudy@cloudy
```

That loads `plugins/cloudy/` (skill + commands). MCP: `codex mcp add cloudy --url https://mcp.usecloudy.ai/mcp`. OpenAI also documents converting a skills-only Claude plugin; we ship MCP + skills in the directory ZIP instead, so don't use that conversion path.

## Sources (opened 8 November 2026)

- https://developers.openai.com/plugins
- https://developers.openai.com/plugins/concepts/plugins
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/plugin-guidelines
- https://developers.openai.com/codex/plugins
- https://help.openai.com/articles/11487775-connectors-in-chatgpt (app directory → Plugins Directory, 9 Jul 2026)
