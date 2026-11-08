# Cloudy for Zed

Cloudy gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the agent reads those comments, fixes the page, replies and resolves them. Every version is kept, and spaces are private by default.

Zed has no Cloudy extension. Zed's built-in remote MCP support connects to Cloudy directly, so nothing needs installing. The skill is optional.

## 1. Connect the MCP server (Zed Agent)

Either:

- **In the app:** open **Settings → AI → MCP Servers**, click **Add Server**, choose **Add Remote Server**, name it `cloudy` and paste the `url` from [`context_servers.json`](context_servers.json).
- **In the settings file** (`zed: open settings file`): merge the `context_servers` block from [`context_servers.json`](context_servers.json) into it.

Leave out the `headers` field. With no `Authorization` header, Zed signs you in with the standard MCP OAuth flow: a browser window opens, you sign in to Cloudy and approve, and that's it. You don't need an API key.

If the dot next to `cloudy` in **Settings → AI → MCP Servers** is green, it's connected. Then ask the agent something like "publish this report with Cloudy" or "read the comments on my Cloudy page and fix them".

Zed passes the servers you set up here on to External Agents (over ACP) too.

Tools it adds: `publish_page`, `list_spaces`, `find_spaces`, `get_space`, `read_file`, `list_folders`, `create_folder`, `list_comments`, `add_comment`, `reply_to_comment`, `resolve_comment`, `edit_comment`, `archive_space`, `list_versions`, `list_capabilities`, `database_schema`, `query_database`, `list_workspaces`.

## 2. Optional: the skill

The skill tells the agent when to publish with Cloudy and how to work through comments. Zed reads skills from `~/.agents/skills/` (every project) and `<project>/.agents/skills/` (one project).

- With the CLI: `npm i -g usecloudy` (Node.js 20 or later), then `mkdir -p ~/.agents && cloudy skill install`. The CLI only writes to `~/.agents/skills/` if `~/.agents` already exists, which is why you create it first. `cloudy upgrade` keeps the copy up to date.
- Without the CLI: in Zed, copy this GitHub URL and run **agent: create skill from url**: `https://github.com/Cloudtifact/plugins/blob/main/plugins/cloudy/skills/cloudtifact/SKILL.md`. This copy doesn't update itself.

The skill uses the `cloudy` CLI (`npx usecloudy` runs it once; `npx cloudy` is someone else's package). If the MCP server is connected, the agent can use the MCP tools instead.

## What data it sends

Nothing from this folder runs on your machine. Zed talks to Cloudy's MCP server, signed in as you:

- **Publishing** uploads the page or docs the agent sends to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Zed stores your sign-in token and sends it only to Cloudy's MCP server. Zed asks you before each tool call unless you have changed `agent.tool_permissions`. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
