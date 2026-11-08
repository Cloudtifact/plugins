# Cloudy for ChatGPT and Codex

[Cloudy](https://usecloudy.ai) gives the pages and docs ChatGPT or Codex makes a stable link. People comment on the exact text they mean, and the comments go back to the assistant, which fixes the page, replies and resolves the thread. Every version is kept, and new pages are private unless you ask for a public link.

This package is the listing for OpenAI's Plugins Directory, which ChatGPT and Codex share. It adds:

- **Cloudy's hosted MCP server** (`https://mcp.usecloudy.ai/mcp`): tools to publish a page, find your spaces, read files and versions, and read, reply to and resolve comments. You sign in with your Cloudy account the first time. There's no key to copy.
- **Skills:** `get-started` (first publish) and `cloudy` (publish, update, comments).

You need a Cloudy account (free sign-up at [usecloudy.ai](https://usecloudy.ai)).

## Install

Once the listing is published, install Cloudy from the Plugins Directory in ChatGPT or Codex.

Until then, in ChatGPT: Plugins → + → Add custom MCP server → name Cloudy, public endpoint, OAuth, `https://mcp.usecloudy.ai/mcp`. In Codex CLI:

```
codex mcp add cloudy --url https://mcp.usecloudy.ai/mcp
codex mcp login cloudy
```

Codex CLI can also load the skill from this repo's shared plugin:

```
codex plugin marketplace add Cloudtifact/plugins
codex plugin add cloudy@cloudy
```

## What data it sends

The plugin stores nothing itself. It talks only to Cloudy, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the assistant makes.
- **Space databases** run only the queries the assistant sends, with your access to that space.

With the MCP server, ChatGPT or Codex keeps the sign-in and you can revoke it under **Settings → CLI sign-ins** on the Cloudy website. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs/integrations/chatgpt
- MCP: https://usecloudy.ai/docs/mcp
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
