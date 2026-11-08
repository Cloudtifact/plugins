# Cloudy in every agent: where it can be listed

Checked 8 November 2026 against each harness's own docs. Every folder has a `SUBMIT.md` with the store URL, every field to paste, and what John clicks or signs. Nothing has been submitted or published.

The hosted MCP server is `https://mcp.cloudtifact.com/mcp` everywhere. When it moves to `mcp.usecloudy.ai`, run `scripts/set-mcp-url.sh https://mcp.usecloudy.ai/mcp` and revalidate. When the CLI's skill changes, run `packages/cli/scripts/sync-plugins.sh` (monorepo), then `scripts/sync-copies.sh` here.

| Harness | Has a store? | Built | How it gets listed | Blockers / what John does |
| --- | --- | --- | --- | --- |
| **Claude Code + claude.ai** | Yes: git marketplace (this repo, live) + Anthropic directory (reviewed) | `plugins/cloudy/` (skill, 3 commands, MCP). `claude plugin validate --profile directory --strict` passes | Live today: `/plugin install cloudy --marketplace Cloudtifact/plugins`. Directory: two forms at claude.ai/directory/manage (plugin + MCP connector) | Paid claude.ai account (Owner). Reviewer test account. Submit the connector only after `mcp.usecloudy.ai` is live (URL can't be changed later). See `claude/SUBMIT.md` |
| **Cursor** | Yes: Cursor Marketplace (curated, open source only) + cursor.directory (open) | Same `plugins/cloudy/` + `.cursor-plugin/`. Official schema valid; loads in `cursor-agent` | Form at cursor.com/marketplace/publish; paste repo URL at cursor.directory/plugins/new | Publisher terms say "will not charge Users any fees": John reads that against paid plans first. Sign-in untested in the app |
| **GitHub Copilot (CLI + VS Code)** | Yes: awesome-copilot (default marketplace), our own `.github/plugin/marketplace.json` | `copilot/cloudy/` (Agent Plugins 1.0). Schema valid, `vally lint` passes, installs in Copilot CLI 1.0.107 | Issue form on github/awesome-copilot; GitHub MCP Registry by email after the official registry listing | Needs a release tag + commit SHA on `main` |
| **VS Code Marketplace** | Yes | `vscode/` extension (MCP server + skill). `vsce package` builds; activates in VS Code 1.145 | Upload the `.vsix` at marketplace.visualstudio.com/manage. Same file goes to Open VSX (Cursor, Windsurf, VSCodium) | Publisher id `cloudy` is taken, so `usecloudy`. John creates the publisher (Microsoft account) |
| **Google Antigravity** | Yes: Plugin Marketplace (curated, launched 29 Oct) | `antigravity/cloudy/`. `agy plugin validate --strict` passes; installs | Partner interest form (forms.gle/2EX5RFYPoJe1UgxR9) | Google picks partners; no criteria or timeline |
| **Gemini CLI** | Yes: gallery that indexes GitHub repos with a topic | `gemini/`. `gemini extensions validate` passes; installs | Needs its own public repo `Cloudtifact/cloudy-gemini` (manifest must be at a repo root) with topic `gemini-cli-extension` | Free and Pro users moved to Antigravity in June; only paid/enterprise users left. Low priority |
| **pi** | Yes: pi.dev/packages lists npm packages with keyword `pi-package` | `pi/` npm package `pi-cloudy` (skill, 3 prompts, MCP). Installs and loads in pi 1.5.0 | `npm publish` from `pi/` | npm login for the account that owns `usecloudy` |
| **DeepSeek Harness** | Registry only: community indexes crawl npm keyword / GitHub topic `dsh-plugin` | `deepseek/` npm package `dsh-plugin-cloudy` (skill + CLI). Installs in dsh 0.2.1 | `npm publish`; add topic `dsh-plugin` to this repo; optional dshopen.org issue form | No MCP (dsh can't do OAuth yet). DeepSeek's chat app and API have no plugin store |
| **OpenCode** | Registry only: npm + the docs' ecosystem page (PR) | `opencode/` npm package `opencode-cloudy` (MCP, skill, 3 commands). Loads in OpenCode 2.2.6 | `npm publish`, then a PR to the ecosystem page | awesome-opencode needs 25 repo stars |
| **Kiro** | Yes: kiro.dev/powers (curated) | `kiro/` (Agent Plugins: MCP + skill). Official schemas valid; `kiro-cli powers install` works | Form at kiro.dev/powers/submit | Submitting accepts the Kiro Powers Publisher Terms (a contract with AWS) |
| **Devin / Windsurf** | Yes: Devin marketplace (PR to CognitionAI/devin-marketplace) | `windsurf/` (marketplace entry + Windsurf `mcp_config.json`). Their validator passes | PR adding `plugins/cloudy` | Opening the PR accepts their CLA; 114 PRs waiting |
| **Grok** | Yes: xai-org/plugin-marketplace (PR) | `grok/` (MCP, skill, commands) + root `.grok-plugin/marketplace.json`. `grok plugin validate` passes; installs | PR adding one entry pinned to a commit SHA | Folder must be on `main` first |
| **JetBrains (Junie)** | Yes: JetBrains/junie-extensions (curated repo) | `jetbrains/cloudy/` (MCP + skill). JSON matches theirs; skill validates | PR to JetBrains/junie-extensions | No outside PR merged there yet. AI Assistant has no catalog. Not run in Junie |
| **Raycast** | Yes: Raycast Store (PR to raycast/extensions) | `raycast/` extension: `@cloudy` AI tools (MCP) + Search Spaces + Publish HTML File. `ray lint` and `ray build` pass | `npm run publish` opens the PR | Needs 3-6 screenshots (2000x1250) taken in Raycast with a signed-in account; Raycast isn't installed on this Mac. `author` handle `cloudy` may not be ours. Reviewers need a demo account |
| **Cline** | Yes: MCP Marketplace (issue form, cline/mcp-marketplace) | `cline/` (llms-install.md, 400px logo). Loads in Cline CLI 3.0.74 | GitHub issue form | 3,239 submissions waiting; a manual sign-in test is a required checkbox |
| **Amp** | No store | `amp/` (MCP config, skill path). `amp mcp doctor` reaches sign-in | Optional PR to ampcode/amp-contrib (rarely merged) | None of the routes gets real review |
| **Goose** | No: closed its directory 30 Jul 2026, points to the official MCP Registry | `goose/` (registry entry, install link, recipe) + root `.goose-plugin/plugin.json` | Via the official MCP Registry | Goose doesn't read the registry yet |
| **Warp** | No store | `warp/` (MCP config, 4 workflows; built with their CI) | Optional PR to warpdotdev/workflows (inactive since 2023) | Nothing to list; users paste the MCP config |
| **Zed** | Extension registry, but no longer takes remote MCP servers | `zed/` (settings snippet only) | Via the official MCP Registry once Zed reads it | Zed is retiring MCP extensions; maintainers close `mcp-remote` wrappers |
| **Continue** | No: Continue Hub shut down after Cursor bought Continue (June 2026) | `continue/` (YAML blocks; validated with Continue's schema package) | Nowhere | Product no longer maintained |
| **Roo Code** | No: marketplace shut down 15 May 2026 | Nothing (`harnesses/roo.md`) | Nowhere | Repo archived |
| **Official MCP Registry** (read by Goose, Zed, Junie, Amp enterprise, GitHub) | Registry | `registries/server.json` as `ai.usecloudy/cloudy`. `mcp-publisher validate` passes | DNS TXT record on usecloudy.ai, then `mcp-publisher publish`. Glama copies it; mcp.so has a web form | Name can't change after first publish. PulseMCP closed; Smithery stopped sign-ups |
| ChatGPT / Codex | Done by another thread (t0278) | | | |

Not checked as separate harnesses: Devin's own agent and Windsurf editor plugins are covered by the Devin row; OpenAI is another thread's.

## Follow-ups outside this repo

- `packages/cli/scripts/sync-plugins.sh` in the monorepo still writes to `plugins/cloudtifact/...`; change it to `plugins/cloudy/...` before the next CLI release, and have it run `scripts/sync-copies.sh`.
- `cloudy skill install` writes `~/.agents/skills` only if `~/.agents` exists, so Zed and Warp users can miss it.
- `apps/mcp/server.json`: replace with `registries/server.json` before the registry publish.
- Before listing: one real sign-in and publish from each of Cursor, Claude.ai, Raycast and Copilot. Nobody has signed in through the OAuth flow from those apps yet.
- `cursor/README.md` has a Cursor install link with the address base64-encoded; `set-mcp-url.sh` cannot change it, so regenerate it by hand.
