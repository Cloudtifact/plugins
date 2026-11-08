import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Cloudy's remote MCP server. Change only this line if the address moves.
export const CLOUDY_MCP_URL = "https://mcp.cloudtifact.com/mcp";

// Adds Cloudy's MCP server to every session. Sign in once with `/mcp login cloudy`
// (opens the browser; no API key). A "cloudy" entry in your own mcp.json wins over this one.
export default function (pi: ExtensionAPI) {
	pi.registerMcpServer("cloudy", {
		url: CLOUDY_MCP_URL,
		description:
			"Cloudy: publish HTML pages and docs to a stable link, list spaces and versions, and read, reply to and resolve the comments people leave on them.",
	});
}
