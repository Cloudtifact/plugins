# Submitting Cloudy to the Kiro powers registry

Researched 2026-11-08 from Kiro's own docs and pages:

- What powers are: https://kiro.dev/docs/powers/
- Format: https://kiro.dev/docs/powers/create/ (Agent Plugins format, https://agent-plugins.org/, spec https://github.com/agentplugins/agent-plugins-spec/blob/main/spec/1.0.0.md)
- Install: https://kiro.dev/docs/powers/installation/
- Remote MCP and OAuth in Kiro: https://kiro.dev/docs/mcp/configuration/
- Submission form: https://kiro.dev/powers/submit/
- Publisher terms: https://kiro.dev/powers/terms (last updated May 19, 2026)
- Registry: https://kiro.dev/powers (curated). The repo https://github.com/kirodotdev/powers holds only some of the powers, and its CONTRIBUTING.md sends submissions to the form above, not to PRs.

## How it works

- Today's format is **Agent Plugins**: `plugin.json` (required) plus optional `mcp.json` and `skills/`. The old `POWER.md` + `steering/` format still loads, but Kiro recommends the new one for new powers. This folder uses the new format.
- Agent Plugins v1 has only two component types, skills and MCP servers. The Claude-style commands (`publish`, `comments`, `status`) can't come along, so they're left out.
- Anyone can install a power from a public GitHub URL or a local folder without a listing. The registry at kiro.dev/powers is curated. You submit a public GitHub repo through a form, and Kiro reaches out "if your power is a good fit". There's no fee, no review time given, and no PR route.

## What's in this folder

```
kiro/
├── plugin.json                    manifest (name "cloudy", version 0.3.3, keywords)
├── mcp.json                       the remote MCP server (streamable-http, OAuth found from the 401)
├── skills/cloudtifact/SKILL.md    COPY of plugins/cloudy/skills/cloudtifact/SKILL.md
├── README.md                      install steps, what data it sends, privacy policy, support
└── SUBMIT.md                      this file
```

- **The skill is a copy.** Agent Plugins requires every file to be inside the plugin root, and Kiro rejects paths that resolve outside it, so a relative path or symlink to `../plugins/cloudy/...` won't work. Resync it whenever the CLI ships a new skill: `cp plugins/cloudy/skills/cloudtifact/SKILL.md kiro/skills/cloudtifact/SKILL.md`.
- **MCP address:** the only place it appears is `mcp.json` (`"url": "https://mcp.cloudtifact.com/mcp"`). If the server moves to `mcp.usecloudy.ai`, change that one line and bump `version` in `plugin.json`. The README points to `mcp.json` and doesn't repeat the address. Kiro matches the OAuth issuer exactly: the new host must report the same issuer in its protected-resource metadata (`authorization_servers`) and in its authorization-server metadata (`issuer`). Today both say `https://mcp.cloudtifact.com`, which matches.
- Kiro copies the whole folder into `~/.kiro/powers/installed/cloudy/`, including README.md and this SUBMIT.md. That does no harm, but SUBMIT.md could move to `harnesses/kiro-submit.md` if you'd rather not ship it.

## Requirements on the submit page, checked

| Requirement (kiro.dev/powers/submit) | Status |
|---|---|
| Complete, tested and working | Installs with `kiro-cli powers install` (below). Not yet tested in a signed-in chat: someone with a Kiro account should run it once (see "Before you submit"). |
| Unique, specific use case | No page-publishing or comment power in the kirodotdev/powers repo (checked 2026-11-08); also check kiro.dev/powers before submitting. |
| MCP servers not in beta or preview | Make sure nothing on usecloudy.ai/docs/mcp labels the MCP server beta or preview. If anything does, wait until it doesn't. |
| plugin.json has `$schema`, name, version, description | Yes |
| author (name required, url and email recommended) | `Cloudy`, `https://usecloudy.ai`, `support@usecloudy.ai` |
| keywords | Yes, 14 of them |
| license (SPDX) | `MIT` |
| README links a privacy policy | https://usecloudy.ai/privacy |
| README has a support contact | support@usecloudy.ai |

## Steps for John

1. **Before you submit:** the lead commits `kiro/`, and it reaches `main` on the **public** repo `github.com/Cloudtifact/plugins`. The form needs a public repo URL.
2. Optional smoke test (needs a Kiro account, free sign-in). In Kiro IDE, open the Powers panel, choose **Add Custom Power**, then **Import power from GitHub**, enter `https://github.com/Cloudtifact/plugins/tree/main/kiro`, and choose **Install**. Then ask "publish this HTML page with Cloudy". Kiro should open the Cloudy sign-in, and `publish_page` should return a link. If the IDE won't take a `/tree/main/kiro` URL, try the plain repo URL; Kiro says one repo can hold several powers, each in its own folder.
3. Open https://kiro.dev/powers/submit/ and fill in:

| Field | Value |
|---|---|
| First name (required) | John's first name |
| Last name (required) | John's last name |
| Organization (optional) | `Cloudy` |
| Email (required) | `support@usecloudy.ai` (or John's own address, if he'd rather get the reply) |
| Use case, 3-4 words (required) | `Publish pages, collect comments` |
| Public repository URL, must contain plugin.json (required) | `https://github.com/Cloudtifact/plugins/tree/main/kiro` |
| Describe the domain or problem (optional) | `Agents make HTML pages, reports and docs that people need to see and give feedback on. Cloudy publishes them to a stable link, people comment on the exact text, and the agent reads, fixes, replies to and resolves the comments. Every version is kept; spaces are private by default.` |

4. **What John agrees to by clicking Submit:** the Kiro Powers Publisher Terms and Conditions (https://kiro.dev/powers/terms), a binding agreement with Amazon Web Services, Inc. and AWS EMEA SARL, plus the AWS Privacy Notice. Main points: Cloudy supports its own users; AWS may list, promote, review and remove the power, and may use Cloudy's name and logo in marketing; AWS may collect usage metrics; Cloudy must report security issues; if AWS disables publishing, Cloudy keeps serving existing users for at least 90 days; Cloudy indemnifies AWS; Washington law applies. Whoever submits must be able to bind Cloudy.
5. Wait. Kiro contacts you only if they accept it. Until then, users can still install it from the GitHub URL (README.md).

## Art

The form takes no images. The registry pages show a logo, so if Kiro gets in touch, have these ready (no new art needed):

- `assets/icon-512.png` (512x512 rounded tile) and `assets/icon-square-512.png` (512x512 full-bleed square).

No banner, screenshots, video or demo account is asked for. If Kiro asks for a demo account, John has to make one; I didn't make any.

## Blockers

- The repo must be public with `kiro/` on `main` before you submit.
- The MCP server must not be called beta or preview anywhere.
- The power hasn't been run in a signed-in Kiro chat, because I didn't create a Kiro account.
- `Cloudtifact/plugins` and the skill name `cloudtifact` carry the old name. They're technical ids, so leave them; the listing text says Cloudy.
- Tagline: none is used, since the form has no tagline field. If Kiro asks for one: DRAFT (John writes this).
