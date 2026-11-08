# Cloudy plugin

[Cloudy](https://usecloudy.ai) gives the pages and docs your coding agent makes a stable link. People comment on the exact text they mean, and the comments go back to the agent, which fixes the page, replies and resolves the thread. Every version is kept.

The `cloudy` plugin adds:

- **A skill** that teaches the agent to publish HTML pages with Cloudy instead of a throwaway preview, and to read, address, reply to and resolve comments.
- **Commands:** `/cloudy:publish [file.html]`, `/cloudy:comments`, `/cloudy:status`.

It uses the [Cloudy CLI](https://www.npmjs.com/package/usecloudy): `npm i -g usecloudy` (Node.js 20 or later) installs the `cloudy` command. The first time, the agent runs `cloudy login` and gives you a link to sign in in your browser.

## Install

```
/plugin install cloudy --marketplace Cloudtifact/plugins
```

Or in two steps: `/plugin marketplace add Cloudtifact/plugins`, then `/plugin install cloudy@cloudy`.

## What data it sends

The plugin itself stores nothing. Its commands run the `cloudy` CLI, which talks only to Cloudy's API, signed in as you:

- **Publishing** uploads the page or docs you choose, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves the agent makes.
- **Space databases** run only the queries the agent sends, with your access to that space.

Your sign-in token stays in `~/.config/cloudtifact/config.json` on your machine and is only sent to Cloudy's API. See the [privacy policy](https://usecloudy.ai/privacy).
