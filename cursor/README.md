# Cloudy for Cursor

Cloudy gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the agent reads those comments, fixes the page, replies and resolves the thread. Every version is kept, and spaces are private unless you make them public.

The Cursor plugin is not in this folder. It is `plugins/cloudy/` in this repo, which Cursor finds through `.cursor-plugin/marketplace.json` at the repo root. This folder holds only this README and `SUBMIT.md`.

## What the plugin adds

| Part | File | What it does |
|---|---|---|
| MCP server | `plugins/cloudy/.mcp.json` | Connects Cursor to Cloudy at `https://mcp.cloudtifact.com/mcp`. You sign in in your browser the first time. No API key. Tools: `publish_page`, `list_spaces`, `find_spaces`, `get_space`, `read_file`, `list_folders`, `create_folder`, `list_comments`, `add_comment`, `reply_to_comment`, `resolve_comment`, `edit_comment`, `archive_space`, `list_versions`, `list_capabilities`, `database_schema`, `query_database`, `list_workspaces`. |
| Skill | `plugins/cloudy/skills/cloudtifact/SKILL.md` | Tells the agent when to publish with Cloudy and how to handle comments. It uses the Cloudy CLI (`npm i -g usecloudy`, Node.js 20 or later, gives the `cloudy` command). |
| Commands | `plugins/cloudy/commands/` | `publish`, `comments`, `status`. |
| Manifest | `plugins/cloudy/.cursor-plugin/plugin.json` | Name, version, logo, and where the MCP config is. |

The MCP address is written in one place, `plugins/cloudy/.mcp.json`. Other agents read that file too.

## Install it locally today

**Cursor app.** Copy (or symlink) the plugin into Cursor's local plugins folder, then run **Developer: Reload Window**:

```sh
git clone https://github.com/Cloudtifact/plugins ~/src/cloudy-plugins
ln -s ~/src/cloudy-plugins/plugins/cloudy ~/.cursor/plugins/local/cloudy
```

Then open **Customize** (or Settings, MCP), find `plugin-Cloudy-cloudy`, and sign in.

**Cursor CLI.**

```sh
cursor-agent --plugin-dir ~/src/cloudy-plugins/plugins/cloudy
```

**Teams and Enterprise.** An admin can import `https://github.com/Cloudtifact/plugins` as a team marketplace (Dashboard, Plugins).

**Only the MCP server.** Open this link, or add the JSON below to `~/.cursor/mcp.json`:

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=cloudy&config=eyJ1cmwiOiJodHRwczovL21jcC5jbG91ZHRpZmFjdC5jb20vbWNwIn0=
```

```json
{ "mcpServers": { "cloudy": { "url": "https://mcp.cloudtifact.com/mcp" } } }
```

**Only the skill.** `npm i -g usecloudy`, then `cloudy skill install`. It writes the skill into `~/.cursor/skills/` and the other agents' folders.

## What data it sends

The plugin itself stores nothing.

- **MCP server.** Each tool call goes to Cloudy's MCP server, signed in as you, and only does what that tool says. Publishing uploads the page you choose to your Cloudy space, and it's kept until you delete it. Comment tools read the comments on your spaces (with their authors' names) and post the replies and resolves the agent makes. Database tools run only the queries the agent sends, with your access to that space. Cursor keeps the sign-in token on your machine and sends it only to Cloudy's MCP server.
- **Skill and commands.** These run the `cloudy` CLI, which talks only to Cloudy's API, signed in as you, and sends the same kinds of data as above. Its sign-in token stays in `~/.config/cloudtifact/config.json` on your machine and is only sent to Cloudy's API.

See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
