# Cloudy for Gemini CLI

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept, and spaces are private unless you make one public.

This Gemini CLI extension adds:

- **Cloudy's MCP server** (`cloudy`): tools to publish a page, find your spaces, read files and versions, and read, reply to and resolve comments. No API key: the first time, run `/mcp auth cloudy` and sign in in your browser.
- **A skill** (`cloudtifact`) that teaches the agent to publish HTML with Cloudy instead of leaving a local file, and to work through comments with the Cloudy CLI.
- **A context file** (`GEMINI.md`) that tells the agent when to use which.
- **Commands:** `/cloudy:publish [file.html]`, `/cloudy:comments`, `/cloudy:status`.

The skill and commands use the [Cloudy CLI](https://www.npmjs.com/package/usecloudy): `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). The first time, the agent runs `cloudy login` and gives you a link to sign in in your browser. Without the CLI, the agent uses the MCP tools.

## Install

```
gemini extensions install https://github.com/Cloudtifact/cloudy-gemini
```

From a local copy of this folder:

```
gemini extensions install ./gemini      # copies it
gemini extensions link ./gemini         # or links it, for development
```

Restart Gemini CLI, then run `/mcp auth cloudy` once.

## What data it sends

The extension itself stores nothing. It connects Gemini CLI to Cloudy two ways, both signed in as you:

- **The MCP server** (the address is in `gemini-extension.json`) receives the tool calls the agent makes: the pages it publishes, and the comments, replies and resolves it reads or writes.
- **The `cloudy` CLI** talks only to Cloudy's API.

What that covers:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Gemini CLI keeps the MCP sign-in token in `~/.gemini/mcp-oauth-tokens.json`; the CLI keeps its token in `~/.config/cloudtifact/config.json`. Both stay on your machine and are only sent to Cloudy. What you type to Gemini, and what the tools return, also goes to Google's model under your Gemini terms. See Cloudy's [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
