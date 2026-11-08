# Cloudy for Continue

[Cloudy](https://usecloudy.ai) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept, and spaces are private by default.

This folder holds Cloudy as [Continue](https://docs.continue.dev) config blocks:

- `mcpServers/cloudy.yaml`: the Cloudy MCP server (remote, sign-in in your browser, no API key).
- `rules/cloudy.yaml`: tells the agent when and how to use Cloudy. It is pulled in only when the chat is about pages, sharing or Cloudy comments (`alwaysApply: false`).
- `prompts/cloudy-publish.yaml` and `prompts/cloudy-comments.yaml`: `/cloudy-publish` and `/cloudy-comments` in Chat, Plan and Agent mode.

MCP tools work only in Continue's Agent mode.

## Install

Copy the three folders into `.continue/` at the top of your project, or into `~/.continue/` to use them in every project:

```sh
mkdir -p ~/.continue
cp -R mcpServers rules prompts ~/.continue/
```

Or point a `config.yaml` at them:

```yaml
mcpServers:
  - uses: file:///path/to/continue/mcpServers/cloudy.yaml
rules:
  - uses: file:///path/to/continue/rules/cloudy.yaml
prompts:
  - uses: file:///path/to/continue/prompts/cloudy-publish.yaml
  - uses: file:///path/to/continue/prompts/cloudy-comments.yaml
```

The first time the agent uses a Cloudy tool, Continue opens a browser page to sign in to Cloudy.

**Prefer the CLI?** Install it with `npm i -g usecloudy` (Node.js 20 or later), which gives you the `cloudy` command. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). Continue reads skills from `~/.continue/skills/` and from a project's `.claude/skills/`. To add the Cloudy skill:

```sh
mkdir -p ~/.continue/skills/cloudtifact
cp ../plugins/cloudy/skills/cloudtifact/SKILL.md ~/.continue/skills/cloudtifact/
```

## What data it sends

The blocks store nothing. The MCP server and the `cloudy` CLI both talk only to Cloudy's servers, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Continue keeps your MCP sign-in token on your machine and sends it only to Cloudy's MCP server. The CLI keeps its token in `~/.config/cloudtifact/config.json`. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
