# Submitting Cloudy to Anthropic's directory (Claude, Cowork, Claude Code)

Researched 2026-11-08 from Anthropic's docs (sources at the bottom). Nothing has been submitted.

Anthropic has **one directory** ([claude.ai/directory](https://claude.ai/directory)) and **one developer portal** ([claude.ai/directory/manage](https://claude.ai/directory/manage)) for both kinds of listing. The old Claude Console plugin form (`clau.de/plugin-directory-submission`, `platform.claude.com/plugins/submissions`) is no longer supported. "Claude Marketplace" (claude.com/marketplace) has no submission of its own; it reads from the same directory.

We make **two submissions** from the same claude.ai organization, which is what Anthropic tells product owners to do:

1. **MCP connector**: the remote server `https://mcp.cloudtifact.com/mcp` (moving to `https://mcp.usecloudy.ai/mcp`, see "MCP address" below).
2. **Plugin bundle**: `plugins/cloudy/` in `github.com/Cloudtifact/plugins` (skill + commands, plus `.mcp.json` pointing at the same server if the lead takes the suggestion below).

Then pair the two listings in the portal (possible only when both come from the same organization).

## Who can submit, and what John signs

- **Account**: a claude.ai account on a paid plan: Pro, Max, Ultra, Team or Enterprise. Free can't submit. On Team/Enterprise only an **Owner** can submit (Enterprise can also grant the **Directory** permission via a custom role).
- **Ownership is permanent-ish**: the first organization to submit a repository folder owns that listing; a second org gets "Already submitted by another organization". Submit from the org that should own Cloudy long term (a Cloudy Team org, not a personal Pro account, if that's the plan).
- **GitHub**: connect a GitHub account to claude.ai *in that org*, with **push access** to `Cloudtifact/plugins`. For push-update webhooks, admin access to the repo. The repo is public already, so the Claude GitHub App and the private-source upload consent aren't needed.
- **No fees.** No partner program. Review time isn't fixed.
- **John agrees to** (by submitting):
  - [Anthropic Software Directory Terms](https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms): warrants he has authority and rights to distribute; grants Anthropic a royalty-free licence to show our descriptions, docs, **name, trademarks and logos**; lets Anthropic test the software and collect functional metadata; must keep and follow a privacy policy; must have a way to receive vulnerability reports; **indemnifies Anthropic**; Anthropic can remove the listing for any reason; may not imply Anthropic endorsement; terms can change without notice.
  - [Anthropic Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy): collect only data needed for the function, no extra conversation data (even for logs), no reading Claude's memory/chat history/files, no ads or sponsored content, own or control every domain the software connects to, fix issues in reasonable time, tell Anthropic about material changes, provide a test account with sample data and **at least three working example prompts**.
  - Connector extras: keep it secure and working, respond to security issues promptly, keep descriptions accurate.
  - Plugin **Compliance** step: four acknowledgements (checkboxes). Connector **Compliance** step: seven acknowledgements (directory guidelines, first-party API use, financial transactions, AI media generation, prompt injection, conversation data collection, public documentation). All required. The portal shows the exact wording; nothing to sign outside it.

## Submission 1: MCP connector

Portal: [claude.ai/directory/manage](https://claude.ai/directory/manage) → **Submit new** → **MCP connector**. Progress saves in the browser.

### Requirements check (done 2026-11-08)

| Requirement | Status |
| - | - |
| Remote, `https://` | Yes. `POST /mcp` without a token returns 401 with `WWW-Authenticate: Bearer ... resource_metadata=".../.well-known/oauth-protected-resource/mcp"` |
| OAuth 2.0 | Yes. AS metadata advertises DCR (`registration_endpoint`), CIMD (`client_id_metadata_document_supported: true` and `none` in `token_endpoint_auth_methods_supported`, which is what Claude needs to pick CIMD), PKCE S256, refresh tokens |
| Callback URLs | **To test**: the auth server must accept `https://claude.ai/api/mcp/auth_callback` (web, Desktop, mobile, Cowork) **and** port-agnostic `http://localhost/callback` and `http://127.0.0.1/callback` (Claude Code). The brief says loopback is OK; claude.ai's callback wasn't checked (doing so would register a client on production) |
| Token endpoint accepts `application/x-www-form-urlencoded` | To confirm in the test run |
| Refresh-token rotation for public clients | To confirm |
| Every tool has `title` + `readOnlyHint`/`destructiveHint` | Yes, all 21 tools in `apps/mcp/src/tools.ts` (cloudtifact repo) |
| Tool names ≤ 64 chars, no catch-all read+write tool | Yes. `query_database` is read-only (`write: false`) |
| Domain matches the service | **Not yet**: `mcp.cloudtifact.com` vs product `usecloudy.ai`. Reviewers check "the MCP server domain should match your service". Wait for `mcp.usecloudy.ai` |
| Tested in Claude as a custom connector and via MCP Inspector | **To do** before submitting; the **Test & launch** step asks John to confirm it |
| Public docs | Yes: https://usecloudy.ai/docs/mcp |
| Privacy policy | Yes: https://usecloudy.ai/privacy (the "local connectors" privacy rules don't apply to a remote server, but the URL is still a listing field) |

Note for the lead: the brief's tool list is out of date. The live server has 21 tools: `list_workspaces list_spaces find_spaces get_space read_file publish_page list_folders create_folder rename_folder move_folder move_space list_comments add_comment reply_to_comment resolve_comment archive_space edit_comment list_versions list_capabilities database_schema query_database` (it's `create_folder`, not `create_folder`).

### Form fields, step by step

**1. Connection**
- Server URL: `https://mcp.usecloudy.ai/mcp` (once live; until then `https://mcp.cloudtifact.com/mcp`). Or pick it from your custom connectors if you added it to Claude for testing.
- "Users connect to different URLs": **leave off** (one URL for everyone).

**2. Tools**: synced from the server. Expect 21 tools, none flagged. If any are flagged, fix them on the server, not here.

**3. Listing**
- Server name (≤100): `Cloudy`
- One-liner (≤200): `Publish pages and docs to a link, then read, reply to and resolve the comments people leave on them.` — DRAFT (John writes this)
- Description (≤2,000; Anthropic can't edit it later; shown on the detail card) — DRAFT (John writes this):
  > Cloudy gives the pages, reports and docs Claude makes a stable link. Share it, and people comment on the exact text they mean. Claude reads those comments, fixes the page, replies and resolves the thread. Every version is kept, and spaces are private until you share them.
  >
  > With Cloudy connected, Claude can publish an HTML page or update one in place, list and search your spaces, read files, organise spaces into folders, read and answer comments, see past versions, and run read-only queries on a space's database.
  >
  > You need a Cloudy account (free sign-up at usecloudy.ai). You sign in once in the browser; Claude never sees your password.
- Categories (1–5): pick from the portal's list; suggested **Productivity**, plus whatever is closest to "Design" / "Documents" / "Collaboration".
- Documentation URL: `https://usecloudy.ai/docs/mcp`
- Privacy policy URL: `https://usecloudy.ai/privacy`
- Support contact: `support@usecloudy.ai`
- Icon: upload `assets/icon-square-512.png` (512×512 full-bleed square). The docs give no size; a full-bleed square is safest because Claude crops its own shape. If the portal asks for something else, the lead makes it.
- URL slug: `cloudy` (→ `https://claude.ai/directory/connectors/cloudy`). **Permanent once published.** If taken, `usecloudy`.
- No carousel screenshots: those are only for MCP Apps (servers that render UI). Cloudy's server returns plain tool results, so none are needed. (If we ever add an MCP App: 3–5 PNGs, ≥1000px wide, cropped to the app's response, each with its prompt text, no video/GIF.)

**4. Use cases**
- Primary use cases (draft, at least three, each one a prompt that works on the test account):
  1. "Make a one-page summary of this quarter's numbers and publish it with Cloudy so I can share the link."
  2. "Read the comments on my Launch plan page, fix what they ask for, reply to each and resolve them."
  3. "Find my spaces about pricing and tell me which ones have open comments."
  4. "Show me the last three versions of the Board update page and what changed."
- What users need first: a Cloudy account (sign up at usecloudy.ai). No paid plan needed to connect. [Lead: confirm whether any tool needs a paid Cloudy plan.]
- Reads, writes or both: **Both**.

**5. Company**
- Company name: `Cloudy` [lead: confirm the legal entity name John wants shown]
- Website: `https://usecloudy.ai`
- Primary contact for review updates: John's email (Anthropic emails this address during review).

**6. Authentication**
- Authentication requirement: **Required** (every tool acts on the user's account).
- Method: **OAuth**, using our server's own DCR/CIMD. Leave the "Anthropic-held OAuth client" ID/secret **empty**. Anthropic recommends CIMD or an Anthropic-held client over DCR for high-traffic servers (DCR makes a new client per fresh connection); we advertise CIMD, so Claude should pick CIMD.

**7. Data handling**
- Underlying API: **our own** (first-party Cloudy API).
- Personal health data: **No**. Sponsored content: **No**.

**8. Test & launch**
- Test account: make a dedicated Cloudy account for reviewers (e.g. `claude-review@usecloudy.ai`) and **fill it**: 3+ spaces with published pages, a folder, open and resolved comments, two or more versions of one page, one space with a database. Anthropic requires "a fully populated account".
- Access steps for the reviewer (draft): "Add the connector, click Connect, sign in at the Cloudy page with the email and password below, approve access. Then try the use-case prompts above." Plus the credentials (only reviewers see them). Note: if sign-in is email-code or a third-party login only, the reviewer needs a way in without John's inbox: give a password login for this account or a mailbox the reviewer can read. **Blocker to resolve before submitting.**
- Confirm: "I've run every tool myself" (via MCP Inspector or as a custom connector in Claude). Do it first.

**9. Compliance**: tick all seven.

**10. Review and submit**: fix any quality warnings shown (e.g. very short answers), then submit.

After: auto-scanned and listed as **Community** by default; Anthropic may escalate to **Verified** on its own (no application). Status in the portal; escalations to `mcp-review@anthropic.com`. Editable later in the portal: tagline, description, categories, docs/privacy links, support contact, icon, company. The **slug is locked**, renaming needs re-review, and the docs list no self-serve way to change the server URL (email `mcp-review@anthropic.com`), so **submit with the final URL**.

## Submission 2: plugin bundle

Portal: [claude.ai/directory/manage](https://claude.ai/directory/manage) → **Submit new** → **Plugin bundle**. One submission per plugin folder; at most 10 submissions per org per 24 h (drafts and withdrawals count).

**1. Source**
- Repository: `Cloudtifact/plugins`
- Plugin path: `plugins/cloudy`
- Branch or tag: `main` (after the lead merges `cloudy-every-harness`; empty = default branch). The repo must be public before the listing goes live (it is).
- Select **Validate**; fix anything marked **Blocking**, push, **Re-validate**. A result applies to one commit.

**2. Listing details**: read from `plugin.json` and `README.md`; to change anything, edit the repo and validate again. Nothing to type here. What it will show today:
- name `cloudy`, description from `plugin.json`, README as the long description, author "Cloudy", license MIT, docs/support/privacy/terms URLs.
- **No icon and no display name yet** (see "Changes for the lead").

**3. Data handling** (suggested answers)
- Reads or stores personal data? **Yes, reads**: comment authors' names and the content the user publishes; nothing is stored by the plugin itself, the Cloudy service stores published pages until deleted.
- Sends data to services other than its declared connectors? **Yes**: the `cloudy` CLI talks to Cloudy's API (today `api.cloudtifact.com`). If `.mcp.json` is added, this becomes the declared connector for the MCP path; the CLI path still calls our API, which the README discloses.
- How long it keeps data: the plugin keeps nothing; published spaces are kept until the user deletes them; the sign-in token stays on the user's machine.
- Intended for people under 18? **No**.

**4. Compliance**: check the contact email (John's), tick all four acknowledgements.

**5. Review and submit**
- How new versions reach the directory: **GitHub push webhook** (default), then **Set up push updates** (needs repo admin).
- **Auto-publish passing versions**: John's choice; on is fine once the first version is approved.
- **Submit for review**. The first version is read by a person.

After: every later commit on `main` is validated and security-scanned; raise `version` in `plugin.json` on every release. Help: the plugin's menu → **Get help**, or `directory@anthropic.com`.

### Likely review holds for the plugin

- **Name**: `cloudy` is a common word and there are other products called Cloudy. Possible "Name matches a known brand" / "Name may be confused" **hold** (not a block unless another org already uses `cloudy`, which would be "Name is taken"). Fallback: `usecloudy`. The name is permanent after release, so decide before submitting.
- **Skill depends on a CLI** that the skill tells Claude to `npm i -g usecloudy` / `npx usecloudy` (unpinned). Instructions in `SKILL.md` aren't scanned like hooks, so this isn't a block, but the security scan wants every destination disclosed in the README (it is: "Cloudy's API").
- In **claude.ai chat**, commands load as skills and there's no shell for the CLI, so without a bundled connector the plugin does little there (see recommendation).

## MCP address (one-line change)

The server address may move from `https://mcp.cloudtifact.com/mcp` to `https://mcp.usecloudy.ai/mcp` (another thread; `mcp.usecloudy.ai` didn't resolve on 2026-11-08). It appears in exactly two places for this harness:
1. The connector submission's **Connection** URL (portal) — submit only after the move.
2. `plugins/cloudy/.mcp.json`, if added — must be the **same URL** as the connector, so people with both see one set of tools.

## Art needed

- Connector icon: square PNG, `assets/icon-square-512.png` (512×512) works. No size is published.
- Plugin icon: any image file inside the plugin folder, referenced by `plugin.json` `"icon"`; `plugins/cloudy/.claude-plugin/icon.png` (512×512 PNG) already exists. Images are exempt from the 256 KiB file limit.
- No screenshots, banners or video for either submission (screenshots only for MCP Apps).

## Changes for the lead (outside this folder)

In `plugins/cloudy/.claude-plugin/plugin.json`:
- Add `"displayName": "Cloudy"`.
- Add `"icon": "./.claude-plugin/icon.png"` (the directory reads it; Claude Code ignores it). Check that a path under `.claude-plugin/` is accepted by **Validate**; if not, move it to `./icon.png`.
- Optional, recommended: add `plugins/cloudy/.mcp.json` (below).

In `plugins/cloudy/README.md`: `claude plugin validate` advises an install line; it already has `/plugin install cloudy --marketplace Cloudtifact/plugins` but the validator doesn't detect it inside the unlabeled code block. Harmless advice, not a finding.

Suggested `.mcp.json`:
```json
{
  "mcpServers": {
    "cloudy": {
      "type": "http",
      "url": "https://mcp.usecloudy.ai/mcp"
    }
  }
}
```
plus a README line under "What data it sends" covering the connector, and a SKILL.md note: "If the Cloudy tools (`publish_page`, `list_comments`, ...) are available, use them; otherwise use the CLI." Because the CLI writes SKILL.md, that note belongs in the CLI's skill source, not a hand edit.

## Local validation

```
$ cd ~/Documents/cloudy-plugins
$ claude --version            # 2.1.319 (Claude Code)
$ claude plugin validate .
✔ Validation passed           (exit 0; one advice: README install line)
$ claude plugin validate plugins/cloudy
✔ These checks found nothing to report / ✔ Validation passed   (exit 0)
$ claude plugin validate --profile directory --strict plugins/cloudy
✔ Validation passed           (exit 0)
$ claude plugin validate --strict .
✔ Validation passed           (exit 0)
```
The portal's **Validate**, security scan and policy review run more checks than this.

## Sources (fetched 2026-11-08)

- Publish to the directory: https://claude.com/docs/directory/publish
- Submit your plugin: https://claude.com/docs/plugins/submit
- Plugin pre-submission checklist: https://claude.com/docs/plugins/pre-submission-checklist
- Plugin structure (bundling a connector): https://claude.com/docs/plugins/build
- Platform support (what loads in chat/Cowork/Code): https://claude.com/docs/plugins/platform-support
- What to include in your plugin: https://claude.com/docs/connectors/building/what-to-build
- Submit a connector: https://claude.com/docs/connectors/building/submission
- Connector pre-submission checklist: https://claude.com/docs/connectors/building/review-criteria
- Authentication for connectors: https://claude.com/docs/connectors/building/authentication
- Track your submission: https://claude.com/docs/directory/submission-status
- Manage your listing / after publishing: https://claude.com/docs/connectors/building/managing-your-listing , https://claude.com/docs/connectors/building/after-publishing
- Connector verification labels: https://claude.com/docs/connectors/verification
- Manifest reference (icon, displayName, directory fields): https://code.claude.com/docs/en/plugins/manifest-reference
- Directory Terms: https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms
- Directory Policy: https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy
