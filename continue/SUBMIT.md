# Continue: how to list Cloudy

**Short version: there is nowhere to submit to any more.** Continue Hub (hub.continue.dev) is gone, so nobody needs to create a "cloudy" hub org, and nothing is public there. Continue the open-source extension still works and still reads these blocks from local folders, so this folder is how Continue users install Cloudy. We list it in our own docs and README.

## What happened (checked 2026-11-08)

- https://continue.dev now shows "Continue has joined Cursor. Continue was acquired by Cursor", with FAQs on "What happened to my data?" and "What about my subscription?". The page hides every link to `app.continue.dev` and `/export`.
- `hub.continue.dev` and `api.continue.dev` no longer resolve in DNS (`curl: Could not resolve host: hub.continue.dev`). `api.continue.dev` is the registry address that `@continuedev/config-yaml`'s `RegistryClient` uses to resolve `uses: owner/slug`, so hub slugs such as `uses: cloudy/cloudy` can't work any more, even in an installed extension. `app.continue.dev` answers HTTP 402.
- https://github.com/continuedev/continue README: "The `continuedev/continue` repository is no longer actively maintained and is read-only for all users." It ends with a "Final 2.0.0 Release" (VS Code v2.1.0-vscode, 2026-06-19) that pulled out sign-in ("pulling out authentication"). The last commit, 2026-07-21, is "docs: remove Sign in link (login flow retired)". So we can't send a PR to their docs either (for example to `docs/customize/deep-dives/mcp-examples.mdx`).
- The docs pages about the Hub have been removed from the docs site. https://docs.continue.dev/hub/introduction returns 404 and `docs/docs.json` has no Hub section.
- Press coverage (secondary sources): https://thenewstack.io/cursor-acquires-continue-coding/, https://dev.to/leobaniak/cursor-acquires-continue-and-gives-its-users-a-july-15-export-deadline-5dkn and https://byteiota.com/continue-dev-shuts-down-export-your-data-before-july-15/ report that the hosted Hub closed after a 2026-07-15 data-export deadline.

## What still works, and what this package uses

The final extension (VS Code Marketplace `Continue.continue`, Open VSX, JetBrains, and the `@continuedev/cli` `cn` command) still loads local config:

- YAML blocks from `.continue/<type>/*.yaml` in the workspace and from `~/.continue/<type>/` (`core/config/yaml/loadYaml.ts`, `includeGlobal: true, includeWorkspace: true`). The format is the same one hub blocks used: `name`, `version`, `schema: v1` and exactly one item. Docs: https://docs.continue.dev/customize/deep-dives/mcp, https://docs.continue.dev/customize/deep-dives/rules, https://docs.continue.dev/customize/deep-dives/prompts, https://docs.continue.dev/reference.
- Remote MCP servers over `type: streamable-http` with a `url`, plus MCP OAuth (`core/context/mcp/MCPOauth.ts`). Continue signs in through `http://localhost:3000` (or VS Code's `getExternalUri` when you're on a remote machine). Our server allows loopback redirects. I checked that `https://mcp.cloudtifact.com/mcp` answers `401` with `WWW-Authenticate: Bearer ... resource_metadata=...`, so discovery works.
- Skills (`SKILL.md`) from `~/.continue/skills/`, `.continue/skills/` and a project's `.claude/skills/` (`core/config/markdown/loadMarkdownSkills.ts`).

Files:

| File | What it is |
|---|---|
| `mcpServers/cloudy.yaml` | MCP block. **The server address is only here** (`url:`). |
| `rules/cloudy.yaml` | Rule block, `alwaysApply: false`, with a description so the agent pulls it in when it's relevant. Kept short because rules go into the system message. It's a summary written for the MCP tools, not a copy of the skill, so it doesn't need a resync when the CLI updates. |
| `prompts/cloudy-publish.yaml`, `prompts/cloudy-comments.yaml` | Prompt blocks for `/cloudy-publish` and `/cloudy-comments`. Each block holds one prompt because the block schema allows exactly one. Continue prompts have no `$ARGUMENTS`, so whatever the user types after the command is read as the file or space. |

Version is 0.3.3 in every block. Change it in all four files together.

## MCP address note

The MCP address may move from `https://mcp.cloudtifact.com/mcp` to `https://mcp.usecloudy.ai/mcp`. If it does, change the one `url:` line in `mcpServers/cloudy.yaml`. Nothing else here names the address.

## Validation

The official validator is the `@continuedev/config-yaml` package (v1.42.0, the schema the extension uses). I ran it in scratch (`/tmp/t0279-continue/val`, script `validate.js`):

```
$ node validate.js continue/mcpServers/cloudy.yaml continue/rules/cloudy.yaml continue/prompts/cloudy-publish.yaml continue/prompts/cloudy-comments.yaml
mcpServers/cloudy.yaml blockSchema: OK | configYamlSchema: OK
  parseBlock: OK
rules/cloudy.yaml blockSchema: OK | configYamlSchema: OK
  parseBlock: OK
prompts/cloudy-publish.yaml blockSchema: OK | configYamlSchema: OK
  parseBlock: OK
prompts/cloudy-comments.yaml blockSchema: OK | configYamlSchema: OK
  parseBlock: OK
exit=0
```

The validator does reject bad input. My first prompts file held two prompts in one block and failed with `prompts: Array must contain exactly 1 element(s)`, which is why there are now two files. I also ran a full config that pulls in all four blocks with `uses: file://...` through `unrollAssistantFromContent` (the extension's own loader):

```
errors: [] fatal: false
mcpServers: [{"name":"Cloudy","url":"https://mcp.cloudtifact.com/mcp","type":"streamable-http"}]
rules: [ 'Cloudy alwaysApply=false' ]
prompts: [ 'cloudy-publish', 'cloudy-comments' ]
```

Not done: I didn't load the blocks in a real VS Code with Continue installed, and I didn't go through the browser sign-in.

## Steps for John

1. Nothing to sign, no account, no fees, no art needed: there is no store.
2. Optional: mention Continue in the repo's top-level README install section ("Continue: copy `continue/mcpServers`, `rules` and `prompts` into `~/.continue/`"), and on https://usecloudy.ai/docs/mcp as an "add by URL" client (`type: streamable-http`, `url: https://mcp.cloudtifact.com/mcp`).
3. Optional, outside this folder: add `{ agent: "continue", parts: [".continue", "skills"] }` to `SKILL_TARGETS` in the CLI (`packages/cli/src/skill.ts`), so that `cloudy skill install` also writes the skill where Continue reads it. Right now Continue only finds the skill in a project's `.claude/skills/` or after a hand copy into `~/.continue/skills/`.

Low priority overall: Continue gets no more development and its users are moving off it.
