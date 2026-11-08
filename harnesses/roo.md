# Roo Code: nothing to list

Checked 2026-11-08. Roo Code shut down on 2026-05-15, and its marketplace went with it, so there is nothing to build or submit.

## Sources

- Sunset notice: https://github.com/RooCodeInc/Roo-Code-Docs/blob/main/docs/sunset.md (also at https://roocodeinc.github.io/Roo-Code/sunset/). "All Roo Code products will be shut down on May 15, 2026", including the extension, Roo Code Cloud and Router. It recommends Cline as the open-source alternative.
- The extension repo https://github.com/RooCodeInc/Roo-Code is archived (`gh api repos/RooCodeInc/Roo-Code` -> `archived: true`, last push 2026-05-15).
- The submission repo `RooCodeInc/Roo-Code-Marketplace` no longer exists (`gh api repos/RooCodeInc/Roo-Code-Marketplace` -> 404; https://github.com/RooCodeInc/Roo-Code-Marketplace -> 404).
- The marketplace feeds the extension read are gone: `https://app.roocode.com/api/marketplace/mcps` and `.../modes` both return `410 Gone`. https://roocode.com redirects to https://roomote.dev (the team's new cloud agent product, not an extension marketplace).
- How it used to work, for the record: https://github.com/RooCodeInc/Roo-Code-Docs/blob/main/docs/features/marketplace.mdx (MCPs and Modes, installed to `.roo/mcp.json` / `.roomodes`).

## Someone still running Roo Code

The installed extension still reads its own config, so Cloudy can be added by hand:

- **MCP:** add to `.roo/mcp.json` (project) or the global MCP settings:

  ```json
  { "mcpServers": { "cloudy": { "type": "streamable-http", "url": "https://mcp.cloudtifact.com/mcp" } } }
  ```

  (`"type": "streamable-http"` per https://github.com/RooCodeInc/Roo-Code-Docs/blob/main/docs/features/mcp/using-mcp-in-roo.mdx.) Whether its last release finishes OAuth sign-in with this server wasn't tested; it gets no fixes now.
- **Skill:** `npm i -g usecloudy`, then `cloudy skill install`.

Better: move to Cline (what Roo itself recommends). See `cline/`.

If the MCP address moves to `mcp.usecloudy.ai`, update the line above.
