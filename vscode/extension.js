// Cloudy for VS Code: adds Cloudy's MCP server to Copilot chat.
// The skill is contributed in package.json (contributes.chatSkills); no code needed for it.
const vscode = require('vscode');

// The one place the server address lives in this extension.
const MCP_URL = 'https://mcp.cloudtifact.com/mcp';

function activate(context) {
	const version = context.extension.packageJSON.version;
	context.subscriptions.push(
		vscode.lm.registerMcpServerDefinitionProvider('cloudy', {
			provideMcpServerDefinitions: () => [
				new vscode.McpHttpServerDefinition('Cloudy', vscode.Uri.parse(MCP_URL), {}, version),
			],
		}),
	);
}

function deactivate() {}

module.exports = { activate, deactivate };
