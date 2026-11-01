# Cloudy plugins

[Cloudy](https://cloudtifact.com) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept.

This repo is a plugin marketplace. The `cloudtifact` plugin adds:

- **A skill** that teaches the agent to publish HTML pages with Cloudy instead of a throwaway preview, and to read, address, reply to and resolve comments.
- **Commands:** `/cloudtifact:publish [file.html]`, `/cloudtifact:comments`, `/cloudtifact:status`.

It uses the [Cloudy CLI](https://www.npmjs.com/package/usecloudy): `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. `cloudtifact` is the same command under its old name, so older setups keep working. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). The first time, the agent runs `cloudy login` and gives you a link to sign in in your browser.

## Install

**Claude Code**

```
/plugin marketplace add Cloudtifact/plugins
/plugin install cloudtifact@cloudtifact
```

**Codex**

```
codex plugin marketplace add Cloudtifact/plugins
codex plugin add cloudtifact@cloudtifact
```

**Other agents** (Cursor, GitHub Copilot, OpenCode and others that read skills):

```
npx skills add Cloudtifact/plugins
```

Or run `cloudy skill install` after installing the CLI, which writes the same skill into every agent's skills folder on your machine. `cloudy upgrade` updates the CLI and those copies together.

## What data it sends

The plugin itself stores nothing. Its commands run the `cloudy` CLI, which talks only to Cloudy's API (`api.cloudtifact.com`), signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Your sign-in token stays in `~/.config/cloudtifact/config.json` on your machine and is only sent to Cloudy's API. See the [privacy policy](https://cloudtifact.com/privacy).

## Links

- Docs: https://cloudtifact.com/docs
- Privacy: https://cloudtifact.com/privacy
- Terms: https://cloudtifact.com/terms
- Support: support@cloudtifact.com

MIT licensed.
