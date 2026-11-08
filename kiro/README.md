# Cloudy for Kiro

A Kiro power for [Cloudy](https://usecloudy.ai). Cloudy gives the pages, reports and docs your agent makes a stable link. People comment on the exact text they mean, and the agent reads the comments, fixes the page, replies and resolves the thread. Every version is kept. Spaces are private by default.

The power adds:

- **The Cloudy MCP server** (`mcp.json`). The agent can publish pages, list and find your spaces, read files, and read, add, reply to, edit and resolve comments. You sign in in your browser the first time; there's no API key.
- **A skill** (`skills/cloudtifact/SKILL.md`) that tells the agent when to publish with Cloudy and how to work through comments. It also covers the Cloudy CLI (`npm i -g usecloudy`, Node.js 20 or later) for publishing a whole docs folder from a repo.

Kiro turns the power on when you mention things like "publish this page", "share a report" or "comments" (see `keywords` in `plugin.json`).

## Install

**Kiro IDE:** Powers panel, then **Add Custom Power**, then **Import power from GitHub**, and enter:

```
https://github.com/Cloudtifact/plugins/tree/main/kiro
```

Or clone this repo and pick **Import power from a folder** with the `kiro` folder.

**Kiro CLI:**

```
kiro-cli powers install ./kiro
```

(or `/powers install ./kiro` inside a chat). Remove it with `kiro-cli powers uninstall cloudy`.

The first time the agent uses a Cloudy tool, Kiro opens a Cloudy sign-in page in your browser.

## What data it sends

The power itself stores nothing. It connects Kiro to Cloudy's MCP server (the address is in `mcp.json`), signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies, edits and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Kiro keeps your sign-in token and sends it only to Cloudy. If the agent uses the Cloudy CLI instead, its token stays in `~/.config/cloudtifact/config.json` on your machine and is only sent to Cloudy's API.

## Links

- Docs: https://usecloudy.ai/docs (MCP: https://usecloudy.ai/docs/mcp)
- Privacy policy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
