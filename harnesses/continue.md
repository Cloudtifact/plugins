# Continue

No store any more. Continue Hub (hub.continue.dev), where blocks and assistants were shared, shut down after Cursor acquired Continue in June 2026. `hub.continue.dev` and `api.continue.dev` no longer resolve, and https://github.com/continuedev/continue is read-only. Sources and details are in `continue/SUBMIT.md`.

The open-source extension still loads local blocks, so `continue/` has Cloudy as an MCP block, a rule block and two prompt blocks. To install, copy them into `~/.continue/` (see `continue/README.md`). To add the server by hand:

```yaml
# ~/.continue/mcpServers/cloudy.yaml
name: Cloudy
version: 0.3.3
schema: v1
mcpServers:
  - name: Cloudy
    type: streamable-http
    url: https://mcp.cloudtifact.com/mcp
```
