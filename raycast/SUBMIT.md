# Submitting Cloudy to the Raycast Store

Status: built, `ray lint` and `ray build` pass. Not submitted. Not loaded in the Raycast app yet (Raycast isn't installed on the build machine), so the sign-in and the MCP tools are untested end to end.

## What Raycast accepts

- **Raycast Store** (https://www.raycast.com/store): extensions are TypeScript/React packages. They get in by a pull request to [`raycast/extensions`](https://github.com/raycast/extensions), which Raycast's team reviews. After the merge they publish it automatically. Publishing is free.
  - How to publish: https://developers.raycast.com/basics/publish-an-extension
  - Store rules: https://developers.raycast.com/basics/prepare-an-extension-for-store
  - Extension guidelines: https://manual.raycast.com/extensions-guidelines
- **AI extensions**: an extension can give Raycast AI tools, instructions and evals (`ai.yaml`), and it can also bundle **one remote MCP server** (`ai.mcp`) whose tools become the extension's AI tools, with OAuth `{ type: dynamic }`. It can bundle Agent Skills too (`ai.skills`). See https://developers.raycast.com/information/manifest#ai-properties and https://developers.raycast.com/ai/learn-core-concepts-of-ai-extensions.
- **Raycast's own MCP client**: people can also add any remote MCP server by hand (Install MCP Server command → HTTP → URL → OAuth: Dynamic). See https://manual.raycast.com/ai/model-context-protocol. Raycast has an MCP "meta registry" that pulls from Smithery and the official servers (https://manual.raycast.com/v1/model-context-protocol). It doesn't say how a third party gets listed.

## What's in this package

`~/Documents/cloudy-plugins/raycast/`, extension name `cloudy`, title "Cloudy", version handled by the Store (CHANGELOG):

- `ai.yaml`: the Cloudy MCP server (`https://mcp.cloudtifact.com/mcp`, OAuth dynamic), so `@cloudy` in Raycast AI has all 18 Cloudy tools. Also instructions and two evals (they're also the suggested prompts).
- **Search Spaces** command: lists spaces (`list_spaces`), with Open in Browser, Copy Link, Show Comments (`list_comments`) and Resolve Comment (`resolve_comment`).
- **Publish HTML File** command: form with a file picker, "Publish To" (new space or a new version of an existing one), public checkbox and note. Sends the page plus the local files it references to `publish_page`, copies the link and shows it.
- Sign-in for the commands: Raycast's `OAuth.PKCEClient` with `RedirectMethod.ClientIdMetadataDocument`. The client id is Raycast's hosted metadata document (`https://www.raycast.com/.well-known/oauth-client-metadata/raycast.json`), which our server accepts (CIMD). I checked: `GET https://mcp.cloudtifact.com/authorize?client_id=<that URL>&redirect_uri=com.raycast:/oauth&…&resource=https://mcp.cloudtifact.com/mcp` returns the "Connect Raycast to Cloudy" page. So there's no client to register and no API key. The token is for the MCP endpoint, so the commands use that endpoint as their API: stateless MCP JSON-RPC `tools/call` over HTTP with the bearer token (`src/lib/cloudy.ts`).
- The skill isn't bundled. Raycast AI can't run shell commands, and the `cloudtifact` skill drives the `cloudy` CLI. The MCP server's instructions plus `ai.yaml` cover the same ground.

Known catch: Raycast AI (MCP) and the commands sign in separately, so a user signs in twice. The README says so. If that matters, a later version could drop `ai.mcp` and declare Raycast tools (`src/tools/*.ts`) that call `callTool` with the commands' token. That means one sign-in, but each tool has to be written by hand.

## MCP address

It's in two places, because Raycast reads `ai.yaml` and the code can't import from it:

- `ai.yaml` → `mcp.url`
- `src/lib/config.ts` → `MCP_ORIGIN`

When the server moves to `mcp.usecloudy.ai`, change both. The new host has to accept the same CIMD client and `com.raycast:/oauth` redirect. Moving also signs existing users out, since their tokens are for the old host.

## Before submitting (John)

1. **Raycast account.** Sign in at raycast.com (or in the Raycast app) and choose a Store handle. `package.json` `author` must be a real handle: `ray lint` checks it against `https://www.raycast.com/api/v1/users/<handle>` and fails on a 404. It says `cloudy` now, and **a `@cloudy` account exists (joined June 2025, no extensions)**. If that isn't ours, put our handle in `author`. If it is ours, keep it.
2. **GitHub account** for the pull request (`npm run publish` asks you to sign in to GitHub and opens the PR from a fork of `raycast/extensions`). You agree to the raycast/extensions repo's terms and the MIT license by opening it.
3. Install Raycast, then `cd raycast && npm install && npm run dev`. Then try:
   - Search Spaces: the sign-in screen, then your spaces, Show Comments and Resolve Comment.
   - Publish HTML File: a page with a CSS file next to it, both new space and new version.
   - Raycast AI: "@cloudy what have I published?" (signs in a second time).
4. Shoot the screenshots (below) with Raycast's **Capture Window** command, ticking **Save to Metadata** (it writes to `metadata/`).
5. `npm run lint && npm run build`, then `npm run publish`. That command squashes commits and opens the PR. Don't run it until the screenshots are in.

## Form fields / manifest values (already in package.json)

| Field | Value |
|---|---|
| name | `cloudy` (not taken in raycast/extensions) |
| title | Cloudy |
| description | Publish HTML pages to a stable link, see your spaces and work through the comments people leave. |
| author | `cloudy` (see step 1) |
| license | MIT |
| platforms | macOS (add "Windows" once tested there; no Mac-only APIs are used) |
| categories | Productivity, Developer Tools, Web |
| keywords | publish, html, share, comments, report, page, mcp |
| icon | `assets/icon.png`, 512x512 PNG (copied from `assets/icon-512.png`) |
| Commands | Search Spaces; Publish HTML File (subtitle "Cloudy") |
| PR title | `Add cloudy extension` |
| PR description | Raycast's PR template: say what it does, and link the docs (https://usecloudy.ai/docs) and privacy policy (https://usecloudy.ai/privacy). Note for reviewers: sign-in is OAuth PKCE with Raycast's Client ID Metadata Document, nothing to set up. They need a Cloudy account to test, so a review account may be needed (see blockers). |

Store tagline: none needed. The description above is plain. If you want a different line, write it yourself (DRAFT (John writes this)).

## Art needed

- Icon: done (`assets/icon.png`, 512x512). It must look right on both light and dark Raycast themes. The rounded tile with transparent corners should be fine. Check it in both, and add `assets/icon@dark.png` if it isn't.
- Screenshots: **2000 x 1250 px PNG (16:10)**, at most 6 (at least 3 recommended), same wallpaper in all, one theme, no other apps, no private data. They go in `metadata/` as `cloudy-1.png` and so on. Shoot these (in a demo workspace with tidy names):
  1. **Search Spaces**: the list with 5 or 6 spaces, a mix of lock and globe icons, the action panel (⌘K) open on one row.
  2. **Show Comments**: the comments list with the detail pane showing a quote, a comment and a reply.
  3. **Publish HTML File**: the form filled in (file picked, "Publish To" open or set to a space, note typed).
  4. **Published**: the result screen with the link and "Published version N" (plus the success toast if it shows).
  5. **Raycast AI**: AI Chat with "@cloudy what are the open comments on my Q3 report?" and the answer.
  6. (optional) The sign-in screen, "Sign in to Cloudy".

## Blockers

- A Raycast Store handle for `author` (see step 1).
- Never run in the real app yet. A reviewer will try it, so test the OAuth redirect and the MCP sign-in first.
- Reviewers will probably need a Cloudy account they can sign in with: give one in the PR or offer it when they ask. That's a demo account John has to create.
- Raycast's docs don't give an `raycast://mcp/install` deeplink format for HTTP servers (the documented deeplink is for stdio), so there's no "Add Cloudy to Raycast" link yet. The manual steps are: Raycast → **Install MCP Server** → Name "Cloudy", transport HTTP, URL `https://mcp.cloudtifact.com/mcp`, OAuth **Dynamic** → Install → Sign In. A guess at a one-click link, untested: `raycast://mcp/install?` + percent-encoded `{"name":"Cloudy","type":"http","url":"https://mcp.cloudtifact.com/mcp"}`. Try it once Raycast is installed before putting it on usecloudy.ai/docs/mcp.

## Validation

```
$ npx ray lint
ready  - validate package.json file
ready  - validate extension icons
ready  - validate extension skills
ready  - validate extension metadata
ready  - run ESLint
ready  - run Prettier 3.9.10

$ npx ray build -e dist
info  - entry points ["src/search-spaces.tsx","src/publish-html-file.tsx"]
info  - compiled entry points
info  - generated extension's TypeScript definitions
info  - checked TypeScript
ready  - built extension successfully
```

(@raycast/api 2.11.1, @raycast/utils 2.3.3, run on 2026-11-08.)
