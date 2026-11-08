#!/bin/sh
# Points every package at a new address for the hosted MCP server, e.g. when it moves to mcp.usecloudy.ai:
#   scripts/set-mcp-url.sh https://mcp.usecloudy.ai/mcp
# Then rerun each harness's validation (its SUBMIT.md) and bump versions.
set -eu
new=${1:?usage: set-mcp-url.sh <new url>}
old=${2:-https://mcp.cloudtifact.com/mcp}
cd "$(dirname "$0")/.."
git grep -l -F "$old" -- ':!scripts/' | while read -r f; do
  sed -i.bak "s#$old#$new#g" "$f" && rm "$f.bak" && echo "$f"
done
