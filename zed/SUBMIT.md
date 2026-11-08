# Zed: how Cloudy gets listed

**Short version: don't submit a Zed extension.** Zed's extension registry has stopped accepting new extensions for remote MCP servers, and Cloudy is one. The route Zed points to is the **official MCP registry**, which Zed plans to read in place of MCP extensions. Until it does, users add Cloudy by URL (see README.md). Nothing to sign or pay for in Zed.

Checked 2026-11-08.

## What Zed offers

| Thing | Status for Cloudy | Source |
|---|---|---|
| Extension registry (zed.dev/extensions, PR to `zed-industries/extensions`) | Exists, but **closed to remote MCP servers**. An extension can only *launch a command* (`context_server_command` returns a `zed::Command`); it can't declare a URL. Wrapping the URL in `npx mcp-remote` is exactly what maintainers reject. | https://zed.dev/docs/extensions/mcp-extensions ("Remote context servers should be added natively via the UI"); rejections with the same wording: zed-industries/extensions PRs #7972 (closed 2026-10-15), #7154, #6801, #6774, #6277 |
| MCP server extensions in general | Being deprecated in favour of the official MCP registry | https://zed.dev/docs/extensions/publishing/prerequisites ("MCP Server Extensions" section); zed-industries/zed#59351 (open) |
| Native remote MCP (`context_servers.<name>.url`, OAuth when no `Authorization` header) | **Works today.** This is what README.md uses. | https://zed.dev/docs/ai/mcp#as-custom-servers |
| Official MCP registry support in Zed | Planned, not shipped | zed-industries/zed#59352 "Add support for the official MCP registry" (open, updated 2026-10-23) |
| Easier remote-server install (likely a one-click link) | Planned, not shipped | zed-industries/zed#59355 (open) |
| Skills | Zed reads Agent Skills `SKILL.md` from `~/.agents/skills/` and `<worktree>/.agents/skills/`. It has **no remote skill registry**, and extensions can't ship skills. It points people to skills.sh. It can import one skill from a GitHub `.md` URL, or from a `zed://skill?data=…` share link. | https://zed.dev/docs/ai/skills |
| Slash-command and agent-server extensions | Deprecated; new submissions refused (agent servers go to the ACP registry, which doesn't apply to us) | https://zed.dev/docs/extensions/publishing/prerequisites |

Docs were read from their source on 2026-11-08: `github.com/zed-industries/zed/tree/main/docs/src/{ai/mcp.md, ai/skills.md, extensions/mcp-extensions.md, extensions/developing-extensions.md, extensions/publishing/*.md}`.

## Steps for John

1. **Official MCP registry** (this is how we reach Zed later). Another harness thread may already own this. If not, it's the `mcp-publisher` flow at https://registry.modelcontextprotocol.io/: a `server.json` with a `remotes` entry `{ "type": "streamable-http", "url": "<MCP URL>" }` and a namespace that has to be verified (DNS for `ai.usecloudy/*`, or GitHub for `io.github.cloudtifact/*`). Once Zed ships #59352, Cloudy should appear in Zed with no Zed-specific work.
2. **skills.sh.** Zed's skills docs send people there. That's covered by `npx skills add Cloudtifact/plugins` from the root README, so there's nothing Zed-specific to do.
3. **Optional:** add a "Zed" section to the docs at https://usecloudy.ai/docs/mcp with the snippet from `zed/context_servers.json`.
4. **Optional:** watch zed-industries/zed#59352 and #59355. If #59355 adds an install link (like Cursor's or VS Code's deeplinks), add a "Add to Zed" button to the docs then.

Nothing to click or sign in Zed today. (For the record, an extension PR would also need the Zed CLA at https://zed.dev/cla, signed by whoever opens the PR. It's moot for us.)

## If Zed ever reverses this (for the record, don't do it now)

What a Zed extension would need:
- Its **own public repo**, or a subfolder of one, holding `extension.toml`, `Cargo.toml`, `src/lib.rs` and a `LICENSE` file *inside that folder* (a licence at the repo root doesn't count). The licence has to be MIT, Apache-2.0 or another one on Zed's list.
- A PR to `zed-industries/extensions` that adds the repo as an HTTPS git submodule at `extensions/<id>`, adds `[<id>] submodule = "extensions/<id>"`, `path = "zed"` (if it's a subfolder) and `version = "…"` to `extensions.toml`, and runs `pnpm sort-extensions`. The submodule commit must be on a branch. Exactly one extension per PR.
- An ID like `cloudy-mcp-server` or `mcp-server-cloudy` (it can't contain "zed" or "extension"). The extension may provide one MCP server and nothing else, and must not bundle the server.
- It must launch a local command. Our CLI has no stdio MCP mode (`grep -rn mcp packages/cli/src` finds only a comment), so the only option would be `npx mcp-remote <url>`, the very thing Zed rejects.
- No icon, screenshots, video or demo account. The registry shows no art.

## Art needed

None. The Zed registry has no icons or screenshots, and this package has no extension.

## MCP domain note

The server address appears **once** in this package, in `zed/context_servers.json` (`https://mcp.cloudtifact.com/mcp`). README.md points to that file instead of repeating the URL. If the server moves to `mcp.usecloudy.ai`, change that one line. Users who already added it have to update their own Zed settings, so keep the old host redirecting or serving for a while.

## Validation

- `python3 -m json.tool zed/context_servers.json`: valid. Zed doesn't publish a standalone settings JSON schema (it generates one in the app), and Zed isn't installed on this Mac, so this wasn't loaded in the real app.
- `curl -si -X POST https://mcp.cloudtifact.com/mcp …initialize…` returns `HTTP/2 401` with `www-authenticate: Bearer realm="OAuth", resource_metadata="https://mcp.cloudtifact.com/.well-known/oauth-protected-resource/mcp", scope="cloudtifact"`. That's the challenge Zed's MCP OAuth flow starts from.
- There's no extension, so there was no `cargo build --target wasm32-wasip2`.
