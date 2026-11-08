# Submitting Cloudy to pi

## Where it's listed

- **Gallery:** https://pi.dev/packages. There's no form, review or fee. It lists npm packages that have the `pi-package` keyword: "The `pi-package` keyword makes an npm package eligible for discovery in the Pi package gallery. Optional `pi.image` and `pi.video` fields add gallery previews." (pi docs, `docs/packages.md` in `@earendil-works/pi-coding-agent` 1.5.0, also at https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md)
- Each gallery card shows the npm name, `description`, publisher, monthly downloads, type (extension/skill/prompt/package), npm and repo links and `pi install npm:<name>`. It has a "report" link that opens a `package-report` issue on github.com/earendil-works/pi; that's the only moderation.
- Users install with `pi install npm:pi-cloudy`. A `git:` install isn't offered: pi treats the repo root as the package, and this package lives in the `pi/` subfolder.
- Note: pi moved from `@mariozechner/pi-coding-agent` (deprecated) to `@earendil-works/pi-coding-agent`. Pi now has built-in MCP (remote HTTP + OAuth, `docs/mcp.md`), so this package registers Cloudy's MCP server as well as shipping the skill.

## Name

`pi-cloudy` is free on npm (checked 2026-11-08 with `npm view pi-cloudy`: 404). `@usecloudy/pi` is also free, but needs an npm org called `usecloudy` first; `usecloudy` the CLI is owned by the npm user `cloudtifact`. Unscoped `pi-cloudy` matches gallery convention (`pi-mcp-adapter`, etc.). To use the scoped name instead, change `name` in package.json and the install lines in README.md.

## Steps (John)

1. Merge this folder to `main` of github.com/Cloudtifact/plugins first, so `pi.image` (`https://raw.githubusercontent.com/Cloudtifact/plugins/main/assets/icon-512.png`) resolves.
2. Log in to npm as the account that owns `usecloudy` (`cloudtifact`, cloudtifacthq@gmail.com): `npm login`.
3. From the repo root:
   ```
   cd pi
   npm publish --access public
   ```
   `prepack` runs `scripts/sync.mjs`, which copies the skill from `../plugins/cloudy/skills/cloudtifact` and the commands from `../plugins/cloudy/commands` (renamed `cloudy-*.md`) into the package. Commit what it changed.
4. Check: `pi install npm:pi-cloudy`, then in pi `/mcp login cloudy`, `/cloudy-status`.
5. The gallery picks it up from npm by itself. Nothing to sign or agree to beyond npm's terms.

## Validation (2026-11-08)

- `npm i -g --prefix /tmp/t0279-pi/prefix @earendil-works/pi-coding-agent` (pi 1.5.0), then with `HOME=/tmp/t0279-pi/home`: `pi install /Users/johndotowl/Documents/cloudy-plugins/pi` -> `Installed ...`; `pi --mode rpc --offline` + `{"type":"get_commands"}` lists `cloudy-comments`, `cloudy-publish`, `cloudy-status` (prompt) and `skill:cloudtifact` (skill), no extension errors, and pi warns `cloudy: needs sign-in` (the extension registered the server and got the OAuth 401).
- `npm pack --dry-run`: `pi-cloudy-0.3.3.tgz`, 8 files, 9.4 kB. The packed tarball, extracted and installed in a fresh HOME, gives the same commands.

## Fields (package.json, already filled in)

| Field | Value |
|---|---|
| name | `pi-cloudy` |
| version | `0.3.3` (same as the skill) |
| description | `Publish pages to a stable Cloudy link, then read, fix, reply to and resolve the comments people leave on them.` DRAFT (John writes this) — it's the gallery card text |
| keywords | `pi-package`, pi, cloudy, mcp, skill, publish, comments |
| homepage | https://usecloudy.ai |
| repository | github.com/Cloudtifact/plugins, directory `pi` |
| author | Cloudy <support@usecloudy.ai> |
| license | MIT |
| pi.extensions / skills / prompts | `./extensions/cloudy.ts`, `./skills`, `./prompts/*.md` |
| pi.image | icon-512.png URL above |

## Art

- `pi.image`: any image URL; no size is documented. The 512×512 `assets/icon-512.png` is used. Optional: a wider screenshot or a short `pi.video` (mp4 URL; e.g. `pi-mcp-adapter` uses a raw GitHub mp4) of publishing and resolving a comment would show better on the card. The lead decides; nothing else is required.

## Keeping it up to date

- The skill and prompts are **copies** (npm can't reference files outside the package). They're refreshed from `plugins/cloudy/` on every `npm pack`/`npm publish`; bump `version` and add a `CHANGELOG.md` entry (pi shows it to users after an update) whenever the CLI's skill changes.

## MCP address

The server URL is in one place: `CLOUDY_MCP_URL` in `extensions/cloudy.ts` (`https://mcp.cloudtifact.com/mcp`). If it moves to `mcp.usecloudy.ai`, change that line, update the host in README.md's "What data it sends", bump the version and republish. Pi stores sign-ins per server name and URL, so users sign in once more after the move.

## Blockers

- None for publishing. Needs the npm login for the account that owns `usecloudy`, and the folder merged to `main` for the image URL.
