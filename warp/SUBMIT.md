# Warp: how Cloudy gets listed

Checked 2026-11-08 against Warp's docs source (github.com/warpdotdev/docs, published at docs.warp.dev) and the open-source Warp client (github.com/warpdotdev/warp).

## Short answer

Warp has **no plugin, MCP or skill store** that a third party can submit to.

- **MCP servers** are added by the user: pasted into Settings > Agents > MCP servers > + Add, or put in `~/.warp/.mcp.json` / `.warp/.mcp.json`. Warp also reads Claude Code's, Codex's and `~/.agents/.mcp.json` configs. Source: https://docs.warp.dev/agents/capabilities/mcp/ (repo file `src/content/docs/agents/capabilities/mcp.mdx`).
- Warp does ship "out-of-the-box MCP servers" in the **Shared** section of MCP settings. They come from Warp's servers (`CloudTemplatableMCPServer` in `app/src/ai/mcp/templatable_manager.rs`), are picked by Warp, and have no public way to apply. The only route is asking Warp (see step 3).
- **Skills** are files (`SKILL.md` in `~/.agents/skills/`, `~/.warp/skills/`, `.claude/skills/` and others). Warp doesn't have a registry. `cloudy skill install` already writes `~/.agents/skills/cloudtifact/SKILL.md`, which Warp reads. Source: https://docs.warp.dev/agents/capabilities/skills/ (`skills.mdx`).
- There's **no "Add to Warp" link for MCP servers**. The documented `warp://` links open settings, Drive objects, tabs and actions, but none of them install a server. `warp://settings/mcp` opens the MCP settings page and is the closest there is.

There are two community listings that take pull requests. Neither one is a plugin store:

| Listing | What it lists | Takes PRs? | Live? |
|---|---|---|---|
| github.com/warpdotdev/workflows (`specs/`) | YAML command workflows, shown in Warp's Command Search as global workflows | README says yes. But no community workflow has been merged since Sept 2023 (#166), and 16 PRs are open, some from 2026. | commands.dev, the public site, now returns 404 |
| github.com/warpdotdev/do-things (dothings.warp.dev) | Links to shared Warp Drive objects (Prompt, Workflow, Notebook, Folder) | README says the Warp team reviews them. The last community content merged in May 2025 (#11). | Site is up (200) |

Neither one has fees, a signed agreement, art or a review SLA.

## What's built here

- `mcp.json`: the Warp `mcpServers` snippet. **This is the only place the MCP address appears in this folder** (README links to the file and doesn't repeat it).
- `workflows/*.yaml`: four workflows in the warpdotdev/workflows format (publish, comments, reply+resolve, install+login+skill).
- `README.md`: local install and what data it sends.

The skill isn't copied. Warp reads the copy `cloudy skill install` writes, so there's nothing to resync.

## MCP address note

The MCP address may move from `https://mcp.cloudtifact.com/mcp` to `https://mcp.usecloudy.ai/mcp`, which another thread is working on. If it moves, change the one `url` line in `warp/mcp.json`. Anything submitted elsewhere (a do-things Drive object, an email to Warp) has to use the final address, so wait for the move first.

## Steps (all optional, in order of value)

### 1. PR to warpdotdev/workflows (low odds of merge)

1. Fork https://github.com/warpdotdev/workflows.
2. Copy `warp/workflows/*.yaml` to `specs/cloudy/` in the fork.
3. Run `cargo build` (this is the CI check, see "Validation" below), then `cargo fmt` and `cargo clippy -- -A warnings`.
4. Open a PR using their template:
   - **Discord username (optional):** leave blank, or John's.
   - **Description of changes:** `New workflows for the Cloudy CLI (npm: usecloudy): publish an HTML page and get a link, print open comments for an agent, reply to and resolve a comment, and install + sign in + add the agent skill.`
5. John signs nothing. `.github/` holds only the issue and PR templates and the `ci.yaml` and `publish.yaml` workflows. There's no CLA.

Blocker: it looks unmaintained for content PRs (see the table above), and commands.dev is gone. The workflows still show up in Warp's global Command Search if it's merged.

### 2. do-things entry (needs a Warp account)

1. John signs in to Warp. Making an account is his call, so I didn't do it.
2. In Warp Drive, create a **Prompt** object. Suggested title: `Publish this page with Cloudy and work through its comments`. Body:
   `Publish {{file}} with Cloudy (cloudy publish {{file}}; install with npm i -g usecloudy if missing) and give me the link. Then run cloudy comments, fix what each open comment asks for, reply to it and resolve it.`
3. Under Share, set "Anyone with the link" to "Can view", then copy the link.
4. Fork https://github.com/warpdotdev/do-things, copy `public/objects/duplicate-me.yaml` to `public/objects/cloudy-publish-and-comments.yaml`, and fill it in:
   - `title`: `Publish a page with Cloudy and work through its comments`
   - `description`: `Publishes an HTML page to a private Cloudy link, then reads, fixes, replies to and resolves the comments people leave on it.`
   - `type`: `Prompt`
   - `link`: the Drive share link from step 3
   - `author`: John's GitHub username
   - `date_added`: the day of the PR
   - `tags`: `publishing`, `docs`, `feedback`
5. Open the PR.

### 3. Ask Warp to add Cloudy to the built-in Shared MCP list

There's no form for this. John can email Warp or post in their Discord or a GitHub discussion and ask, giving the MCP URL (from `mcp.json`), the docs (https://usecloudy.ai/docs/mcp), and the fact that sign-in is OAuth with no API key. A PR to warpdotdev/docs that adds a "Cloudy" tab under "MCP server configuration examples" in `mcp.mdx` is another option. They'd have to want it.

## Art

None of these routes take icons, banners or screenshots. Nothing to make.

## Validation

1. Workflows, with the repo's own CI build (it deserializes every spec into `warp_workflows_types::Workflow`):
   ```
   git clone --depth 1 https://github.com/warpdotdev/workflows /tmp/t0279-warp/wf-repo
   mkdir -p /tmp/t0279-warp/wf-repo/specs/cloudy && cp warp/workflows/*.yaml /tmp/t0279-warp/wf-repo/specs/cloudy/
   cd /tmp/t0279-warp/wf-repo && cargo build
   ```
   Result: `Finished 'dev' profile ... in 4m 17s`, exit 0. It generated `cloudy_comments.rs`, `cloudy_install.rs`, `cloudy_publish.rs` and `cloudy_reply_and_resolve.rs`, and all four parsed with the fields as written. Not run: their `typos` CI step (crate-ci/typos) and the `build_ts` publish step, which only runs after a merge.
2. `mcp.json`: checked by script against the properties in Warp's docs (each server has `url` [+ `headers`] or `command`/`args`/`env`/`working_directory`). Passed. Warp publishes no JSON Schema for this file.
3. Not loaded in the Warp app, because Warp isn't installed on this Mac. The OAuth path should work: Warp's client (`crates/mcp/src/oauth.rs`) does dynamic client registration with a custom-scheme or loopback redirect, and our server accepts both. Still, someone should try it once in Warp.
