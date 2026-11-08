# Submitting Cloudy to DeepSeek (task t0279)

Researched 2026-11-08 from DeepSeek's own docs and repo (deepseek-ai/deepseek-harness at `fcc0ad4`, 2026-11-04).

## What DeepSeek offers

| Surface | Plugins? | Source |
|---|---|---|
| **DeepSeek Harness (`dsh`)**, DeepSeek's open-source agent (desktop app for macOS/Windows, `npx @deepseek-ai/dsh web`, CLI). Public preview, MIT. | Yes. Everything is a Cordis plugin; third parties ship **bundles**: npm packages with `dsh.bundle` + `cordis.patch.yml`. | https://www.deepseek.com/en/harness/ , https://github.com/deepseek-ai/deepseek-harness , `docs/user/develop/basic/publish.md` |
| DeepSeek chat app (chat.deepseek.com and mobile) | No plugin, MCP or connector store found. | Searched; only third-party browser extensions |
| DeepSeek API | Model API with tool calls you define yourself. No hosted tool/plugin registry. | https://api-docs.deepseek.com/ |

**No official store.** DeepSeek says so itself: "No official market exists, and one may be added later" (`.agents/notes/implemented/feature/2026-10-02-plugin-market-index-format.md`). The repo takes no outside PRs (`CONTRIBUTING.md`).

How people find plugins today:

1. **Add plugin by name.** Plugins page, **Add plugin**, enter an npm name (or `dsh plugin --profile <p> add <name>`). Any npm package with `dsh.bundle` works. No review, no account with DeepSeek.
2. **GitHub topic `dsh-plugin`.** DeepSeek's README and CONTRIBUTING ask plugin authors to tag their repo with it. DeepSeek's site links "Community plugins" to https://github.com/topics/dsh-plugin .
3. **Discover tab (experimental).** Plugins, Experimental plugins, turn on **Custom plugin indexes**. "DSH ships no index source": the user pastes an index URL. Indexes are JSON files (format 1) anyone hosts (`docs/user/guide/plugin-market.md`). Community indexes crawl the npm keyword `dsh-plugin` and the GitHub topic, so a correctly tagged npm package shows up in them without asking. The biggest one, **DSH Open Plugin Market** (https://dshopen.org, repo polang233/dsh-plugin-index), also takes submissions through an issue form.

## What's built

`deepseek/` is an npm package, `dsh-plugin-cloudy` 0.3.3. It is a dsh bundle with one plain-JS Cordis plugin (no build step, no dependencies) that registers the `cloudtifact` skill on `ctx.skills`. The skill drives the `cloudy` CLI.

- **No MCP in this package.** dsh's MCP client has **no OAuth**: "a server answering with an authorization challenge surfaces as an ordinary connection failure … no interactive sign-in" (`packages/mcp/mcp-manager/README.md`, Limits). Our MCP server only takes OAuth tokens (`apps/mcp/src/index.ts` unwraps OAuth tokens and rejects anything else), so it can't connect from dsh today. The address `https://mcp.cloudtifact.com/mcp` (which may move to `mcp.usecloudy.ai`) appears nowhere in this package, so nothing here changes if it moves. When dsh adds OAuth (it reserves a `needs-auth` state for it), add `ctx.mcpManager.register('cloudy', { url: MCP_URL, ... })` in `index.js` with the URL as one constant.
- **The skill is a copy** of `plugins/cloudy/skills/cloudtifact/SKILL.md`, because an npm package can't reach outside its folder. **Resync it on every CLI release:** run `npm run sync-skill` in `deepseek/`, bump `version`, then publish. The bundled copy has the lowest priority (rank 600). A copy from `cloudy skill install` in `~/.agents/skills` (rank 500) wins, so CLI users always get the CLI's version.
- `market/index.json` + `market/icon.png`: a one-plugin format-1 index, in case we want to host our own Discover source (optional).

## Validation (done)

Run with dsh 0.2.1-rc.5 installed on this Mac, against a scratch `DSH_HOME=/tmp/t0279-deepseek/home` (the real `~/.dsh` was not touched):

```
npm pack ~/Documents/cloudy-plugins/deepseek            # 8 files, 38.6 kB
dsh plugin --profile cloudytest2 add /tmp/t0279-deepseek/dsh-plugin-cloudy-0.3.3.tgz
  -> Done; profile package.json bundles: ["@deepseek-ai/dsh-base", "dsh-plugin-cloudy"]
dsh --profile cloudytest2 --dump-config
  -> # == dsh-plugin-cloudy
     - id: cloudy
       name: dsh-plugin-cloudy
node /tmp/t0279-deepseek/scripts/load-test.mjs <installed>/index.js
  (real @deepseek-ai/cordis 4.0.5 + @deepseek-ai/dsh-skill registry from the dsh install)
  -> snapshot lists "cloudtifact" (source bundled, provider cloudy, modelInvocable+userInvocable)
  -> loaded body chars: 17233
dsh plugin --profile cloudytest2 remove dsh-plugin-cloudy   -> removed cleanly
node /tmp/t0279-deepseek/scripts/validate-index.mjs market/index.json https://usecloudy.ai/dsh/index.json
  (dsh's own parseMarketIndex from @deepseek-ai/dsh-plugin-market-index)
  -> OK: dsh-plugin-cloudy@0.3.3 icon=https://usecloudy.ai/dsh/icon.png
  (a broken index is rejected: "$.plugins[0].name must be a valid npm package name")
```

Not done: a full boot of the web UI with the plugin (`dsh --profile webtest` started but never opened a port in this sandbox). Before publishing, John should install it once in the real desktop app and ask "publish this HTML file with Cloudy".

## Steps to list it

1. **Publish to npm** (needs John; the lead doesn't publish). From `deepseek/`: `npm run sync-skill`, then `npm publish` while logged in as the npm account that owns `usecloudy` (`cloudtifact <cloudtifacthq@gmail.com>`). The name `dsh-plugin-cloudy` was free on 2026-11-08. The `dsh-plugin` keyword is already in `package.json`, and community indexes crawl it. (Alternative: a scoped name like `@usecloudy/dsh-plugin`, if we create an npm org. Then change `name` in `package.json`, `cordis.patch.yml`, `market/index.json` and README.)
2. **Tag the GitHub repo:** `gh repo edit Cloudtifact/plugins --add-topic dsh-plugin` (the convention DeepSeek's README asks for). Optional: `--add-topic deepseek-harness`.
3. **DSH Open Plugin Market** (optional, faster than waiting for its crawler): open https://github.com/polang233/dsh-plugin-index/issues/new?template=plugin-add.yml and fill in:
   - **插件地址 / Plugin link:** `dsh-plugin-cloudy`
   - **简短说明 / Summary:** `Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them.`
   - **插件实际效果 / Plugin screenshots** (optional, 1 to 6 real screenshots in use, each with a one-line caption; no logos, frames or ads; hide keys and personal info): e.g. dsh chat publishing a page and returning a link; a page with comments; the agent replying to and resolving comments.
   - **补充信息 / Additional details:** `Tested with dsh 0.2.1-rc.5 on macOS. Needs the Cloudy CLI (npm i -g usecloudy, Node 20+); first use opens a browser sign-in. Icon: https://raw.githubusercontent.com/Cloudtifact/plugins/main/deepseek/icon.png`
   This needs a GitHub account (the Cloudtifact org or John). There's no fee and no agreement to sign.
4. **Optional, our own index:** host `market/index.json` and `market/icon.png` side by side (e.g. `https://usecloudy.ai/dsh/index.json`). Set `publishTimestamp` to the real npm publish time (Unix seconds; the current `1794268800` is a placeholder) and re-run the validator above. The docs page can then say: turn on Custom plugin indexes, add this URL.
5. **Update to the shared README/docs** (lead): add a "DeepSeek Harness" line: `dsh plugin --profile desktop add dsh-plugin-cloudy`.

## Listing fields

Shown on the Plugins page and in indexes. They come from the package itself (`package.json`, `locale/en.json`, `icon.png`, README).

| Field | Value |
|---|---|
| npm name | `dsh-plugin-cloudy` |
| Title (`locale/en.json` meta.title) | Cloudy |
| Description | Publish HTML pages and docs to a stable link, then read, fix, reply to and resolve the comments people leave on them. |
| Author | Cloudy <support@usecloudy.ai> (https://usecloudy.ai) |
| Homepage | https://usecloudy.ai |
| Repository | https://github.com/Cloudtifact/plugins, directory `deepseek` |
| Version | 0.3.3 |
| `engines.dsh` | `>=0.2.1-rc.0 <0.3.0` (widen when dsh 0.3 ships; dsh refuses install outside this range) |
| Keywords | dsh, dsh-plugin, deepseek-harness, cloudy, skill, publish, html, comments, docs |
| License | MIT |
| Tagline | none used. If a market asks for one: DRAFT (John writes this) |

Other languages: dsh shows `locale/<lang>.json` when present. Only English ships. A `zh.json` would help, since most of dsh's community is Chinese (DRAFT, John or a translator writes it).

## Art

- Icon: `icon.png` = `assets/icon-128.png` (128x128 PNG, 27.7 kB). The limits are 256 KiB in the package and 32 KiB to inline in an index, so it fits both. An SVG would be sharper if one exists. No other sizes are needed.
- Screenshots: optional, only for dshopen.org (1 to 6 real in-app screenshots, any size). The lead makes them.
- Plugin detail page: dsh renders the README. A `meta.detail` or SVG previews are optional (`docs/cookbook/adding-a-plugin-preview.md`, max 5 MiB each).

## What John must click, sign or agree to

- npm: publish as the account that owns `usecloudy`. He has already agreed to npm's terms.
- GitHub: add a topic to Cloudtifact/plugins, and optionally file one issue on polang233/dsh-plugin-index.
- DeepSeek: nothing. There is no account, portal, review, fee or agreement.

## Blockers and caveats

- No MCP until dsh's MCP client supports OAuth (see above).
- dsh is pre-1.0 (0.2.x) and its APIs "are still evolving". The plugin uses only `ctx.skills.registerProvider` and the bundle manifest, both documented. Re-test when dsh releases 0.3 and widen `engines.dsh`.
- Community indexes are third-party. Inclusion and display are up to their maintainers.
