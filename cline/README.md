# Cloudy for Cline

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and Cline reads those comments, fixes the page, replies and resolves the thread. Every version is kept. Spaces are private unless you share them.

This folder is Cloudy's listing for the [Cline MCP Marketplace](https://github.com/cline/mcp-marketplace). Cloudy is a hosted MCP server: no install, no API key. You sign in with your browser.

## Install

**From the marketplace:** open MCP Servers in Cline, search for Cloudy, click Install. Cline follows [llms-install.md](llms-install.md).

**By hand:** add the `cloudy` entry from [llms-install.md](llms-install.md) to your MCP settings (MCP Servers > Configure > Configure MCP Servers), or in the Cline CLI run the `cline mcp add` line from that file. Then click **Authenticate** next to `cloudy` (CLI: `cline mcp`, then **Authorize OAuth**) and sign in.

**Skill (optional):** `npm i -g usecloudy` (Node.js 20 or later), then `cloudy skill install`. It puts the `cloudtifact` skill in `~/.cline/skills/`, so Cline knows when to publish with Cloudy and how to work through comments, including whole folders of docs from a repo. `cloudy upgrade` keeps the CLI and the skill current. To run it once, use `npx usecloudy` (`npx cloudy` is someone else's package).

## What it can do

Publish an HTML page and get its link (`publish_page`); find and read your spaces, files and versions; read comments, reply, resolve and edit them; make folders; archive a space; read and query a space's database.

## What data it sends

The server stores only what you ask it to. Cline talks only to Cloudy's servers, signed in as you:

- **Publishing** uploads the page you choose to your Cloudy space. It's kept until you delete it.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves Cline makes.
- **Space databases** run only the queries Cline sends, with your access to that space.

Your sign-in token is kept by Cline in its MCP settings file on your machine and is only sent to Cloudy. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs/mcp
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
