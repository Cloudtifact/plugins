# Cloudy for Devin and Windsurf

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the agent reads those comments, fixes the page, replies and resolves the thread. Every version is kept. Spaces are private unless you make them public.

Windsurf is now Devin Desktop (Cognition). Its agent is Devin Local, which shares its setup with the Devin CLI and Devin cloud sessions. The older Cascade agent still exists in the Windsurf plugins for JetBrains, VS Code and other editors.

All of them connect to Cloudy's MCP server. There's no API key: the first time the agent uses Cloudy, a browser window opens so you can sign in.

## Install

**Devin (cloud), once listed:** Customize → Plugins → Browse marketplace → Cloudy → Install, then Connect.

**Devin Desktop and the Devin CLI:**

```sh
devin mcp add -s user cloudy https://mcp.cloudtifact.com/mcp
devin mcp login cloudy
```

Or in Devin Desktop: Customize → MCPs → This computer, open the config file and add the `cloudy` entry from `devin-marketplace/plugins/cloudy/.devin-plugin/plugin.json`.

**Cascade (Windsurf plugins for JetBrains, VS Code and others):** in Cascade's MCP menu choose **Open MCP config file** and merge in [`mcp_config.json`](mcp_config.json), then press refresh.

**The skill (optional, for local agents):** `npm i -g usecloudy` (Node.js 20 or later), then `cloudy skill install`. Devin Desktop and the Devin CLI read it from `~/.agents/skills/`. It teaches the agent the `cloudy` command as well as the MCP tools.

## What it does

Tools the agent gets: `publish_page`, `list_spaces`, `find_spaces`, `get_space`, `read_file`, `list_folders`, `create_folder`, `list_comments`, `add_comment`, `reply_to_comment`, `resolve_comment`, `edit_comment`, `archive_space`, `list_versions`, `list_capabilities`, `database_schema`, `query_database`, `list_workspaces`.

By default Devin asks before it calls any MCP tool.

## What data it sends

This package stores nothing. The agent talks only to Cloudy's MCP server, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Your sign-in token is kept by Devin: on your machine for Devin Desktop, the CLI and Cascade, and in your Devin account for cloud sessions. It's only sent to Cloudy. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs/mcp
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
