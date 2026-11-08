# Cloudy for pi

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept, and spaces are private unless you make them public.

This pi package adds:

- **The Cloudy skill** (`/skill:cloudtifact`): teaches the agent to publish HTML pages with Cloudy and to read, address, reply to and resolve comments.
- **Prompts:** `/cloudy-publish [file.html] [--public]`, `/cloudy-comments`, `/cloudy-status`.
- **Cloudy's MCP server**, so the agent can also publish, list spaces and work through comments with tools.

## Install

```
pi install npm:pi-cloudy
```

To try it for one session without installing: `pi -e npm:pi-cloudy`. From a clone of this repo: `pi install ./pi`.

The skill and prompts use the [Cloudy CLI](https://www.npmjs.com/package/usecloudy): `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). The first time, the agent runs `cloudy login` and gives you a link to sign in in your browser.

The MCP server needs a one-time sign-in too: inside pi, run `/mcp login cloudy` (pi shows "cloudy: needs sign-in" until you do). It opens your browser; there's no API key. If you only want the CLI, keep the package's skill and prompts and turn the server off in `pi config`, or install with `{ "source": "npm:pi-cloudy", "extensions": [] }` in `~/.pi/agent/settings.json`.

## What data it sends

The package itself stores nothing.

- **The skill and prompts** run the `cloudy` CLI, which talks only to Cloudy's API (`api.cloudtifact.com`), signed in as you. Your sign-in token stays in `~/.config/cloudtifact/config.json` on your machine.
- **The MCP server** (`mcp.cloudtifact.com`) is reached by pi, signed in as you. Pi keeps that token in `~/.pi/agent/mcp-auth.json`.

Either way:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
