// The one place the Cloudy MCP address lives for the commands. If it moves (to mcp.usecloudy.ai), change
// MCP_ORIGIN here and `ai.mcp.url` in package.json.
export const MCP_ORIGIN = "https://mcp.cloudtifact.com";
export const MCP_URL = `${MCP_ORIGIN}/mcp`;
export const AUTHORIZE_URL = `${MCP_ORIGIN}/authorize`;
export const TOKEN_URL = `${MCP_ORIGIN}/oauth/token`;
export const SCOPE = "cloudtifact offline_access";
