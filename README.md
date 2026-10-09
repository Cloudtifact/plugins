# Cloudtifact plugins

[Cloudtifact](https://cloudtifact.com) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept.

This repo is a plugin marketplace. The `cloudtifact` plugin adds:

- **A skill** that teaches the agent to publish HTML pages with Cloudtifact instead of a throwaway preview, and to read, address, reply to and resolve comments.
- **Commands:** `/cloudtifact:publish [file.html]`, `/cloudtifact:comments`, `/cloudtifact:status`.

It uses the [`cloudtifact` CLI](https://www.npmjs.com/package/cloudtifact) (`npm i -g cloudtifact`, Node.js 20 or later). The first command asks you to sign in in your browser.

## Install

**Claude Code**

```
/plugin marketplace add Cloudtifact/plugins
/plugin install cloudtifact@cloudtifact
```

**Other agents** (Codex, Cursor, OpenCode and others that read skills):

```
npx skills add Cloudtifact/plugins
```

Or run `cloudtifact skill install` after installing the CLI, which writes the same skill into every agent's skills folder on your machine.

## What data it sends

The plugin itself stores nothing. Its commands run the `cloudtifact` CLI, which talks only to Cloudtifact's API (`api.cloudtifact.com`), signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudtifact space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Your sign-in token stays in `~/.config/cloudtifact/config.json` on your machine and is only sent to Cloudtifact's API. See the [privacy policy](https://cloudtifact.com/privacy).

## Links

- Docs: https://cloudtifact.com/docs
- Privacy: https://cloudtifact.com/privacy
- Terms: https://cloudtifact.com/terms
- Support: support@cloudtifact.com

MIT licensed.
