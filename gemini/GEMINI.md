# Cloudy

Cloudy gives the pages and docs you make a stable link. People comment on the exact text they mean; you read the comments, fix the page, reply and resolve. Every version is kept. Spaces are private unless the user asks for a public link.

When the user wants a page, report, dashboard, prototype or other HTML to look at or share, publish it with Cloudy and give them the link, instead of only writing a local file.

You can reach Cloudy two ways:

- **The `cloudy` MCP server** (tools such as `publish_page`, `list_spaces`, `find_spaces`, `list_comments`, `reply_to_comment`, `resolve_comment`, `list_versions`, `query_database`). The first time, run `/mcp auth cloudy` to sign in in the browser. Use these when the `cloudy` command isn't installed.
- **The `cloudy` CLI**, described in the `cloudtifact` skill. Prefer it in a repo with a `.cloudtifact.json` file, and for pages that reference local files (images, scripts, stylesheets). Install it with `npm i -g usecloudy` (Node.js 20 or later); `npx usecloudy` runs it once (`npx cloudy` is someone else's package).

Commands: `/cloudy:publish [file.html]`, `/cloudy:comments`, `/cloudy:status`.
