# Submitting Cloudy to OpenCode

Researched 2026-11-08 against OpenCode 2.2.6 (installed here) and today's docs.

## Is there a store?

No official store or registry. OpenCode loads plugins straight from npm (`opencode plugin add <npm-name>`), so **publishing to npm is the install path**. Discovery is through three lists, all by hand:

| Where | Kind | How to get on it | Requirements |
|---|---|---|---|
| [opencode.ai/docs/ecosystem](https://opencode.ai/docs/ecosystem/) | Official docs page | PR to `anomalyco/opencode`, file `packages/web/src/content/docs/ecosystem.mdx`, base branch `dev` | "Want to add your OpenCode related project to this list? Submit a PR." Docs PRs don't need a linked issue ([CONTRIBUTING.md](https://github.com/anomalyco/opencode/blob/dev/CONTRIBUTING.md)). Short PR text in your own words. Title `docs: ...` |
| [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) | Community list, linked from the ecosystem page | PR adding one YAML file under `data/plugins/` ([contributing.md](https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md)) | Public repo, commit in last 90 days, **at least 25 stars and 30+ days old**, OpenCode setup docs, tagline 120 chars or less |
| [opencode.cafe](https://opencode.cafe) | Community marketplace, unofficial | Web form at https://opencode.cafe/submit (sign-in needed), reviewed in "a few days" ([guidelines](https://opencode.cafe/guidelines)) | Public repo, working install steps, README, license |

No fees, no agreements to sign beyond npm's and GitHub's terms and each site's account sign-up. No icon, screenshots or video needed for any of them (opencode.cafe lists screenshots as "recommended", optional).

Docs used:
- Plugins: https://opencode.ai/docs/plugins/, https://opencode.ai/docs/build/plugins/, https://opencode.ai/docs/build/plugins/server/
- MCP: https://opencode.ai/docs/mcp-servers/
- Skills: https://opencode.ai/docs/skills/
- Commands: https://opencode.ai/docs/commands/
- Config schema: https://opencode.ai/config.json

## What's built

`opencode/` is the npm package `opencode-cloudy` 0.1.0 (V2 plugin). Its server part (`src/index.ts`):
- adds the remote MCP server `cloudy` (OAuth on by default; OpenCode does DCR/CIMD itself), unless the user already has one by that name;
- adds the `cloudtifact` skill from the shared `SKILL.md`, unless a copy is already found (for example one `cloudy skill install` wrote);
- adds `/cloudy-publish`, `/cloudy-comments`, `/cloudy-status` from the shared command files.

`opencode/opencode.json` is the no-plugin option: the same server and commands as plain config.

**The MCP address** is in one place in the package: `MCP_URL` at the top of `src/index.ts`. It's also written out in `opencode.json` and `README.md` (examples). If it moves to `mcp.usecloudy.ai`, change those three and bump the version.

**Skill and commands are not duplicated in git.** `scripts/sync.mjs` copies them from `../plugins/cloudy/` at `npm pack`/`npm publish` time (`prepack`), and the plugin falls back to `../plugins/cloudy/` when loaded from the repo. The copies `skills/` and `commands/` are gitignored. **Republish when the CLI updates the skill** (a published package carries the skill as it was at publish time; a user's own `cloudy skill install` copy wins over it).

## Validation

1. Typecheck against `@opencode/plugin@2.2.6` (scratch copy): `npx tsc --noEmit -p .` → exit 0.
2. Loaded in real OpenCode 2.2.6, isolated HOME, temp project with `"plugins": ["~/Documents/cloudy-plugins/opencode"]`, `opencode serve`, then `GET /api/mcp|command|skill`:
   - mcp: `cloudy {'status': 'needs_auth', 'error': 'MCP server "https://mcp.cloudtifact.com/mcp" requires a login before it can register a client'}` (expected before `opencode mcp auth cloudy`; the server's 401 was seen)
   - commands: `cloudy-publish`, `cloudy-comments`, `cloudy-status` listed with descriptions
   - skill: `cloudtifact | .../plugins/cloudy/skills/cloudtifact/SKILL.md | content 17231`
   - With the real HOME (which has a CLI-written `cloudtifact` skill), the CLI copy was kept, as intended.
3. `opencode.json` against the official schema (`https://opencode.ai/config.json` + its `models.dev` ref) with ajv 2020-12: `valid`. A bad `type` was rejected. Loading it in a temp project gave the same MCP and commands (no skill, as expected).
4. `npm pack --dry-run` (scratch copy): 6 files: `src/index.ts`, `skills/cloudtifact/SKILL.md`, 3 commands, `package.json`, plus `README.md` now that it exists.

Not tested: finishing the OAuth sign-in (needs a browser), and running a command against a model.

## Steps for John

### 1. Publish to npm (needed by every listing)

Needs the npm account that owns `usecloudy` (`cloudtifact`, cloudtifacthq@gmail.com). `opencode-cloudy` was free on 2026-11-08.

```sh
cd ~/Documents/cloudy-plugins/opencode
npm install            # dev deps for typecheck
npm run typecheck
npm publish --access public    # prepack copies the skill and commands in
```

Then check it: `opencode plugin add opencode-cloudy`, `opencode mcp auth cloudy`, and `/cloudy-status` in a session.

### 2. OpenCode docs ecosystem page (official)

Fork `anomalyco/opencode`, branch from `dev`, edit `packages/web/src/content/docs/ecosystem.mdx`, add one row at the end of the **Plugins** table:

```md
| [opencode-cloudy](https://github.com/Cloudtifact/plugins/tree/main/opencode) | Publish pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them |
```

- PR title: `docs: add opencode-cloudy to ecosystem`
- PR body (keep it short, own words; they close long AI-written ones): DRAFT (John writes this). Something like "Adds Cloudy's plugin to the ecosystem list. It registers our MCP server, a skill and three commands."
- Fill in their PR template.

### 3. awesome-opencode (when the repo has 25 stars)

Fork, add `data/plugins/cloudy.yaml`, PR titled `docs: add cloudy to plugins`:

```yaml
name: Cloudy
repo: https://github.com/Cloudtifact/plugins
tagline: "DRAFT (John writes this): Publish pages to a stable link and work through the comments people leave"
description: Publish HTML pages and docs to a stable link. People comment on the exact text, and the agent reads, fixes, replies to and resolves those comments. Adds Cloudy's MCP server, a skill and /cloudy-publish, /cloudy-comments, /cloudy-status. OpenCode V2 only.
scope:
  - global
  - project
tags:
  - mcp
  - skills
  - commands
  - publishing
min_version: "2.2.6"
homepage: https://usecloudy.ai/docs
installation: |
  ```sh
  opencode plugin add opencode-cloudy
  opencode mcp auth cloudy
  ```
```

(Remove the DRAFT prefix once John writes the tagline; 120 characters max.)

### 4. opencode.cafe (optional, unofficial)

Sign in at https://opencode.cafe/submit and fill in (fields from their `convex/schema.ts`):

| Field | Value |
|---|---|
| Product ID | `cloudy` |
| Type | Plugin |
| Display name | Cloudy |
| Description | DRAFT (John writes this). Plain version: Publish pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them. |
| Repository URL | https://github.com/Cloudtifact/plugins |
| Homepage URL | https://usecloudy.ai |
| Tags | mcp, skills, commands, publishing, comments |
| Installation (markdown) | the same block as the awesome-opencode `installation` above |

## Art

None required. If opencode.cafe asks for a picture, use `assets/icon-512.png`.

## Blockers

- **npm publish first.** Every list links to the npm package.
- **awesome-opencode needs 25 stars** on `Cloudtifact/plugins` (it has 0) and a commit in the last 90 days. The repo turns 30 days old on 2026-11-08, so age is fine.
- The links above assume `opencode/` is merged to `main` of `Cloudtifact/plugins`.
- **V2 only.** OpenCode 1 users need the `opencode.json` route; the 1.x config shape (`"mcp": { "cloudy": {...} }`, `"command"`) is still accepted but marked deprecated in the schema, and I couldn't test 1.x here.
- MCP domain may move to `mcp.usecloudy.ai`: change `MCP_URL` in `src/index.ts` (plus the two examples), bump the version, republish.
