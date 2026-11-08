# Cloudy for Amp

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the agent reads those comments, fixes the page, replies and resolves the thread. Every version is kept. Spaces are private by default.

Amp has no plugin store, so you add Cloudy yourself. Pick one of these, or use both.

## Option 1: the Cloudy server (no install)

```
amp mcp add cloudy https://mcp.cloudtifact.com/mcp
```

The first time Amp uses it, Amp prints a sign-in link. Open it, sign in to Cloudy, and you're done. There's no API key. To try it for one session without changing your settings, run `amp --mcp-config mcp.json` from this folder.

This gives the agent tools to publish a page, list and find your spaces, read files, read and reply to comments, resolve them, see past versions and query a space's database.

## Option 2: the Cloudy skill and CLI

```
npm i -g usecloudy
amp skill add Cloudtifact/plugins/plugins/cloudy/skills/cloudtifact --global
```

The CLI needs Node.js 20 or later. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). The first time, the agent runs `cloudy login` and gives you a link to sign in in your browser.

You can also run `cloudy skill install` after installing the CLI. It writes the same skill to `~/.agents/skills/`, which Amp reads, and `cloudy upgrade` keeps it current.

The skill teaches the agent to publish HTML with Cloudy instead of a throwaway preview, and to read, address, reply to and resolve comments.

## What data it sends

Nothing in this folder stores data. The server and the `cloudy` CLI talk only to Cloudy, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

With the server, Amp keeps your sign-in token in its own secret storage on your machine. With the CLI, the token stays in `~/.config/cloudtifact/config.json`. Either way it's only sent to Cloudy. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (server: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
