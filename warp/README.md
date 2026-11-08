# Cloudy for Warp

[Cloudy](https://usecloudy.ai) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept, and spaces are private unless you share them.

Warp has no plugin store, so this folder holds three things you add yourself:

- **`mcp.json`**: the Cloudy MCP server, for Warp's agent.
- **The Cloudy skill**, which teaches the agent to publish pages with Cloudy and work through comments. Warp reads it from `~/.agents/skills/`.
- **`workflows/`**: Warp workflows for the `cloudy` commands, for when you'd rather run them yourself.

## Install

### MCP server (Warp's agent)

Either:

- In Warp, open **Settings** > **Agents** > **MCP servers**, click **+ Add**, and paste the contents of [`mcp.json`](mcp.json). Or,
- copy it to `~/.warp/.mcp.json` (merge it into `mcpServers` if you already have that file). Warp starts global servers from that file by itself.

The first time the server starts, Warp opens your browser to sign in to Cloudy. There's no API key. To sign out, revoke the credentials on the MCP servers page.

The agent can then publish pages, list and find spaces, read files, read, add, reply to and resolve comments, list versions and query a space's database.

### Skill and CLI

```
npm i -g usecloudy
cloudy login
cloudy skill install
```

`usecloudy` needs Node.js 20 or later. `cloudy skill install` writes the skill to `~/.agents/skills/cloudtifact/SKILL.md`, where Warp's agent finds it, and `cloudy upgrade` keeps it current. You can also run it as `/cloudtifact` in Warp. To run the CLI once without installing it, use `npx usecloudy` (`npx cloudy` is someone else's package).

Or add only the skill: `npx skills add Cloudtifact/plugins`.

### Workflows

```
mkdir -p ~/.warp/workflows && cp workflows/*.yaml ~/.warp/workflows/
```

Then open Command Search (`ctrl-shift-r`) and look under **My Workflows**:

- **Cloudy - Publish an HTML page and get a link**: `cloudy publish {{path}}`
- **Cloudy - Print the open comments on a space for your agent**: `cloudy comments --space {{space}}`
- **Cloudy - Reply to a comment and resolve it**: `cloudy reply {{comment_id}} "{{reply}}" && cloudy resolve {{comment_id}}`
- **Cloudy - Install the CLI, sign in and add the agent skill**

## What data it sends

This package stores nothing. The MCP server and the `cloudy` CLI talk only to Cloudy, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Warp keeps the MCP sign-in on your device. The CLI keeps its token in `~/.config/cloudtifact/config.json` and sends it only to Cloudy's API. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
