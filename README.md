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

## Links

- Docs: https://cloudtifact.com/docs
- Privacy: https://cloudtifact.com/privacy
- Terms: https://cloudtifact.com/terms
- Support: support@cloudtifact.com

MIT licensed.
