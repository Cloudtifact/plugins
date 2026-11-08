# Cloudy for DeepSeek Harness

[Cloudy](https://usecloudy.ai) gives the pages and docs your agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept, and spaces are private by default.

This is a DeepSeek Harness (`dsh`) plugin bundle. It adds one skill, `cloudtifact`, that teaches the agent to publish HTML pages with Cloudy instead of a throwaway preview, and to read, address, reply to and resolve comments. You can also call it yourself from the skill menu.

The skill uses the [Cloudy CLI](https://www.npmjs.com/package/usecloudy): `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. To run it once without installing, use `npx usecloudy` (`npx cloudy` is someone else's package). The first time, the agent runs `cloudy login` and gives you a link to sign in in your browser.

## Install

In the desktop app or web UI: **Plugins**, **Add plugin**, then enter `dsh-plugin-cloudy`.

Or from a terminal (use your profile name; the desktop app's is `desktop`, `dsh web`'s is `web`):

```
dsh plugin --profile desktop add dsh-plugin-cloudy
```

Restart dsh after installing. To remove it: `dsh plugin --profile desktop remove dsh-plugin-cloudy`.

If you already ran `cloudy skill install`, dsh finds that copy in `~/.agents/skills` too, and it takes priority over the one in this plugin, so `cloudy upgrade` keeps it current.

## What data it sends

The plugin itself stores nothing and makes no network requests. The skill tells the agent to run the `cloudy` CLI, which talks only to Cloudy's API (`api.cloudtifact.com`), signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Your sign-in token stays in `~/.config/cloudtifact/config.json` on your machine and is only sent to Cloudy's API. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
