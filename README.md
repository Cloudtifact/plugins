# Cloudy plugins

[Cloudy](https://usecloudy.ai) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept.

Each agent gets Cloudy one of two ways:

- **Cloudy's hosted MCP server** (`https://mcp.cloudtifact.com/mcp`). You sign in with your Cloudy account the first time. There's no key to copy.
- **The Cloudy CLI and its skill.** `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. The skill teaches the agent to publish with it and to work through comments. The first time, the agent runs `cloudy login` and gives you a link to sign in.

## Install

| Agent | How |
| --- | --- |
| Claude Code | `/plugin install cloudy --marketplace Cloudtifact/plugins` |
| Codex | `codex plugin marketplace add Cloudtifact/plugins`, then `codex plugin add cloudy@cloudy` |
| GitHub Copilot CLI | `copilot plugin marketplace add Cloudtifact/plugins`, then `copilot plugin install cloudy@cloudy` |
| Cursor | Clone this repo and link `plugins/cloudy` into `~/.cursor/plugins/local/` (see [cursor/](cursor/README.md)); teams can import the repo as a marketplace |
| Grok | `grok plugin marketplace add Cloudtifact/plugins`, then `grok plugin install cloudy@cloudy` |
| Antigravity | `agy plugin install https://github.com/Cloudtifact/plugins/tree/main/antigravity/cloudy` |
| Gemini CLI, pi, OpenCode, DeepSeek Harness, Kiro, VS Code, Raycast, Cline, Amp, Goose, Warp, Zed, Continue | See the folder of the same name |
| JetBrains Junie, Devin/Windsurf | See [jetbrains/](jetbrains/) and [windsurf/](windsurf/) |
| Anything that reads skills | `npx skills add Cloudtifact/plugins`, or `cloudy skill install` after installing the CLI |
| Any other MCP client | Add a remote (Streamable HTTP) server at `https://mcp.cloudtifact.com/mcp` |

[SUMMARY.md](SUMMARY.md) lists every agent we checked, whether it has a store, and how Cloudy gets listed there.

## What data it sends

The plugins store nothing themselves. They talk only to Cloudy, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

With the CLI, your sign-in token stays in `~/.config/cloudtifact/config.json` on your machine. With the MCP server, your agent app keeps the sign-in and you can revoke it under **Settings → CLI sign-ins** on the website. See the [privacy policy](https://usecloudy.ai/privacy).

## For maintainers

- `scripts/sync-copies.sh`: after `packages/cli/scripts/sync-plugins.sh` updates `plugins/cloudy/`, copy the skill and commands into the harnesses that need their own copy.
- `scripts/set-mcp-url.sh <url>`: point every package at a new MCP address.

## Links

- Docs: https://usecloudy.ai/docs
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
