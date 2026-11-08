# Cloudy for goose

Cloudy gives the pages and docs goose makes a stable link. People comment on the exact text they mean, and goose reads those comments, fixes the page, replies and resolves the thread. Every version is kept. Spaces are private by default.

There are two ways to add it. Use one, or both.

## 1. The Cloudy extension (recommended)

goose calls extensions what other agents call MCP servers. Cloudy's is a remote one, so nothing runs on your machine and there's no API key: the first time goose uses it, it opens your browser to sign in to Cloudy.

**goose Desktop:** open this link (paste it in your browser's address bar):

```
goose://extension?type=streamable_http&url=https%3A%2F%2Fmcp.cloudtifact.com%2Fmcp&id=cloudy&name=Cloudy&description=Publish%20pages%20and%20docs%20to%20a%20stable%20link%2C%20then%20read%2C%20fix%2C%20reply%20to%20and%20resolve%20comments%20on%20them.&timeout=300
```

Or go to **Extensions > Add custom extension**, pick **Streamable HTTP**, and enter `https://mcp.cloudtifact.com/mcp`.

**goose CLI:** run `goose configure`, choose **Add Extension > Remote Extension (Streamable HTTP)**, name it `cloudy` and enter `https://mcp.cloudtifact.com/mcp`. Or add it to `~/.config/goose/config.yaml`:

```yaml
extensions:
  cloudy:
    name: cloudy
    type: streamable_http
    uri: https://mcp.cloudtifact.com/mcp
    enabled: true
    timeout: 300
```

To try it for one session only: `goose session --with-streamable-http-extension https://mcp.cloudtifact.com/mcp`.

Then ask goose for a page ("make me a one-page summary of this and share it"), or for your feedback ("address the comments on my Cloudy page").

## 2. The Cloudy skill and CLI

The skill teaches goose to publish with the `cloudy` command and to work through comments, including docs folders linked with `.cloudtifact.json`.

```
npm i -g usecloudy      # Node.js 20 or later; or run once with npx usecloudy (not npx cloudy, someone else's package)
cloudy skill install    # writes the skill to ~/.agents/skills/, which goose reads
cloudy login            # gives you a link to sign in in your browser
```

`cloudy upgrade` updates the CLI and the skill together. Check it's there with `goose skills list` (it's called `cloudtifact`).

## Recipe

[`recipes/cloudy.yaml`](recipes/cloudy.yaml) starts a goose session with the Cloudy extension, the developer extension (so goose can read the files it publishes) and three starter prompts. Run it with `goose run --recipe goose/recipes/cloudy.yaml --interactive`, or open it in goose Desktop with `goose recipe open goose/recipes/cloudy.yaml`. `goose recipe deeplink goose/recipes/cloudy.yaml` prints a link you can share.

## What data it sends

The extension and recipe store nothing themselves. goose talks only to Cloudy's servers (`mcp.cloudtifact.com`), signed in as you:

- **Publishing** uploads the page or docs goose sends, plus the files they reference, to your Cloudy space. They're kept until you delete them.
- **Comments** reads the comments on your spaces (with their authors' names) and posts the replies and resolves goose makes.
- **Space databases** run only the queries goose sends, with your access to that space.

goose keeps your sign-in in its own secret store (your system keychain) and only sends it to Cloudy. The skill path uses the `cloudy` CLI instead, which keeps its token in `~/.config/cloudtifact/config.json`. See the [privacy policy](https://usecloudy.ai/privacy).

## Links

- Docs: https://usecloudy.ai/docs (extension: https://usecloudy.ai/docs/mcp)
- Privacy: https://usecloudy.ai/privacy
- Terms: https://usecloudy.ai/terms
- Support: support@usecloudy.ai

MIT licensed.
