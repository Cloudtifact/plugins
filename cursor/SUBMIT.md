# Submitting Cloudy to Cursor

There are two places to list Cloudy, and both take the same GitHub repo (`https://github.com/Cloudtifact/plugins`):

1. **Cursor Marketplace** (`cursor.com/marketplace`). This is Cursor's official store. The Cursor team reviews every plugin by hand and then lists it, and users install it from **Customize** inside Cursor.
2. **cursor.directory**. This is Cursor's community directory. It is open to anyone, it reads the repo by itself, and an automatic security scan checks it. MCP servers no longer have a separate listing there (`/mcp/new` now goes to `/plugins/new?type=mcp_server`). Each GitHub repo can be listed only once, so the MCP server and the skill appear together under one "Cloudy" plugin listing.

Researched on 2026-11-08 from:
- https://cursor.com/docs/plugins (overview, publishing)
- https://cursor.com/docs/reference/plugins (manifest schema, submission checklist)
- https://cursor.com/docs/mcp (remote MCP, OAuth, redirect URLs)
- https://cursor.com/help/security-and-privacy/marketplace-security (review, open source)
- https://cursor.com/marketplace/publish (the application form; field labels read from the page's JS because the form only appears after sign-in)
- https://cursor.com/marketplace-publisher-terms (last updated 2026-05-06)
- https://github.com/cursor/plugin-template (`scripts/validate-template.mjs`, commit 4621607)
- https://github.com/cursor/plugins (`schemas/plugin.schema.json`, `schemas/marketplace.schema.json`, commit 6b03002, 2026-11-06)
- https://github.com/cursor/community-plugins (the cursor.directory source: `apps/cursor/src/lib/github-plugin/parse.ts`, `components/forms/plugin-form.tsx`)

## What's in the package

The plugin is `plugins/cloudy/`, which the root `.cursor-plugin/marketplace.json` points to. It is a Cursor Plugin, with its manifest at `.cursor-plugin/plugin.json`.

- `plugins/cloudy/.cursor-plugin/plugin.json`: `name` cloudy, `displayName` Cloudy, `version` 0.3.3, author, homepage, repo, MIT license, keywords, `category` productivity, tags, `logo` `.claude-plugin/icon.png`, `mcpServers` `./.mcp.json`.
- `plugins/cloudy/.mcp.json`: `{"mcpServers":{"cloudy":{"type":"http","url":"https://mcp.cloudtifact.com/mcp"}}}`. Another thread created this file (it was untracked when I found it), and I didn't add an MCP file of my own. I first wrote a separate `plugins/cloudy/mcp.json`, then deleted it so the address appears in only one place. The Cursor manifest points to `.mcp.json` with `"mcpServers": "./.mcp.json"`, because Cursor's default discovery only finds `mcp.json`. cursor.directory looks for `.mcp.json` first, then `mcp.json`, at the plugin root. **If that other thread renames or removes `.mcp.json`, update this field.**
- The skill (`skills/cloudtifact/SKILL.md`) and the commands (`commands/*.md`) are the shared files, found by Cursor's default folder discovery.
- `.cursor-plugin/marketplace.json` at the repo root: I removed `category` from the plugin entry. Cursor's official schema (`additionalProperties: false`) rejects it, even though the reference doc lists it. `category` stays in `plugin.json`.

## Validation

All commands below were run on 2026-11-08.

1. Official JSON schemas from `cursor/plugins`:
   ```
   npx -y -p ajv-cli@5 -p ajv-formats@3 ajv validate --spec=draft7 -c ajv-formats -s plugin.schema.json -d plugins/cloudy/.cursor-plugin/plugin.json
   -> plugins/cloudy/.cursor-plugin/plugin.json valid
   npx -y -p ajv-cli@5 -p ajv-formats@3 ajv validate --spec=draft7 -c ajv-formats -s marketplace.schema.json -d .cursor-plugin/marketplace.json
   -> .cursor-plugin/marketplace.json valid
   ```
   It failed on `plugins/0/category` before I removed that field.
2. Cursor's template validator, run from a scratch copy of the repo (`node validate-template.mjs`). It also warns "no mcp.json file found", which is expected because the manifest points to `./.mcp.json`. The path check passes:
   ```
   Validation failed:
   - cloudy: command file missing "name" in frontmatter: plugins/cloudy/commands/comments.md
   - cloudy: command file missing "name" in frontmatter: plugins/cloudy/commands/publish.md
   - cloudy: command file missing "name" in frontmatter: plugins/cloudy/commands/status.md
   ```
   I added `name: publish`, `name: comments` and `name: status` to the scratch copy, and the result was `Validation passed.` (plus one warning: no `hooks/hooks.json`, which is fine). **The lead must make that change in the real `plugins/cloudy/commands/*.md`** (see Blockers). The submission checklist also says "All included components have valid files and frontmatter".
3. Loaded in the real Cursor CLI (`cursor-agent` 2026.10.22):
   ```
   cursor-agent -p --mode ask --trust --plugin-dir ~/Documents/cloudy-plugins/plugins/cloudy "...list skills, plugin commands, MCP servers..."
   -> MCP servers: plugin-Cloudy-cloudy — needsAuth
   ```
   The plugin loaded, and the MCP server showed up waiting for sign-in. The `cloudtifact` skill was listed too, but this machine already has it installed globally, so this run doesn't prove the plugin's copy loaded. The CLI listed no plugin slash commands, which may just be how the CLI behaves. Check both in the Cursor app.
4. OAuth discovery (`curl -X POST https://mcp.cloudtifact.com/mcp`): it returns `401` with `WWW-Authenticate: Bearer resource_metadata=".../.well-known/oauth-protected-resource/mcp"`. The authorization-server metadata offers DCR, CIMD, S256 PKCE and the `none` auth method. That is what Cursor's docs say it needs (RFC 9728 + PKCE, public client via DCR).

## Before you submit (test in the Cursor app)

1. Run `ln -s ~/Documents/cloudy-plugins/plugins/cloudy ~/.cursor/plugins/local/cloudy`, then run **Developer: Reload Window** in Cursor.
2. Open Customize. The Cloudy plugin should appear with its logo, the `cloudtifact` skill, three commands, and the `plugin-Cloudy-cloudy` MCP server.
3. Click sign in on the MCP server and finish the browser sign-in. Cursor's docs (https://cursor.com/docs/mcp, "Static redirect URL") say DCR registers **both** `http://localhost:8787/callback` and `https://www.cursor.com/agents/mcp/oauth/callback`. A comment in `apps/mcp/src/index.ts` still says Cursor uses `cursor://anysphere.cursor-mcp/oauth/callback`. Check that registration with both URLs works and that a tool call (`list_spaces`) succeeds.
4. Type `/` in chat and check that `publish`, `comments` and `status` appear.
5. Remove the symlink afterwards.

## 1. Cursor Marketplace

**URL:** https://cursor.com/marketplace/publish ("Become a plugin publisher")

**Requirements** (from the docs and terms):
- The repo is public and open source. It is: `Cloudtifact/plugins`, MIT.
- The manifest is valid, the name is unique and kebab-case. `cloudy` is free: https://cursor.com/marketplace/cloudy returns "Not Found".
- The logo is committed to the repo and referenced by a relative path (done: `.claude-plugin/icon.png`).
- `README.md` documents usage. The `plugins/cloudy/README.md` that Cursor shows comes from the shared folder, so check that it mentions Cursor and the MCP server. This folder's README.md has text you can copy.
- Licenses must be permissive: no GPL, AGPL or LGPL. MIT is fine.
- No fees and no listing charge. See the terms blocker below.
- Review is manual, and every update is reviewed again: there is no auto-update from git. The terms say you must "re-index" after changes.

**Steps for John:**
1. Merge the `cloudy-every-harness` branch to `main` on `Cloudtifact/plugins` (with the command `name:` fix), so the public repo has the Cursor files.
2. Sign in to cursor.com with the account that should own the publisher profile. A company account (support@usecloudy.ai or similar) is better than a personal one.
3. Open https://cursor.com/marketplace/publish and fill in the fields below.
4. Read the Publisher Terms (https://cursor.com/marketplace-publisher-terms), then click **Submit Application**. Clicking it means you agree to them.
5. Wait for review. Questions go to marketplace-publishing@cursor.com.

**Form fields** (labels as on the form):

| Field | Value |
|---|---|
| Organization name | `Cloudy` |
| Organization handle (unique namespace, kebab-case, e.g. `@acme-labs`) | `@cloudy`, or `@usecloudy` if `@cloudy` is taken |
| Website URL | `https://usecloudy.ai` |
| Contact email | `support@usecloudy.ai` |
| Logotype URL ("1:1 SVG or PNG with background plate") | `https://raw.githubusercontent.com/Cloudtifact/plugins/main/assets/icon-square-512.png` (the full-bleed square works on a plate, and Cursor rounds the corners itself). It exists once the branch is merged. |
| GitHub repository ("public GitHub repository containing your plugin") | `https://github.com/Cloudtifact/plugins` |
| Description | `Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.` |
| (optional tagline, if they ask for one later) | DRAFT (John writes this) |

The form also shows "Owner" and "Display name", which come from your sign-in and the manifest (`displayName: Cloudy`). There is nothing else to fill in: no screenshots, video or demo account are asked for.

**What John agrees to** (Publisher Terms, updated 2026-05-06):
- Anysphere checks the publisher's identity and business legitimacy, and may reject an application without a reason.
- "Publisher agrees that it will not charge Users any fees, whether directly or indirectly" for the plugin.
- Anysphere gets a non-exclusive, worldwide, royalty-free, sublicensable, transferable license to host, distribute and promote the plugin.
- You keep it working and secure, and report security incidents promptly to legal@cursor.com. Anysphere can delist it at any time.
- Follow Cursor's brand rules: say "Cursor", not "Cursor AI".
- California law, AAA arbitration and a class-action waiver apply, with a 30-day opt-out window.

## 2. cursor.directory

**URL:** https://cursor.directory/plugins/new. Sign in with GitHub or Google. An MCP-only listing goes through the same page (`?type=mcp_server`), but because each repo can be listed once, use one listing for both.

**Steps for John:**
1. After the merge, sign in (GitHub is best, since it ties the listing to the repo owner).
2. Keep the **Auto-detect** tab, paste `https://github.com/Cloudtifact/plugins`, and click **Submit**.
3. It reads `.cursor-plugin/marketplace.json`, follows `source` to `plugins/cloudy/`, and finds the MCP server (`.mcp.json` → `cloudy`), the skill (`cloudtifact`) and the three commands. Check all three kinds appear.
4. **Change the fields it fills in.** The parser takes the name from the root marketplace manifest and skips the plugin's own manifest, so it fills in a poor description ("plugins plugin for Cursor") and no logo:

| Field | Value |
|---|---|
| Logo (optional, upload, max 1 MB, any image) | `assets/icon-square-512.png` (or `assets/icon-512.png`) |
| Name | `Cloudy` |
| Description | `Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.` |
| Component: MCP server `cloudy` description (if editable) | `Publish pages, read and resolve comments, and query space databases. Sign in with your browser, no API key.` |

5. Click **Publish**. A security scan runs automatically, and the listing appears after it passes. Afterwards, you can use **Request verification** on the plugin page to get the verified badge.

There are no fees, no screenshots, no video and no agreement beyond the site's normal sign-in. The names `cloudy`, `cloudtifact` and `usecloudy` are all free there (each returns 404).

## Art needed

- **Required:** a 1:1 logo PNG or SVG "with background plate". Use `assets/icon-square-512.png` (512x512, full bleed, already exists). Nothing new is needed.
- In-app logo: the manifest points to `.claude-plugin/icon.png`, the 512x512 rounded tile with transparent corners. Cursor rounds corners itself (`rounded-[22%]`), so a full-bleed square looks better. That would need a copy of `icon-square-512.png` inside `plugins/cloudy/` (for example `plugins/cloudy/assets/logo.png`) and `logo` changed to point at it. That is a change outside what I'm allowed to edit, so it's left to the lead.
- Neither store asks for banners, screenshots or video.

## Blockers

1. **Command frontmatter.** `plugins/cloudy/commands/{publish,comments,status}.md` need `name: publish`, `name: comments` and `name: status` in their frontmatter. Cursor's validator and submission checklist need it. Claude Code ignores the key. Also, `argument-hint` and `$ARGUMENTS` are Claude-style. Cursor documents neither, so in Cursor the agent will see `$ARGUMENTS` as plain text. The command already falls back to "the page you made most recently", so it still works.
2. **The repo must be merged to `main`** before either submission, because both read the public default branch.
3. **"No fees" term.** Cloudy has paid plans. The plugin itself is free, and the marketplace already lists paid SaaS (Slack, Notion, Linear, HubSpot). Still, John should read "will not charge Users any fees, whether directly or indirectly" and decide. If unsure, ask marketplace-publishing@cursor.com before submitting.
4. **The marketplace is curated.** The security FAQ says "We work directly with plugin authors we trust … we plan to open this up more broadly." Approval isn't guaranteed and may take a while. cursor.directory has no such gate.
5. **The MCP address may move** to `mcp.usecloudy.ai`. If it does, change the one `url` in `plugins/cloudy/.mcp.json`, then re-submit or re-index on the Cursor Marketplace (updates are reviewed by hand) and click update on cursor.directory (that re-runs the scan). Until then, keep `mcp.cloudtifact.com`. It is a technical address, so it's fine that it isn't in the listing text.
6. **Root `plugins/cloudy/plugin.json`.** This is an Agent Plugins-style manifest at the plugin root. It has only `name` and `description`, but the Agent Plugins standard requires `$schema`, `version` and `author`. Cursor reads `.cursor-plugin/plugin.json`, and the CLI loaded the plugin fine. But Cursor's docs say a root `plugin.json` marks an Agent Plugin, so the lead should either complete it or delete it, so reviewers don't see an invalid second manifest. Also, there is no `mcp.json` (no dot), so clients that follow the Agent Plugins standard won't find the MCP server through that root manifest.
