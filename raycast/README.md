# Cloudy

[Cloudy](https://usecloudy.ai) gives the pages, reports and docs you make a stable link. People comment on the exact text they mean, and you (or your AI) fix the page, reply and resolve the thread. Every version is kept. Spaces are private to your workspace unless you make them public.

## Commands

- **Search Spaces**: your spaces, with actions to open or copy the link, see the open comments, and resolve them.
- **Publish HTML File**: pick an HTML file and publish it as a new space, or as a new version of one you have. Files the page loads from its own folder (CSS, scripts, images) go with it. The link is copied when it's done.

## Raycast AI

Mention `@cloudy` in Raycast AI (AI Chat or Quick AI) to publish a page, find a space, or work through its comments: for example "@cloudy what are the open comments on my Q3 report?". Raycast AI uses Cloudy's own tools for this.

## Sign in

The first time you use a command, Raycast asks you to sign in to Cloudy in your browser. There's no API key to copy. Raycast AI asks you to sign in once more the first time you mention `@cloudy`, because AI and the commands keep separate sign-ins. You can sign out from the extension's settings.

## What data it sends

The extension stores nothing itself. It talks only to Cloudy's servers, signed in as you:

- **Publishing** uploads the HTML file you choose, plus the files it loads from its folder, to your Cloudy space. They're kept until you delete them.
- **Search Spaces** reads the names, links and versions of the spaces you can see.
- **Comments** reads the comments on a space (with their authors' names) and resolves the ones you choose.
- **Raycast AI** sends what the AI asks for through Cloudy's tools: the pages it publishes, the spaces, files and comments it reads, and the replies and resolves it makes.

Your sign-in is kept by Raycast on your Mac and only sent to Cloudy. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai
