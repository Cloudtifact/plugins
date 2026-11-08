# Cloudy for Junie

Publish the HTML pages and docs Junie makes to a stable link. People comment on the exact text, and Junie reads, fixes, replies to and resolves those comments. Every version is kept, and spaces are private unless you make them public.

This extension adds two things to Junie:

- **The Cloudy MCP server** (`mcp/.mcp.json`): tools to publish pages, list spaces, read files, and read, reply to and resolve comments. You sign in in your browser the first time; there's no API key.
- **The Cloudy skill** (`skills/cloudtifact/SKILL.md`): tells Junie when to publish with Cloudy and how to work through comments. It uses the `cloudy` command when it's installed (`npm i -g usecloudy`, Node 20+, then `cloudy login`).

## Install it locally today

In Junie CLI, add the `jetbrains/` folder of a clone of https://github.com/Cloudtifact/plugins as a local marketplace, then install:

```text
/extensions marketplace add ~/path/to/plugins/jetbrains
/extensions install cloudy
```

(`/extensions marketplace add Cloudtifact/plugins` also works today, but the repo root holds the Claude-format manifest, which gives you the skill and the `/publish`, `/comments` and `/status` commands without the MCP server.)

Then run `/mcp`, pick **Cloudy**, choose **Authorize**, and sign in in the browser page that opens. The status turns **Active**.

### Without the extension

- **Junie (CLI or IDE)**: add this to `~/.junie/mcp/mcp.json`, then authorize it from `/mcp`:

  ```json
  { "mcpServers": { "Cloudy": { "url": "https://mcp.cloudtifact.com/mcp" } } }
  ```

  For the skill alone, run `cloudy skill install` or copy `skills/cloudtifact/` to `~/.junie/skills/`.
- **AI Assistant**: Settings | Tools | AI Assistant | Model Context Protocol (MCP) → Add, paste the same JSON.

## What data it sends

The extension itself stores nothing. Junie talks only to Cloudy's MCP server and the `cloudy` CLI talks only to Cloudy's API, both signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Your MCP sign-in is kept by Junie on your machine. The CLI's sign-in token stays in `~/.config/cloudtifact/config.json` and is only sent to Cloudy's API. See the [privacy policy](https://usecloudy.ai/privacy).

Docs: https://usecloudy.ai/docs/mcp · Support: support@usecloudy.ai · License: MIT
