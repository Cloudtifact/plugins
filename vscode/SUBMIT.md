# Submitting Cloudy to VS Code

VS Code has three separate places Cloudy can show up:

| Surface | Backed by | Third-party path | Status |
|---|---|---|---|
| **Agent plugins** (Chat: Open Customizations > Browse) | Git marketplaces; the default is `github/awesome-copilot#marketplace` | Same package and same awesome-copilot form as Copilot CLI: see `copilot/SUBMIT.md` | Built (`copilot/cloudy`). Installable today from source. |
| **MCP server gallery** (`@mcp` in Extensions / **MCP: Browse MCP Servers**) | GitHub MCP Registry (`api.mcp.github.com`), curated | Publish to the official MCP Registry (owned by `registries/`, `ai.usecloudy/cloudy`), then email partnerships@github.com | Not ours to build here. |
| **VS Code Marketplace extension** (Extensions view search) | marketplace.visualstudio.com | Self-serve: create a publisher, upload a `.vsix` | **Built** in this folder. |

## Is an extension worth it?

Yes, as a small one. It's the only VS Code surface that's self-serve (the MCP gallery is curated, and agent plugins are reviewed by awesome-copilot), and people search the Extensions view for tools by name. It's 25 lines of code: `contributes.mcpServerDefinitionProviders` + `vscode.lm.registerMcpServerDefinitionProvider` returns one `McpHttpServerDefinition` for the remote server (VS Code runs the OAuth sign-in), and `contributes.chatSkills` ships the `cloudtifact` skill. No settings, no telemetry, no build step.

Not included: the three commands (`/publish`, `/comments`, `/status`). VS Code already offers skills as slash commands, and the agent-plugin package (`copilot/cloudy`) has them for people who want them. There's no static/no-code way to contribute an MCP server, so the tiny `extension.js` is required.

## Files

- `package.json`: id `usecloudy.cloudy`, version `0.3.3`, engines `^1.110.0` (first release with `chatSkills`; `mcpServerDefinitionProviders` is older), categories `AI`, `Chat`.
- `extension.js`: the MCP address is the `MCP_URL` constant. **When the server moves to `mcp.usecloudy.ai`, change that one line**, bump `version`, repackage.
- `skills/cloudtifact/SKILL.md`: a **copy** of `plugins/cloudy/skills/cloudtifact/SKILL.md`. A `.vsix` can only contain files inside this folder. **Resync it when the CLI updates the skill**, then bump the version and republish.
- `icon.png` (256x256, from `assets/icon-256.png`), `README.md` (the Marketplace page), `LICENSE`, `.vscodeignore` (keeps `SUBMIT.md` out of the package).

## Steps (John)

1. Sign in at https://marketplace.visualstudio.com/manage with a Microsoft account (create one with support@usecloudy.ai if needed). If asked, create an Azure DevOps organization (free).
2. **Create publisher**:

| Field | Value |
|---|---|
| ID (permanent) | `usecloudy` (`cloudy` is taken by another company; `usecloudy` and `cloudtifact` were free on 2026-11-08) |
| Name | `Cloudy` |
| Description | `Publish HTML pages and docs to a stable link, then work through the comments people leave on them.` |
| Logo | `assets/icon-512.png` |
| Company website | `https://usecloudy.ai` |
| Support | `support@usecloudy.ai` |
| Source code repository | `https://github.com/Cloudtifact/plugins` |

   If the ID is not `usecloudy`, change `"publisher"` in `package.json` to match.
3. Package (no publish from an agent): `cd vscode && npx @vscode/vsce package` gives `cloudy-0.3.3.vsix`.
4. Upload: on the manage page, select the publisher > **New extension** > **Visual Studio Code** > drop the `.vsix`. (Or `npx @vscode/vsce login usecloudy` then `npx @vscode/vsce publish`. Microsoft recommends OIDC Trusted Publishing from GitHub Actions, `vsce publish --oidc`, over PATs; global Azure DevOps PATs are retired on 2026-12-01.)
5. The Marketplace runs an automated scan (usually minutes). There's no human review and no fee.
6. Optional, later: **verified publisher** (blue check). Needs 6 months of extensions on the Marketplace and a domain registered 6+ months; add a DNS TXT record on `usecloudy.ai`. Reviewed in about 5 business days.

What John agrees to: the Visual Studio Marketplace Publisher Agreement, shown when the publisher is created.

Listing text: display name `Cloudy`, description = `package.json` `description`. If the Marketplace rejects `Cloudy` as a display name (an extension called "Cloudy - AI for Your REST APIs" exists), use `Cloudy: publish and get comments`. Any tagline: `DRAFT (John writes this)`.

## Art

- Icon: PNG, at least 128x128, no SVG. Done: `icon.png` 256x256.
- Nothing else required. Optional: `galleryBanner.color` in `package.json` (a hex colour, the lead picks), and screenshots in `README.md` (must be `https` image URLs, no SVG). A good one would be a 1280x800 PNG of Copilot chat publishing a page and the comment thread, but the README reads fine without it.

## Validation (2026-11-08)

```
$ cd vscode && npx @vscode/vsce ls
LICENSE  README.md  extension.js  icon.png  package.json  skills/cloudtifact/SKILL.md
$ npx @vscode/vsce package --out /tmp/t0279-copilot/cloudy-0.3.3.vsix
 DONE  Packaged: /tmp/t0279-copilot/cloudy-0.3.3.vsix (8 files, 98.95 KB)
```

Loaded in real VS Code 1.145.2 (downloaded by `@vscode/test-electron`, isolated user-data dir) with a test that activates the extension:

```
CLOUDY_TEST activated: true version 0.3.3
CLOUDY_TEST contributes: {"mcpServerDefinitionProviders":[{"id":"cloudy","label":"Cloudy"}],"chatSkills":[{"path":"./skills/cloudtifact/SKILL.md"}]}
RUN OK
$ code --extensions-dir /tmp/... --install-extension /tmp/t0279-copilot/cloudy-0.3.3.vsix
Extension 'cloudy-0.3.3.vsix' was successfully installed.
$ code --extensions-dir /tmp/... --list-extensions --show-versions
usecloudy.cloudy@0.3.3
```

Activation calls `registerMcpServerDefinitionProvider`, which throws if the id doesn't match `contributes.mcpServerDefinitionProviders`, so this checks the wiring. Not tested: the OAuth sign-in and a live tool call (needs a Copilot sign-in in that VS Code).

## Notes

- Open VSX (used by Cursor, Windsurf, VSCodium) takes the same `.vsix` via `npx ovsx publish` after an Eclipse account + publisher agreement. Not in scope here; flag for the Cursor/Windsurf threads.
- The MCP server is offered as soon as the extension is installed; VS Code asks the user to trust and start it and opens the browser sign-in on first use.

## Sources

- MCP in extensions (`mcpServerDefinitionProviders`, `McpHttpServerDefinition`): https://code.visualstudio.com/api/extension-guides/ai/mcp ; sample: https://github.com/microsoft/vscode-extension-samples/tree/main/mcp-extension-sample
- `chatSkills` contribution point: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/chat/common/promptSyntax/chatPromptFilesContribution.ts
- Agent plugins in VS Code: https://code.visualstudio.com/docs/copilot/customization/agent-plugins ; default marketplace `github/awesome-copilot#marketplace`: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/chat/common/plugins/marketplaceReference.ts ; marketplace lookup order: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/chat/common/plugins/pluginMarketplaceService.ts
- MCP gallery: https://code.visualstudio.com/docs/copilot/customization/mcp-servers (backed by `api.mcp.github.com`, see `aiCustomizationManagementEditor.ts` in microsoft/vscode)
- Publishing extensions: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- GitHub MCP Registry inclusion: https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/
