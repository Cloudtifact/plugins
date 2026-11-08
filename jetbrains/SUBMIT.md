# Submitting Cloudy to JetBrains

Researched 2026-11-08 from the official docs listed at the bottom.

## What JetBrains has, and what fits

| Surface | Third-party listing? | Fits Cloudy? |
|---|---|---|
| **Junie extensions** (Junie CLI `/extensions`, also called `/plugins`) | Yes. The built-in marketplace is the GitHub repo `JetBrains/junie-extensions`, and you get in by opening a PR. Users can also add any git repo, local folder or `marketplace.json` URL as their own marketplace, in either Junie's format or the Claude plugin format. | **Yes. This is the package in this folder.** |
| Junie MCP Installation Assistant (`/mcp` → Ctrl+A) | No form of its own. When a server isn't in its preconfigured list, it "searches the official MCP registry". | Indirect. Being listed in the official MCP registry (another harness's task) makes Cloudy findable here. |
| AI Assistant MCP settings | No catalog. You add servers by JSON, or import them from Claude Desktop, and admins can preconfigure them. | Manual setup only (see README). |
| ACP Agent Registry (`agentclientprotocol/registry`, shown in JetBrains IDEs and Zed) | Yes, but only for **agents** that speak ACP and support authentication. | No. Cloudy is a tool, not a coding agent. |
| JetBrains Marketplace (IntelliJ plugins) | Yes, for code plugins (Kotlin/Java, signed, with vendor review). | Out of scope. It isn't the only path, and it isn't small. |

## Package

```
jetbrains/
  .junie-extension/marketplace.json   # makes jetbrains/ a Junie marketplace (local or URL)
  cloudy/
    extension.json                    # name + description (native format)
    mcp/.mcp.json                     # the remote MCP server: the ONLY place the URL lives
    skills/cloudtifact/SKILL.md       # COPY of plugins/cloudy/skills/cloudtifact/SKILL.md
    README.md
    LICENSE                           # MIT, copy of repo root LICENSE
```

- **Skill copy:** an extension must hold its skills inside its own folder, so `SKILL.md` is a copy. Copy it again whenever the CLI updates the skill (`cp plugins/cloudy/skills/cloudtifact/SKILL.md jetbrains/cloudy/skills/cloudtifact/`).
- **Commands:** I left out the `/publish`, `/comments` and `/status` commands. The JetBrains repo's README lists only `skills/`, `agents/`, `guidelines/` and `mcp/` for native extensions, and the skill is already invocable as `/cloudtifact`. The Claude-format route (below) does include the commands.
- **MCP domain:** the address may move to `mcp.usecloudy.ai`. If it does, change the one line in `cloudy/mcp/.mcp.json` and the two JSON snippets in `cloudy/README.md`, then update the copy in the JetBrains PR.

## Route A: PR to the built-in JetBrains marketplace

Repo: https://github.com/JetBrains/junie-extensions. It's curated, has no CONTRIBUTING file, no form, no fee and no stated requirements. Every merged PR so far is from a JetBrains maintainer (nikitaBarkov). Third-party PRs are open and unreviewed: #14 Trackly SMS (a remote OAuth MCP server, the closest match to Cloudy), #18 MrScraper, #19 dodopayments and #20 Totem. Expect a wait, and possibly a no.

Steps (for John or the lead):
1. Fork `JetBrains/junie-extensions` as the Cloudtifact org (or John).
2. Copy `jetbrains/cloudy/` to `extensions/cloudy/` in the fork.
3. Add this entry to the `extensions` array in `.junie-extension/marketplace.json`. The keys match the existing entries exactly. Note that `source` and `homepage` change relative to our local manifest:
   ```json
   {
     "name": "cloudy",
     "source": "./extensions/cloudy",
     "description": "Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.",
     "version": "0.3.3",
     "author": { "name": "Cloudy" },
     "category": "productivity",
     "homepage": "https://usecloudy.ai",
     "keywords": ["publish", "html", "comments", "review", "docs", "mcp"]
   }
   ```
   The existing categories are `language`, `framework`, `documentation`, `database` and `mobile`. `productivity` is new; use `documentation` if the reviewer asks.
4. Open the PR:
   - Title: `Add Cloudy extension`
   - Body (plain): "Cloudy publishes the HTML pages and docs an agent makes to a stable link. People comment on exact text, and the agent reads, fixes, replies to and resolves those comments. This adds a native extension following the Context7 layout: the hosted Streamable HTTP MCP server `https://mcp.cloudtifact.com/mcp` (OAuth 2.1 with PKCE, discovered from the 401, with dynamic client registration; no embedded credentials), plus one Agent Skills `SKILL.md`. No scripts, no install hooks. MIT licensed. Source: https://github.com/Cloudtifact/plugins. Docs: https://usecloudy.ai/docs/mcp. Privacy: https://usecloudy.ai/privacy. Support: support@usecloudy.ai."
   - Tagline (if one is wanted anywhere): `DRAFT (John writes this)`.
5. To sign or agree to: nothing beyond GitHub's terms. The repo has no CLA bot and no license file. Because JetBrains' README disclaims third-party extension contents, the bundled MIT LICENSE matters.

## Route B: our own marketplace (works today, no review)

Users add it themselves with `/extensions marketplace add <spec>`. Options, from least to most work:
- **Already works:** `/extensions marketplace add Cloudtifact/plugins`. Junie reads the root `.claude-plugin/marketplace.json` and installs `plugins/cloudy` (skill + commands, **no MCP server**).
- **URL to this folder's manifest (no change needed):** `/extensions marketplace add https://raw.githubusercontent.com/Cloudtifact/plugins/main/jetbrains/.junie-extension/marketplace.json`. Untested: I'm not sure Junie resolves `./cloudy` relative to a URL marketplace. The docs say URL sources are "HTTP-only, no clone". Test this after merge, and fall back to the next option if it fails.
- **Optional change outside this folder (the lead's call):** add a root `.junie-extension/marketplace.json` with `"source": "./jetbrains/cloudy"`. Then `/extensions marketplace add Cloudtifact/plugins` gives the native extension with MCP. Junie's docs don't say which manifest wins when the root has both formats, so test it first.

Docs line to add to usecloudy.ai/docs (lead or John): "Junie: run `/extensions marketplace add Cloudtifact/plugins`, then `/extensions install cloudy`."

## Art

None required. The Junie extension format has no icon or screenshot fields, and no listing page. If the JetBrains reviewer asks for one, the Totem PR used `assets/<name>.svg` inside the extension. We have no SVG, so the lead would need to make one.

## Blockers

- Route A: curated repo, no published acceptance criteria, and no third-party PR merged yet.
- Validation only covers our side. Junie CLI installs through `curl | bash` and needs a JetBrains account to run, so I didn't install it or load the extension in the real CLI. Before the PR, someone with a JetBrains AI account should run Route B locally and check that `/mcp` shows Cloudy as **Authorization required** → **Authorize** → **Active**.
- AI Assistant's MCP docs don't mention OAuth for remote servers. Whether its MCP client handles our OAuth sign-in is unverified. Junie's docs do cover OAuth.

## Validation run

```
python3 -I -m json.tool <each of the 3 JSON files>     -> OK (all three)
structure diff vs JetBrains' live marketplace.json      -> same top-level keys; entry keys missing: none, extra: none; source dir exists; extension.json name matches
uvx --from skills-ref agentskills validate jetbrains/cloudy/skills/cloudtifact
                                                        -> Valid skill: .../jetbrains/cloudy/skills/cloudtifact
curl -X POST https://mcp.cloudtifact.com/mcp            -> HTTP/2 401, www-authenticate: Bearer realm="OAuth", resource_metadata=".../.well-known/oauth-protected-resource/mcp"
```

## Sources

- Junie CLI extensions and marketplaces: https://junie.jetbrains.com/docs/junie-cli-extensions.html
- Junie skills: https://junie.jetbrains.com/docs/agent-skills.html
- Junie MCP (registry search, OAuth): https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html
- Junie custom commands: https://junie.jetbrains.com/docs/custom-slash-commands.html
- JetBrains marketplace repo: https://github.com/JetBrains/junie-extensions (README, `.junie-extension/marketplace.json`, `extensions/context7`, PRs #14 and #20)
- AI Assistant MCP (no catalog): https://www.jetbrains.com/help/ai-assistant/mcp.html
- ACP registry (agents only, auth required): https://agentclientprotocol.com/get-started/registry and https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/
