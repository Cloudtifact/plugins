# Installing the Cloudy MCP server in Cline

Cloudy is a hosted (remote) MCP server. There is nothing to clone, build or run, and no API key: the user signs in with their browser.

Server address (Streamable HTTP): `https://mcp.cloudtifact.com/mcp`

## Steps

1. Add this entry under `mcpServers` in Cline's MCP settings file (`~/.cline/data/settings/cline_mcp_settings.json`; in VS Code or JetBrains open it from MCP Servers > Configure > Configure MCP Servers). Keep any servers already there.

   ```json
   {
     "mcpServers": {
       "cloudy": {
         "type": "streamableHttp",
         "url": "https://mcp.cloudtifact.com/mcp",
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

   `"type": "streamableHttp"` is required. Without it Cline uses the old SSE transport and the server won't connect. Don't add an `Authorization` header.

   In the Cline CLI you can do the same with:

   ```sh
   cline mcp add cloudy https://mcp.cloudtifact.com/mcp --transport streamableHttp --yes
   ```

2. Sign in. The server answers the first request with `401` and Cline starts OAuth on its own (discovery, client registration and PKCE). Tell the user to click **Authenticate** next to the `cloudy` server in MCP Servers, or in the CLI run `cline mcp` and choose **Authorize OAuth**. A browser tab opens; the user signs in to Cloudy (or creates a free account) and approves. Cline stores the token in the same settings file.

3. Check it works: call `list_spaces`. It returns the user's spaces (an empty list is fine for a new account).

## Tools

`publish_page`, `list_spaces`, `find_spaces`, `get_space`, `read_file`, `list_folders`, `create_folder`, `list_comments`, `add_comment`, `reply_to_comment`, `resolve_comment`, `edit_comment`, `archive_space`, `list_versions`, `list_capabilities`, `database_schema`, `query_database`, `list_workspaces`.

Safe to auto-approve (read only): `list_spaces`, `find_spaces`, `get_space`, `read_file`, `list_folders`, `list_comments`, `list_versions`, `list_capabilities`, `database_schema`, `list_workspaces`. Leave the others to the user.

## Optional: the Cloudy skill

For publishing whole folders of docs from a repo, install the Cloudy CLI (`npm i -g usecloudy`, Node.js 20 or later) and run `cloudy skill install`. It writes the `cloudtifact` skill into `~/.cline/skills/`, which Cline loads when the user asks to publish or check comments. Use `npx usecloudy`, never `npx cloudy` (a different package).

## Troubleshooting

- "Server won't connect": check `"type": "streamableHttp"` is set and the URL ends in `/mcp`.
- Auth errors after a while: authorize again (step 2).
- Docs: https://usecloudy.ai/docs/mcp. Help: support@usecloudy.ai.
