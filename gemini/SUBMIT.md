# Submitting Cloudy to the Gemini CLI extensions gallery

Researched 2026-11-08. Gemini CLI on npm: `@google/gemini-cli` 0.67.0 (published 2026-11-04).

## Is Gemini CLI still worth it?

Partly. Google moved individuals to Antigravity CLI:

- "Unpaid tier and Google One users: Gemini CLI was replaced by Antigravity CLI on June 18th, 2026." (banner on https://geminicli.com/docs/)
- Google's post: Gemini CLI stopped serving Google AI Pro, Ultra and free individual users on 2026-06-18. Access stays for organisations on Gemini Code Assist Standard or Enterprise, Code Assist for GitHub through Google Cloud, and anyone using a paid Gemini API key or Gemini Enterprise Agent Platform key. https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/
- So today's Gemini CLI users are mostly companies and people on paid API keys. That fits Cloudy's buyers (companies), but the user base is shrinking.
- Antigravity CLI can import Gemini CLI extensions (`agy plugin import gemini`, or a prompt the first time `agy` starts): skills carry over, commands become skills, and MCP servers move to `mcp_config.json`. https://antigravity.google/docs/cli/gcli-migration. So this package also gets Cloudy into Antigravity for anyone who migrates. The Antigravity plugin itself is a separate task.

## How listing works

Gallery: https://geminicli.com/extensions/ (about 2,200 extensions today).
Rules: https://geminicli.com/docs/extensions/releasing/

- No form, no review queue, no fee, no agreement to sign. "You don't need to submit an issue or email us to list your extension."
- The repo must be **public on GitHub** and have the **`gemini-cli-extension`** topic. A crawler indexes tagged repos daily and lists the ones that pass validation.
- **`gemini-extension.json` must be at the root of the repo** (or at the root of a GitHub Release archive).

### This folder can't be listed where it is

`Cloudtifact/plugins` has this extension in `gemini/`, not at the root. Gemini CLI can't install from a subfolder either. I checked the 0.67.0 source:
- A GitHub source must be exactly `owner/repo`. A `/tree/<branch>/gemini` URL throws "Expected "owner/repo" or a github repo uri".
- The repo is cloned and `gemini-extension.json` is read from its root.
- There is no `--path` flag. The install flags are `--ref`, `--auto-update`, `--pre-release`, `--consent` and `--skip-settings`.
- `contextFileName` may not contain `..`, so the manifest can't point at `../plugins/cloudy/...`. That's why the skill is copied here.

Options:

1. **Recommended: a separate public repo, `Cloudtifact/cloudy-gemini`**, holding this folder's contents at its root (not inside `gemini/`). Add the `gemini-cli-extension` topic. Install is `gemini extensions install https://github.com/Cloudtifact/cloudy-gemini`. Easy to keep in sync: copy `gemini/` there in the release script.
2. A GitHub Release on `Cloudtifact/plugins` with a `.tar.gz`/`.zip` asset whose root is this folder. Gemini CLI installs from the latest release, so this clashes with releases for other harnesses on the same repo. Not recommended.
3. Put `gemini-extension.json`, `GEMINI.md`, `commands/` and `skills/` at the root of `Cloudtifact/plugins`. That clutters the shared repo, and `npx skills add Cloudtifact/plugins` would then find a second copy of the skill. Not recommended.

## Steps (option 1)

1. Create the public repo `Cloudtifact/cloudy-gemini` (John or an org admin).
2. Copy everything in `gemini/` except this SUBMIT.md to the repo root, and commit.
3. Set the repo About fields:
   - Description: `Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.`
   - Website: `https://usecloudy.ai`
   - Topics: `gemini-cli-extension`, `mcp`, `gemini-cli`
4. Optional: tag a release `v0.3.3`. If there are no releases, installs clone the default branch.
5. Wait a day for the crawler, then search https://geminicli.com/extensions/ for "cloudy".

## Fields (all from the files, nothing to paste in a form)

| Gallery shows | Source | Value |
|---|---|---|
| Name | `gemini-extension.json` `name` | `cloudy` (lowercase letters, digits and dashes only) |
| Description | manifest `description` | Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them. |
| Owner/repo | GitHub | `@Cloudtifact/cloudy-gemini` |
| Icon | GitHub avatar of the **owner org** | the `Cloudtifact` org avatar |
| Badges | detected | MCP, Skills, Context, Commands |
| License | GitHub license detection | MIT (`LICENSE` is in the folder) |
| Stars | GitHub | — |

Tagline/marketing line: none needed. If one goes in the repo README: `DRAFT (John writes this)`.

## Art

No uploads. The card shows the GitHub org avatar, so set the `Cloudtifact` org avatar to `assets/icon-square-512.png` (full-bleed square; GitHub crops it to a circle in places, so leave the logo clear of the corners). No screenshots, banner or video are used.

## What John must click/sign/agree to

Nothing at Google. On GitHub: create the public repo and add the topic. Google shows users its own third-party warning when they install.

## MCP address note

The MCP address appears only in `gemini-extension.json` (`mcpServers.cloudy.httpUrl`, now `https://mcp.cloudtifact.com/mcp`). If it moves to `mcp.usecloudy.ai`, change that one line and bump `version`. Existing users get it with `gemini extensions update cloudy`, or automatically if they installed with `--auto-update`. Their saved OAuth token is per server URL, so they'll be asked to run `/mcp auth cloudy` again.

## Skill copy

`skills/cloudtifact/SKILL.md` is a copy of `plugins/cloudy/skills/cloudtifact/SKILL.md` (v0.3.3). Resync it whenever the CLI's skill changes. Gemini CLI won't follow `..` paths, and installs copy only the extension root. Keep the name `cloudtifact`, because the CLI writes that name.

## Validation (done)

Gemini CLI 0.67.0 in a throwaway HOME (`/tmp/t0279-gemini/home`):

```
$ gemini extensions validate /Users/johndotowl/Documents/cloudy-plugins/gemini
Extension /Users/johndotowl/Documents/cloudy-plugins/gemini has been successfully validated.

$ gemini extensions link <folder> --consent    -> Extension "cloudy" linked successfully and enabled.
$ gemini extensions list   -> cloudy (0.3.3); Context files: GEMINI.md; MCP servers: cloudy; Agent skills: cloudtifact
$ gemini mcp list          -> ✗ cloudy (from cloudy): https://mcp.cloudtifact.com/mcp (http) - Disconnected   (expected: not signed in)
$ gemini extensions install <folder> --consent -> installed successfully
```

The server answers 401 with `WWW-Authenticate: Bearer resource_metadata=...`, which is what Gemini CLI's automatic OAuth discovery needs (https://geminicli.com/docs/tools/mcp-server/). I didn't do the browser sign-in through `/mcp auth cloudy`, because Gemini CLI needs a Google sign-in or API key to run interactively. The TOML commands parse with `tomllib` (`description` and `prompt`).
