# Submitting Cloudy for goose

Checked 2026-11-08 against goose 1.57.0 and `aaif-goose/goose` at commit `5bad61a` (2026-11-08).

## Short version

goose (now `aaif-goose/goose`, docs at goose-docs.ai) has **no store that takes new entries today**:

- The **extensions directory** (goose-docs.ai/extensions, fed by `documentation/static/servers.json`) stopped taking submissions on 2026-07-30. PRs that add servers are closed without merging. The last entry was added 2026-07-29.
- The **Recipe Cookbook** (goose-docs.ai/recipes) stopped taking submissions too.
- goose says to publish to the **official MCP Registry** instead (`server.json`). Once goose's registry support lands, servers there "will show up in the goose doc pages automatically". That support isn't merged yet: PR #11934 (import `server.json` into goose config) and issue #13172 (deeplinks from the registry) are open.
- **Plugins** (skills and hooks) install straight from a git URL with `goose plugin install <url>`. There's no plugin index.

So the one submission is: **publish `goose/server.json` to the official MCP Registry.** Everything else here is for people to install today.

Sources:
- Directory retired: https://github.com/aaif-goose/goose/discussions/10830 ("Effective immediately, we are no longer accepting new server contributions to our registry ... Publish your server to the official MCP registry using the server.json format. Once our support lands, it will show up in the goose doc pages automatically.") and `documentation/AGENTS.md` in the goose repo ("new directory submissions are no longer accepted").
- Recipe submissions closed: https://goose-docs.ai/blog/2025/09/15/subrecipes-in-goose and https://goose-docs.ai/blog/2025/08/25/goose-became-its-own-watchdog (both now say "The public Recipe Cookbook submission program has ended").
- Registry support in progress: https://github.com/aaif-goose/goose/pull/11934, https://github.com/aaif-goose/goose/issues/13172
- Extensions and deeplinks: https://goose-docs.ai/docs/getting-started/using-extensions
- Plugins: https://goose-docs.ai/docs/guides/context-engineering/plugins
- Skills: https://goose-docs.ai/docs/guides/context-engineering/using-skills
- Recipes: https://goose-docs.ai/docs/guides/recipes/recipe-reference
- MCP Registry: https://modelcontextprotocol.io/registry/quickstart, https://modelcontextprotocol.io/registry/authentication, https://modelcontextprotocol.io/registry/remote-servers, terms https://modelcontextprotocol.io/registry/terms-of-service

## What's in this folder

| File | What it is |
|---|---|
| `server.json` | The official MCP Registry entry (remote server, no packages). This is the "directory entry" goose now points to. |
| `deeplink.txt` | The goose Desktop install link (`goose://extension?...`), same format as goose's own deeplink generator. |
| `recipes/cloudy.yaml` | A recipe: Cloudy extension + developer extension + three starter prompts. |
| `goose-plugin.json` | A goose plugin manifest for the skill. **Not usable from here**: the lead must copy it to the repo root (see below). |
| `build.mjs` | Writes `server.json`, `deeplink.txt`, `recipes/cloudy.yaml` and the links in `README.md` from one set of values. |
| `README.md` | How to install it today, what it does, what data it sends. |

## The MCP address

The address `https://mcp.cloudtifact.com/mcp` may move to `mcp.usecloudy.ai`. It's set once, as `MCP_URL` at the top of `goose/build.mjs`. To move it: change that line, run `node goose/build.mjs`, and bump `VERSION` (the registry won't take a second publish of the same version). I tested the swap in a scratch copy: no old address left anywhere, and both validators still pass.

## Submission: the official MCP Registry

The registry is free and has no review queue: a publish goes live once the namespace check passes. It's still a preview, and its data may be reset before general availability. It checks that you own the name, not the URL. Directories like PulseMCP (the one goose's docs link to) read from it.

**Name to use: `ai.usecloudy/cloudy`** (domain proof on usecloudy.ai). The other option is `io.github.Cloudtifact/cloudy` with GitHub sign-in as a member of the Cloudtifact org. That works too, but the domain name looks like the product.

Note: check whether another t0279 thread (an "MCP Registry" harness) is publishing the same entry. Publish it **once**, from one `server.json`.

### Fields (all in `server.json`)

| Field | Value |
|---|---|
| `name` | `ai.usecloudy/cloudy` |
| `title` | `Cloudy` |
| `description` (max 100 chars) | `Publish pages and docs to a stable link, then read, fix, reply to and resolve comments on them.` (96 chars). Plain description, not a tagline. If John wants his own line, it's `DESCRIPTION` in `build.mjs`. DRAFT (John writes this) |
| `version` | `0.3.3` |
| `websiteUrl` | `https://usecloudy.ai/docs/mcp` |
| `icons` | `https://usecloudy.ai/icon.png`, `image/png`, `512x512` (live today, 512x512, checked) |
| `remotes` | `streamable-http` at `https://mcp.cloudtifact.com/mcp` |
| `repository` | left out on purpose: the server's code isn't in a public repo, and the field is for the server's source code |

No headers or env vars: sign-in is OAuth, found from the 401. goose supports Client ID Metadata Documents (its client id is `https://goose-docs.ai/oauth/client-metadata.json`, redirect `http://127.0.0.1/oauth_callback` on a random port), and Cloudy supports those.

### Steps for John

1. `brew install mcp-publisher openssl@3` (the macOS `openssl` can't make Ed25519 keys).
2. Make a key and the proof (HTTP proof, served from our own site):
   ```sh
   /opt/homebrew/opt/openssl@3/bin/openssl genpkey -algorithm Ed25519 -out ~/.config/cloudtifact/mcp-registry-key.pem
   PUBLIC_KEY="$(/opt/homebrew/opt/openssl@3/bin/openssl pkey -in ~/.config/cloudtifact/mcp-registry-key.pem -pubout -outform DER | tail -c 32 | base64)"
   echo "v=MCPv1; k=ed25519; p=${PUBLIC_KEY}"
   ```
   Keep the `.pem` private: anyone with it can publish under usecloudy.ai.
3. Serve that one line as plain text at `https://usecloudy.ai/.well-known/mcp-registry-auth` (a landing-site change, in the cloudtifact repo). Or, instead, add it as a TXT record on the apex `usecloudy.ai` (not a subdomain) and use `login dns` below.
4. Sign in:
   ```sh
   PRIVATE_KEY="$(/opt/homebrew/opt/openssl@3/bin/openssl pkey -in ~/.config/cloudtifact/mcp-registry-key.pem -noout -text | grep -A3 "priv:" | tail -n +2 | tr -d ' :\n')"
   mcp-publisher login http --domain usecloudy.ai --private-key "$PRIVATE_KEY"
   ```
5. From `~/Documents/cloudy-plugins/goose`: `mcp-publisher validate server.json`, then `mcp-publisher publish server.json`.
6. Check: `curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=ai.usecloudy"`.

**What John agrees to:** the Official MCP Registry Terms of Service (by publishing; you must be 18+, and you confirm you can act for Cloudy). No fees, no account to create beyond the domain proof, no forms.

## Optional: open a goose discussion or issue

There's nothing to submit to goose itself right now. When PR #11934 or issue #13172 ships, check that Cloudy shows up on goose-docs.ai/extensions. Don't open a PR to `servers.json`: they're closed without merging.

## Plugin (skill): needs a file at the repo root

`goose plugin install` reads the manifest only at the **root** of the git repo (`.goose-plugin/plugin.json`, `.plugin/plugin.json` or `plugin.json`). Today `goose plugin install https://github.com/Cloudtifact/plugins` fails with `Error: No supported plugin format found` (tested on a copy of the repo).

**Lead:** copy `goose/goose-plugin.json` to `/.goose-plugin/plugin.json` at the repo root. It points at `./plugins/cloudy/skills`, so the skill isn't copied and stays in step with the CLI. Then users run:

```sh
goose plugin install --auto-update https://github.com/Cloudtifact/plugins
```

goose renames the installed skill `cloudy:cloudtifact` (in its own copy; our file is untouched). If someone also ran `cloudy skill install`, they'll have both `cloudtifact` and `cloudy:cloudtifact` with the same text. That's harmless. When the root manifest lands, add the `goose plugin install` line to `goose/README.md` as a third way, and say to use it or `cloudy skill install`, not both.

goose plugins can bundle MCP servers, but only local (stdio) ones, not a remote URL. So the plugin carries the skill, and the remote server is added with the deeplink or config.

## Art

None needed. The registry entry uses the live `https://usecloudy.ai/icon.png` (512x512). goose's extension pages don't take screenshots, banners or video.

## Validation (run 2026-11-08)

```
$ mcp-publisher validate server.json            # mcp-publisher 1.8.8
Validating against https://registry.modelcontextprotocol.io...
✅ server.json is valid

$ npx -p ajv-cli@5 -p ajv-formats@2 ajv validate --spec=draft7 -c ajv-formats -s server.schema.json -d server.json --strict=false
server.json valid                               # schema 2025-12-11 from static.modelcontextprotocol.io

$ goose recipe validate recipes/cloudy.yaml     # goose 1.57.0
✓ recipe file is valid

$ goose recipe deeplink recipes/cloudy.yaml
✓ Generated deeplink for: Cloudy
goose://recipe?config=eyJ2ZXJzaW9uIjoiMS4wLjAi...

$ HOME=<scratch> goose plugin install <scratch copy of repo + .goose-plugin/plugin.json>
✓ Installed open-plugins plugin 'cloudy' (0.3.3)
  Imported skills:
    - cloudy:cloudtifact
$ HOME=<scratch> goose skills list
cloudy:cloudtifact | Use when the user wants a page, report, dashboa... | .../plugins/cloudy/skills/cloudtifact

$ (same, without the root manifest)
Error: No supported plugin format found
```

The deeplink parses to name `Cloudy`, url `https://mcp.cloudtifact.com/mcp`, type `streamable_http`, with no headers or env vars, so goose installs it straight away without a settings screen (checked against `ui/desktop/src/components/settings/extensions/deeplink.ts`). The server answers an unauthenticated `initialize` with `401` and `WWW-Authenticate: Bearer resource_metadata=...`, which is what goose's OAuth flow expects.

**Not tested:** a real sign-in and tool call from goose (that needs a model provider set up in goose and a browser sign-in). Worth one manual run before announcing: open the deeplink in goose Desktop, ask it to publish a page, and confirm the browser sign-in comes back to `127.0.0.1` on a random port.

## Blockers

- No goose directory to list in until goose's registry support lands (not under our control).
- Registry publish needs the domain proof at `usecloudy.ai/.well-known/mcp-registry-auth` (or a DNS TXT record), so a landing-site change or DNS access.
- Plugin install needs `/.goose-plugin/plugin.json` at the repo root (the lead's change).
