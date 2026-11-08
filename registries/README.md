# Cloudy in MCP and skill registries

Files for the directories that many agent apps read from, rather than one app's own store.

- `server.json`: Cloudy's listing for the official MCP Registry, under the new name `ai.usecloudy/cloudy`. Glama and PulseMCP copy their listings from that registry.
- `SUBMIT.md`: how to list Cloudy in each directory: the official MCP Registry, Glama, mcp.so, PulseMCP, Smithery and skills.sh.

## Connect today without any directory

- **MCP:** add `https://mcp.cloudtifact.com/mcp` as a remote (Streamable HTTP) server in your agent. The first call opens a browser sign-in. You don't need an API key.
- **Skill:** run `npx skills add Cloudtifact/plugins --skill cloudtifact`, or `npm i -g usecloudy && cloudy skill install`.

## What data it sends

The listing itself stores nothing. Connecting the MCP server signs you in to Cloudy, and your agent only sees the spaces you can open:

- **Publishing** uploads the page or docs your agent sends to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves your agent makes.
- **Space databases** run only the queries your agent sends, with your access to that space.

See the [privacy policy](https://usecloudy.ai/privacy).
