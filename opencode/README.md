# Cloudy for OpenCode

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept. Spaces are private unless you make them public.

This OpenCode plugin adds:

- **The Cloudy MCP server** (`cloudy`): tools to publish a page, list and read spaces, and read, reply to and resolve comments. You sign in in your browser the first time; there's no API key.
- **The `cloudtifact` skill**, which teaches the agent to publish HTML with Cloudy instead of a throwaway preview, and to work through comments.
- **Commands:** `/cloudy-publish [file.html]`, `/cloudy-comments`, `/cloudy-status`.

The skill and commands use the [Cloudy CLI](https://www.npmjs.com/package/usecloudy): `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). The first time, the agent runs `cloudy login` and gives you a link to sign in.

Needs OpenCode 2 (V2 plugins). On OpenCode 1, use the config below instead.

## Install

```sh
opencode plugin add opencode-cloudy
```

Then sign in to the MCP server:

```sh
opencode mcp auth cloudy
```

Options (all on by default):

```jsonc
{
  "plugins": [
    { "package": "opencode-cloudy", "options": { "mcp": true, "skill": true, "commands": true } }
  ]
}
```

If you already ran `cloudy skill install`, OpenCode finds that copy of the skill and the plugin leaves it alone. A `cloudy` MCP server you set up yourself is also left alone.

### Without the plugin

Copy [`opencode.json`](./opencode.json) into your project (or `~/.config/opencode/opencode.json`). It adds the MCP server and the three commands. For the skill, run `cloudy skill install`. Or add just the server:

```sh
opencode mcp add cloudy --url https://mcp.cloudtifact.com/mcp
```

### From this repo (before it's on npm)

```jsonc
{
  "plugins": ["/path/to/plugins/opencode"]
}
```

## What data it sends

The plugin itself stores nothing and sends nothing. It registers a server, a skill and three commands.

- **The MCP server** connects to Cloudy (`mcp.cloudtifact.com`), signed in as you. OpenCode keeps the sign-in token outside your project config. Tools only send what the agent asks for: the page or files it publishes, the comments it reads, the replies and resolves it posts, and the space-database queries it runs, with your access.
- **The commands and skill** run the `cloudy` CLI, which talks only to Cloudy's API (`api.cloudtifact.com`). Publishing uploads the page or docs you choose, plus the files they reference, to your Cloudy space; they're kept until you delete them. The CLI's sign-in token stays in `~/.config/cloudtifact/config.json` on your machine.

See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
