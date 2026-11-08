# Submitting Cloudy to cross-harness registries

Checked 2026-11-08. Nothing here has been submitted. Order matters: **do the official MCP Registry first.** Glama copies from it, and PulseMCP plans to when it reopens.

| Registry | Accepts | How | Status today |
|---|---|---|---|
| Official MCP Registry | remote MCP (`server.json`) | `mcp-publisher publish` after a DNS TXT proof | open; nothing published under any Cloudy name yet |
| Glama | remote MCP ("connectors") | picks it up from the official registry, then you claim it | open |
| mcp.so | remote MCP | web form at mcp.so/submit (free with review, or $39 to skip it) | open |
| PulseMCP | MCP | nothing to do: it says it will pick up official-registry entries when it reopens | **closed to submissions** |
| Smithery | none | no way to submit | **shut down Oct 31, 2026**; now a curated directory run by Arcade |
| skills.sh | Agent Skills | automatic: a skill appears once people install it with `npx skills add` from a public GitHub repo | works today, nothing to submit |

The MCP address lives in one place in this folder: `remotes[0].url` in `server.json`.

---

## 1. Official MCP Registry (registry.modelcontextprotocol.io)

Docs: https://github.com/modelcontextprotocol/registry/tree/main/docs/modelcontextprotocol-io (`authentication.mdx`, `remote-servers.mdx`, `faq.mdx`). Schema: https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json

### Rename: yes, publish as `ai.usecloudy/cloudy`

- The monorepo's `apps/mcp/server.json` says `com.cloudtifact/cloudtifact`, but that name **was never published**. Searching the registry for `cloudtifact` and `usecloudy` returns 0 servers, and neither domain has an `MCPv1` TXT record. So the rename costs nothing. Publish only the new name.
- A server name can never change once it's published. Its metadata is immutable too, except `status` (`docs/administration/admin-operations.md`, `registry-aggregators.mdx`). So pick the final name before the first publish.
- The namespace is the domain written backwards: `usecloudy.ai` becomes `ai.usecloudy`. DNS proof on the apex domain also covers subdomain namespaces (`ai.usecloudy.*`, from `internal/api/handlers/v0/auth/dns.go`). One TXT record on `usecloudy.ai` is enough.
- The registry **doesn't check** that the remote URL is on the namespace's domain (`remote-servers.mdx`). So `ai.usecloudy/cloudy` can point at `mcp.cloudtifact.com` today and move later.
- Version: this file says `0.1.0`, the first version under this name. The registry sets no versioning scheme for remote servers. Bump the version on every publish, because a published version can't be edited.

### DNS proof (John, at the DNS host for usecloudy.ai)

Needs OpenSSL 3, because macOS LibreSSL can't make Ed25519 keys. `mcp-publisher` 1.8.8 is already installed with brew on this Mac.

```sh
brew install openssl@3 mcp-publisher
O=/opt/homebrew/opt/openssl@3/bin/openssl
$O genpkey -algorithm Ed25519 -out ~/.config/cloudtifact/mcp-registry-key.pem     # keep it out of every repo
PUBLIC_KEY="$($O pkey -in ~/.config/cloudtifact/mcp-registry-key.pem -pubout -outform DER | tail -c 32 | base64)"
echo "usecloudy.ai. IN TXT \"v=MCPv1; k=ed25519; p=${PUBLIC_KEY}\""
```

Add that TXT record **on the apex `usecloudy.ai`**. Don't put it under `_mcp-auth` or any other selector, because the registry won't find it there. Leave the existing google-site-verification and SPF records alone. Then:

```sh
PRIVATE_KEY="$($O pkey -in ~/.config/cloudtifact/mcp-registry-key.pem -noout -text | grep -A3 priv: | tail -n +2 | tr -d ' :\n')"
mcp-publisher login dns --domain usecloudy.ai --private-key "$PRIVATE_KEY"
cd ~/Documents/cloudy-plugins/registries && mcp-publisher validate && mcp-publisher publish
```

Alternative to DNS: serve the same `v=MCPv1; k=ed25519; p=…` line at `https://usecloudy.ai/.well-known/mcp-registry-auth`, then run `mcp-publisher login http --domain usecloudy.ai …`. The registry doesn't follow redirects, the file must be at most 4 KB, and the request comes from Google Cloud IPs. DNS is simpler.

Keep the private key. Every later publish needs it, and so does a `status` change.

### Fields (all in `server.json`)

| Field | Value |
|---|---|
| name | `ai.usecloudy/cloudy` |
| title | `Cloudy` |
| description (max 100 characters) | `Publish pages to a stable link, then read, reply to and resolve the comments people leave on them.` (98 characters, same as the monorepo's) |
| websiteUrl | `https://usecloudy.ai/docs/mcp` (returns 200) |
| icons | `https://usecloudy.ai/icon.png`, 512×512 PNG, already live |
| remotes | `streamable-http`, `https://mcp.cloudtifact.com/mcp` (returns 401 and starts OAuth, as it should) |
| repository | left out on purpose: the server's code is in the private monorepo. |

Art: none beyond the icon URL, which already exists.

### Validation

```
$ mcp-publisher validate      # mcp-publisher 1.8.8, in registries/
Validating against https://registry.modelcontextprotocol.io...
✅ server.json is valid
```

The after-move version (`mcp.usecloudy.ai`, `0.1.1`) also validates.

### Monorepo follow-up (for the lead, not done here)

Copy this `server.json` over `apps/mcp/server.json`. Then change the "Listing in the official MCP Registry" section of `apps/mcp/README.md`: `cloudtifact.com` becomes `usecloudy.ai`, and `com.cloudtifact/cloudtifact` becomes `ai.usecloudy/cloudy`.

---

## 2. Glama (glama.ai/mcp/connectors)

Glama calls itself "a superset of the official MCP Registry" (https://glama.ai/llms.txt). Remote servers from the registry show up as connectors under the same name, for example https://glama.ai/mcp/connectors/com.idle9/idle9. **Don't add Cloudy by hand.** Wait until it appears at `https://glama.ai/mcp/connectors/ai.usecloudy/cloudy` after step 1. If it hasn't appeared after a few days, use "Add Server" on https://glama.ai/mcp/connectors/add.

Claim it (John signs in to Glama; the account is free):
1. Open the listing, choose **Claim ownership**, sign in.
2. Copy the `glama_claim_…` token, then pick one of these:
   - HTTP: serve `{"$schema":"https://glama.ai/mcp/schemas/connector.json","claim":"glama_claim_…"}` at `https://usecloudy.ai/.well-known/glama.json`. Verifying the domain covers every registry listing in the `ai.usecloudy` namespace (schema: https://glama.ai/mcp/schemas/connector.json).
   - DNS: a TXT record at `_glama-claim.usecloudy.ai`, or at `_glama-claim.<mcp host>`. Glama shows the exact value.
3. Leave the file or record in place. Glama checks it again from time to time.

Once claimed, fill in Glama's publisher questions: privacy `https://usecloudy.ai/privacy`, docs `https://usecloudy.ai/docs/mcp`, support `support@usecloudy.ai`, website `https://usecloudy.ai`, auth `OAuth 2.1 (no API key)`.

Glama also tests the connector and scores how well its tools are described. A failed sign-in shows as "unhealthy".

---

## 3. mcp.so

Form: https://mcp.so/submit. Submission types are MCP Server, Remote Server, MCP Client and AI Product. Sign in with GitHub or Google.

| Field | Value |
|---|---|
| Type | Remote Server |
| Name | Cloudy |
| Repository URL (required) | `https://github.com/Cloudtifact/plugins` (public) |
| Server URL / config, if the form asks | `https://mcp.cloudtifact.com/mcp`, Streamable HTTP, OAuth, no API key |
| Description | `Publish pages to a stable link, then read, reply to and resolve the comments people leave on them.` |

Free submissions are reviewed, and the page doesn't say how long that takes. The optional **$39 one-time fee** publishes straight away and adds a "Verified" badge, priority placement and a dofollow link. John decides; the free route is the default.

Art: none required. It will probably use the repo's or website's icon.

---

## 4. PulseMCP

https://www.pulsemcp.com/submit says: "We are not accepting new MCP server or client submissions right now". It also advises publishing to the official MCP Registry first, and says "we will pick it up automatically once we are back." **Nothing to do** beyond step 1. Check the page again later.

---

## 5. Smithery

The banner on https://smithery.ai says: "On October 31, 2026, we're shutting down Smithery's connection management services. Smithery will remain as a public (non-proxied) MCP registry". It is now "powered by Arcade.dev", with "a curated set of verified servers". The CLI, accounts and API are gone, and `smithery.ai/new` returns 404 (all checked today). **There is no self-serve listing.** The only route is to email the cofounder, the address given on that page (`ani [at] smithery [dot] ai`), and ask to be added as a verified server with the direct URL. That's optional and low value now.

---

## 6. skills.sh (`npx skills add`)

skills.sh lists and ranks skills from the anonymous install counts the `skills` CLI reports (https://skills.sh/docs). That only works for repos GitHub confirms are public (`docs/troubleshooting.md` in https://github.com/vercel-labs/skills). **There is no form.** A skill shows up once people install it.

The repo already works with it. The CLI reads `.claude-plugin/marketplace.json`, finds `plugins/cloudy/skills/cloudtifact/SKILL.md`, and `Cloudtifact/plugins` is public:

```
$ DISABLE_TELEMETRY=1 npx skills@1.7.6 add ~/Documents/cloudy-plugins --list
◇  Found 1 skill
│    cloudtifact
│      Use when the user wants a page, report, dashboard, prototype or any other HTML ...
```

The install line to put in docs and the README, which also seeds the listing:

```sh
npx skills add Cloudtifact/plugins --skill cloudtifact
```

Notes:
- This needs `cloudy-every-harness` merged to `main`, because the CLI reads the default branch. Until then it still finds the skill under the old `plugins/cloudtifact/` path.
- The skill's name stays `cloudtifact`, so the listing is `Cloudtifact/plugins/cloudtifact`. That keeps the old brand in the URL until the repo is renamed. A GitHub repo rename (for example to `usecloudy/plugins`) redirects, but the skills.sh page is keyed on owner/repo.
- The copy in the repo is a snapshot written by `cloudy skill install`. Resync it when the CLI's skill changes, or `npx skills add` users get an old version.

---

## When the MCP address moves to `mcp.usecloudy.ai`

| Registry | What changes |
|---|---|
| Official MCP Registry | Edit `remotes[0].url` in `server.json`, bump `version` (for example `0.1.1`), then `mcp-publisher publish`. The name `ai.usecloudy/cloudy` and the DNS proof stay the same. Old versions can't be edited. Optionally mark them with `mcp-publisher status --status deprecated --message "Moved to mcp.usecloudy.ai" ai.usecloudy/cloudy 0.1.0`. Keep `mcp.cloudtifact.com` answering (or redirecting) for a while, because clients may have stored the old URL. |
| Glama | Glama picks up the new version from the registry. **A claim can't move to a new hostname.** If you claimed with a host-level DNS record (`_glama-claim.mcp.cloudtifact.com`) or a `glama.json` on that origin, claim again for `mcp.usecloudy.ai`. A domain claim on `usecloudy.ai` covers the whole `ai.usecloudy` namespace, which is the reason to prefer it. |
| mcp.so | Edit the listing's server URL by hand, while signed in. |
| PulseMCP | Nothing, if it is reading the registry by then. |
| Smithery | Nothing, since Cloudy isn't listed there. |
| skills.sh | Nothing. The skill goes through the CLI, not the MCP address. |
| Monorepo | `apps/mcp/server.json` and README, `apps/landing/content/docs/mcp.mdx`, and the `remotes` URL in every harness package in this repo. |

## What John must do or agree to

1. Add one TXT record on `usecloudy.ai` (or one file under `/.well-known/`), and keep the Ed25519 private key safe.
2. Run `mcp-publisher login dns` and then `publish`. By publishing he accepts the registry's terms, linked from the registry site.
3. Glama: sign up (free) and claim the listing with `/.well-known/glama.json` on usecloudy.ai.
4. mcp.so: sign in and submit the form. Decide whether to pay the $39 to skip review (not needed).
5. Smithery and PulseMCP: nothing to do.

## Sources

- https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx
- https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/remote-servers.mdx
- https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/faq.mdx
- https://github.com/modelcontextprotocol/registry/blob/main/internal/api/handlers/v0/auth/dns.go
- https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json
- https://registry.modelcontextprotocol.io/v0.1/servers?search=cloudtifact (0 results)
- https://glama.ai/llms.txt, https://glama.ai/mcp/schemas/connector.json, https://glama.ai/mcp/connectors/com.idle9/idle9
- https://mcp.so/submit
- https://www.pulsemcp.com/submit
- https://smithery.ai (shutdown banner), https://smithery.ai/future
- https://skills.sh/docs, https://github.com/vercel-labs/skills (docs/creating-skills.md, docs/troubleshooting.md)
