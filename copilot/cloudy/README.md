# Cloudy for GitHub Copilot

[Cloudy](https://usecloudy.ai) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept. Spaces are private unless you make them public.

This plugin works in GitHub Copilot CLI and in VS Code's agent plugins. It adds:

- **The Cloudy MCP server** (`https://mcp.cloudtifact.com/mcp`): tools to publish a page, list and find your spaces, read files, and list, add, reply to, edit and resolve comments. The first time a tool is used, you sign in to Cloudy in your browser. No API key.
- **A skill** (`cloudtifact`) that teaches the agent to publish HTML pages with Cloudy instead of a throwaway preview, and to work through the comments people leave.
- **Commands:** `/publish [file.html]`, `/comments`, `/status`. These use the [Cloudy CLI](https://www.npmjs.com/package/usecloudy) (`npm i -g usecloudy`, Node.js 20 or later). The first time, the agent runs `cloudy login` and gives you a link to sign in.

## Requirements

- A Cloudy account. You sign in in the browser the first time; there's no key to paste.
- For the commands: Node.js 20 or later and the `cloudy` CLI. The MCP tools work without it.

## Install

**Copilot CLI**

```
copilot plugin marketplace add Cloudtifact/plugins
copilot plugin install cloudy@cloudy
```

**VS Code**: run **Chat: Install Plugin from Source** and enter `https://github.com/Cloudtifact/plugins`, or add `Cloudtifact/plugins` to the `chat.plugins.marketplaces` setting and install Cloudy from **Chat: Open Customizations** > **Browse**.

## What data it sends

The plugin itself stores nothing.

- **The MCP server** runs on Cloudy's servers. Copilot sends it the tool calls the agent makes (for example the page to publish, or the reply to post), signed in as you. Copilot keeps the sign-in token on your machine.
- **The commands** run the `cloudy` CLI, which talks only to Cloudy's API, signed in as you. Its token stays in `~/.config/cloudtifact/config.json`.

Either way:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

See the [privacy policy](https://usecloudy.ai/privacy) and [terms](https://usecloudy.ai/terms).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Support: support@usecloudy.ai

MIT licensed.
