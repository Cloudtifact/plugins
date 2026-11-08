# Cloudy for VS Code

[Cloudy](https://usecloudy.ai) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept. Spaces are private unless you make them public.

This extension adds two things to Copilot chat in agent mode:

- **The Cloudy MCP server**: tools to publish a page, list and find your spaces, read files, and list, add, reply to, edit and resolve comments. The first time a tool is used, VS Code asks you to sign in to Cloudy in your browser. No API key.
- **A skill** (`cloudtifact`) that teaches the agent when to publish with Cloudy instead of a throwaway preview, and how to work through the comments people leave. It can also use the [Cloudy CLI](https://www.npmjs.com/package/usecloudy) (`npm i -g usecloudy`, Node.js 20 or later) when it's installed.

## Use it

1. Install the extension.
2. Open Copilot chat in agent mode. Cloudy's tools appear in the tools picker.
3. Ask for a page ("make me a one-page summary of this repo and share it"), or ask what people said about something you published.

## What data it sends

The extension itself stores nothing and has no settings.

- **The MCP server** runs on Cloudy's servers. VS Code sends it the tool calls the agent makes (for example the page to publish, or the reply to post), signed in as you. VS Code keeps the sign-in token in its secret storage.
- **Publishing** uploads the page or docs you choose to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

See the [privacy policy](https://usecloudy.ai/privacy) and [terms](https://usecloudy.ai/terms).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Support: support@usecloudy.ai
- Source: https://github.com/Cloudtifact/plugins/tree/main/vscode

MIT licensed.
