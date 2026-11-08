# Cloudy for Grok Build

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and Grok reads those comments, fixes the page, replies and resolves the thread. Every version is kept, and spaces are private unless you make them public.

This plugin adds:

- **Cloudy's hosted MCP server** (in `.mcp.json`): tools to publish a page, list and find spaces, read files, and list, add, reply to, edit and resolve comments. You sign in with your Cloudy account in the browser the first time; there's no API key.
- **A skill** (`cloudtifact`) that teaches Grok to publish HTML with Cloudy instead of a throwaway preview, and to work through comments.
- **Commands:** `/cloudy:publish [file.html]`, `/cloudy:comments`, `/cloudy:status`. They use the [Cloudy CLI](https://www.npmjs.com/package/usecloudy) (`npm i -g usecloudy`, Node.js 20 or later; or `npx usecloudy` once. `npx cloudy` is someone else's package).

## Install

```
grok plugin marketplace add Cloudtifact/plugins
grok plugin install cloudy --trust
```

Or install this folder straight from the repo: `grok plugin install Cloudtifact/plugins#grok --trust`.

Then open `/mcps`, pick **cloudy** and press `i` to sign in.

## What data it sends

The plugin itself stores nothing. It talks only to Cloudy's servers, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Grok keeps the MCP sign-in token in `~/.grok/mcp_credentials.json` on your machine. The CLI keeps its own token in `~/.config/cloudtifact/config.json`. Both are only sent to Cloudy. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
