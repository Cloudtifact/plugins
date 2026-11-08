# Cloudy for Antigravity

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept, and spaces are private unless you make them public.

This plugin adds:

- **The Cloudy MCP server** (`https://mcp.cloudtifact.com/mcp`): tools to publish a page, find and read your spaces, list folders, read, add, reply to, edit and resolve comments, list versions, archive a space, and query a space's database. The first time a tool runs, Antigravity opens your browser to sign in to Cloudy. There's no API key to paste.
- **The `cloudtifact` skill**: teaches the agent to publish HTML pages with Cloudy instead of a throwaway preview, and to read, address, reply to and resolve comments. For docs kept in a repo, it uses the [Cloudy CLI](https://www.npmjs.com/package/usecloudy) (`npm i -g usecloudy`, Node.js 20 or later; `npx usecloudy` runs it once, while `npx cloudy` is someone else's package). Run it yourself with `/cloudtifact`.

## Install

From the Antigravity Marketplace, once it's listed: open **Customizations > Marketplace**, find Cloudy and click **Add**. Or in the CLI:

```
agy plugin install cloudy
```

Today, straight from GitHub (or from a local copy of the repo):

```
agy plugin install https://github.com/Cloudtifact/plugins/tree/main/antigravity/cloudy
agy plugin list
```

Then ask the agent to "publish this page with Cloudy", or click one of the starter prompts on the plugin's page.

## What data it sends

The plugin itself stores nothing. Its MCP tools and the `cloudy` CLI talk only to Cloudy's servers, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Antigravity keeps the MCP sign-in on your machine. The CLI keeps its sign-in token in `~/.config/cloudtifact/config.json` and only sends it to Cloudy's API. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
