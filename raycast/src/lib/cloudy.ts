import { OAuth } from "@raycast/api";
import { OAuthService, getAccessToken } from "@raycast/utils";
import { AUTHORIZE_URL, MCP_URL, SCOPE, TOKEN_URL } from "./config";

// Sign-in goes through the Cloudy MCP server's own OAuth (PKCE). Raycast's hosted Client ID Metadata Document is
// the client id, so nothing needs registering. The token is for the MCP endpoint, so the commands use that
// endpoint as their API: MCP JSON-RPC over HTTP with the bearer token.
const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.ClientIdMetadataDocument,
  providerName: "Cloudy",
  providerIcon: "icon.png",
  providerId: "cloudy",
  description: "Sign in to Cloudy to see your spaces and publish pages.",
  revocationEndpoint: TOKEN_URL,
});

export const cloudy = new OAuthService({
  client,
  clientId: OAuth.clientIdMetadataDocument,
  scope: SCOPE,
  authorizeUrl: AUTHORIZE_URL,
  tokenUrl: TOKEN_URL,
  refreshTokenUrl: TOKEN_URL,
  extraParameters: { resource: MCP_URL },
  bodyEncoding: "url-encoded",
});

type JsonRpcResponse = {
  result?: { content?: { type: string; text?: string }[]; structuredContent?: unknown; isError?: boolean };
  error?: { message: string };
};

let nextId = 1;

/** Reads a JSON-RPC reply that came back as plain JSON or as a server-sent event stream. */
async function readReply(res: Response): Promise<JsonRpcResponse> {
  const text = await res.text();
  if ((res.headers.get("content-type") ?? "").includes("text/event-stream")) {
    const data = text
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .filter(Boolean);
    const last = data[data.length - 1];
    if (!last) throw new Error("Cloudy sent an empty reply.");
    return JSON.parse(last) as JsonRpcResponse;
  }
  return JSON.parse(text) as JsonRpcResponse;
}

/** Calls one Cloudy MCP tool and returns its structured result. */
export async function callTool<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const { token } = getAccessToken();
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method: "tools/call", params: { name, arguments: args } }),
  });
  if (res.status === 401)
    throw new Error("Your Cloudy sign-in has expired. Sign out in the extension's settings and sign in again.");
  if (!res.ok) throw new Error(`Cloudy answered ${res.status}.`);
  const reply = await readReply(res);
  if (reply.error) throw new Error(reply.error.message);
  const result = reply.result;
  const text = result?.content?.find((c) => c.type === "text")?.text ?? "";
  if (result?.isError) throw new Error(text || "Cloudy couldn't do that.");
  if (result?.structuredContent) return result.structuredContent as T;
  return JSON.parse(text) as T;
}

export type Links = { page?: string; withComments?: string; app: string; note?: string };

export type Space = {
  id: string;
  name: string;
  workspace: string;
  visibility: string;
  kind: string;
  latestVersion: number;
  links: Links;
};

export type Thread = {
  id: string;
  path: string;
  version: number;
  author: string;
  quote: string | null;
  body: string;
  resolved: boolean;
  createdAt: string;
  replies: { id: string; author: string; body: string; createdAt: string }[];
};

export type Published = {
  spaceId: string;
  name: string;
  version: number;
  visibility: string;
  addedAsPage?: string;
  links: Links;
};

/** The link to share: the page link for public spaces, the app link for private ones. */
export const shareLink = (l: Links) => l.page ?? l.app;
