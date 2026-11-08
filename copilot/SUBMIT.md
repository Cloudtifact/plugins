# Submitting Cloudy to GitHub Copilot (CLI + VS Code agent plugins)

## What's here

- `copilot/cloudy/`: an **Agent Plugins 1.0** plugin (`plugin.json` with `$schema`, `mcp.json`, `skills/cloudtifact/SKILL.md`, `com.github.copilot/commands/{publish,comments,status}.md`, `README.md`). Copilot CLI and VS Code both load this format.
- `/.github/plugin/marketplace.json` (repo root): the Copilot marketplace catalog. It points `cloudy` at `./copilot/cloudy`. Copilot CLI and VS Code both read `.github/plugin/marketplace.json` before `.claude-plugin/marketplace.json`, so Claude Code is unaffected and Copilot/VS Code get this package.

The MCP address lives in one place: `copilot/cloudy/mcp.json` (`https://mcp.cloudtifact.com/mcp`). **When the server moves to `mcp.usecloudy.ai`, change that line** (and `vscode/extension.js`, `registries/server.json`, `plugins/cloudy/.mcp.json` / `mcp.json`).

The skill and commands are **copies** of `plugins/cloudy/skills/cloudtifact/SKILL.md` and `plugins/cloudy/commands/*.md`. Agent Plugins fixes the `skills/` location and doesn't allow paths outside the plugin, so they can't be referenced. **Resync them when the CLI updates the skill** (`cp plugins/cloudy/skills/cloudtifact/SKILL.md copilot/cloudy/skills/cloudtifact/`).

## Where Copilot plugins are listed

| Place | What it is | How to get in |
|---|---|---|
| Your own marketplace (`Cloudtifact/plugins`) | Any public repo with `.github/plugin/marketplace.json` | Works as soon as this is merged to `main`. Users run `copilot plugin marketplace add Cloudtifact/plugins`. |
| **awesome-copilot** (`github/awesome-copilot`) | The built-in default marketplace in Copilot CLI (can't be removed) and VS Code's default `chat.plugins.marketplaces` entry (`github/awesome-copilot#marketplace`). This is the store. | External plugin issue form, reviewed by GitHub maintainers. |
| `github/copilot-plugins` | No longer a default; GitHub's own plugins. | Not open to third parties. |
| GitHub MCP Registry (github.com/mcp) | Backs VS Code's MCP server gallery (`@mcp` / **MCP: Browse MCP Servers**) and Copilot's MCP picker. Curated: 771 servers vs. thousands in the open registry. | Publish to the official MCP Registry (the `registries/` thread owns `server.json`, name `ai.usecloudy/cloudy`), then email partnerships@github.com asking to be included. |

No fees. No screenshots or video. No icon field in Agent Plugins 1.0 (only canvas plugins need `assets/preview.png`), so **no art is needed**. The listing page shows the plugin's README from GitHub.

## Steps for awesome-copilot

1. Merge this branch to `main` of `Cloudtifact/plugins` (must stay public).
2. Tag an immutable release, e.g. `git tag copilot-plugin-v0.3.3 && git push origin copilot-plugin-v0.3.3`. Note the full 40-char commit SHA (`git rev-parse copilot-plugin-v0.3.3^{commit}`).
3. Open https://github.com/github/awesome-copilot/issues/new?template=external-plugin.yml (signed in as the Cloudtifact org owner or a member, so the affiliation is clear). Fill in:

| Field | Value |
|---|---|
| Title | `[External Plugin]: cloudy` |
| Plugin name | `cloudy` |
| Short description | `Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.` |
| GitHub repository | `Cloudtifact/plugins` |
| Plugin path inside the repository | `copilot/cloudy` |
| Ref to review | `copilot-plugin-v0.3.3` |
| Commit SHA to review | the 40-char SHA from step 2 |
| Version | `0.3.3` (must equal `version` in `copilot/cloudy/plugin.json`) |
| License identifier | `MIT` |
| Author name | `Cloudy` |
| Author URL | `https://usecloudy.ai` |
| Homepage URL | `https://usecloudy.ai` |
| Keywords | `publish`, `html`, `comments`, `feedback`, `review`, `mcp` (one per line) |
| Additional notes | `Submitted by the Cloudy team. Adds Cloudy's remote MCP server (OAuth sign-in in the browser, no API key), a skill and three commands. Needs a Cloudy account. Docs: https://usecloudy.ai/docs/mcp` |

4. Tick the four checkboxes: public GitHub repo; ref/sha immutable; follows the repo's contribution, security and responsible AI policies; not already listed (checked 2026-11-08: no `cloudy` in `plugins/external.json`, 97 entries).
5. Automation runs: metadata intake, Agent Plugins 1.0 manifest check, `vally lint`, and a Copilot CLI install smoke test. All three are reproduced below and pass. Then a maintainer comments `/approve` or `/reject`. On approval a bot PR adds us to `plugins/external.json`. `/rerun-intake` re-runs checks after edits.
6. Every 6 months after approval GitHub re-reviews the listing. To ship a new version, open a PR that bumps our entry in `plugins/external.json` (new `ref`/`sha`/`version`); the same gates run on the PR.

What John agrees to: the checkbox that the submission follows awesome-copilot's contribution, security and responsible AI policies. Nothing else to sign. Their paid-services guidance (https://github.com/github/awesome-copilot/discussions/968) says: no marketing tone, links limited to docs/source, affiliation clear. The README is written that way; keep any tagline out of it.

Tagline: none needed. If one is wanted for the README: `DRAFT (John writes this)`.

## Validation (2026-11-08)

All run with an isolated `HOME`, so nothing touched the real `~/.copilot`.

```
$ npx ajv-cli@5 validate --spec=draft2020 -s plugin.schema.json -d copilot/cloudy/plugin.json
copilot/cloudy/plugin.json valid
$ npx ajv-cli@5 validate --spec=draft2020 -s mcp.schema.json -d copilot/cloudy/mcp.json
copilot/cloudy/mcp.json valid
```
(schemas from https://agent-plugins.org/schemas/1.0.0/plugin.schema.json and .../mcp.schema.json)

```
$ node lint.mjs copilot/cloudy      # @microsoft/vally 0.20.0 runLint, same call awesome-copilot's gate makes
✅ cloudtifact (2/2 checks passed)
    ✓ [spec-compliance] All 1 skill(s) are spec-compliant.
    ✓ [valid-refs] All file references across 1 skill(s) are valid.
```

```
$ copilot --version                    # npm @github/copilot
GitHub Copilot CLI 1.0.107.
$ copilot plugin marketplace add ~/Documents/cloudy-plugins
Marketplace "cloudy" added successfully.
$ copilot plugin marketplace browse cloudy
  • cloudy - Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.
$ copilot plugin install cloudy@cloudy
Plugin "cloudy" installed successfully. Installed 1 skill.
$ copilot mcp get cloudy
  Status: Enabled   Type: http   URL: https://mcp.cloudtifact.com/mcp   Source plugin: cloudy (0.3.3)
$ copilot skill list
Plugin skills:
  cloudtifact - Use when the user wants a page, report, ...
  comments - Read the open Cloudy comments, fix what they ask for, then reply and resolve
  publish - Publish an HTML page (or the page you just made) to Cloudy and share the link
  status - Show what's published on Cloudy, unpublished changes and open comments
```

Not tested: the OAuth sign-in and a live tool call (needs a Copilot login). The server answers an unauthenticated `initialize` with `401` and `www-authenticate: Bearer realm="OAuth", resource_metadata="https://mcp.cloudtifact.com/.well-known/oauth-protected-resource/mcp"`, which is what Copilot and VS Code discover from.

## Blockers / notes for the lead

- **The awesome-copilot gate needs an Agent Plugins 1.0 root `plugin.json`.** `plugins/cloudy/plugin.json` is a legacy manifest without `$schema`, so `plugins/cloudy` would fail the manifest gate. That's why `copilot/cloudy` exists. Also note: for Copilot CLI, a legacy root `plugin.json` beats `.github/plugin/plugin.json`, so `plugins/cloudy/.github/plugin/plugin.json` is never read by Copilot (installing `plugins/cloudy` directly still works because skills/commands/`.mcp.json` are found by default paths). I didn't edit `plugins/cloudy/.github/plugin/plugin.json`; it isn't needed.
- To avoid the second copy of the skill, the alternative is to turn `plugins/cloudy/plugin.json` into Agent Plugins 1.0 (`$schema` + the fields in `copilot/cloudy/plugin.json`) and add `$schema` to `plugins/cloudy/mcp.json`. But then VS Code treats `plugins/cloudy` as Agent Plugins and looks for commands only in `com.github.copilot/commands/`, so commands would need moving or copying anyway. Keeping `copilot/cloudy` separate is simpler.
- Direct installs (`copilot plugin install OWNER/REPO:path`) now print "deprecated; only plugin@marketplace installs will be supported", so the marketplace file matters.
- The MCP Registry listing is owned by `registries/`; GitHub's registry additionally needs the partnerships email after that.

## Sources

- Copilot CLI plugin reference (manifest fields, locations, marketplace lookup order, defaults): https://docs.github.com/en/copilot/reference/cli-plugin-reference
- Creating a plugin: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating
- Creating a marketplace: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace
- Agent Plugins spec and schemas: https://agent-plugins.org/ , https://agent-plugins.org/schemas/1.0.0/plugin.schema.json
- awesome-copilot contributing (external plugin flow, gates): https://github.com/github/awesome-copilot/blob/main/CONTRIBUTING.md ; form: https://github.com/github/awesome-copilot/blob/main/.github/ISSUE_TEMPLATE/external-plugin.yml ; gate code: https://github.com/github/awesome-copilot/blob/main/eng/external-plugin-quality-gates.mjs
- GitHub MCP Registry, how to get included (publish to the open registry, then email partnerships@github.com): https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/
- Official MCP Registry remote servers: https://modelcontextprotocol.io/registry/remote-servers.md
