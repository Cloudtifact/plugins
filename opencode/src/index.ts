// Cloudy for OpenCode (V2 plugin).
// Registers the Cloudy MCP server, the `cloudtifact` skill and three commands.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Plugin } from "@opencode/plugin"
import type { Skill } from "@opencode/plugin"

// The one place the MCP address lives. Change it here if it moves.
export const MCP_URL = "https://mcp.cloudtifact.com/mcp"
export const MCP_NAME = "cloudy"
const SKILL_ID = "cloudtifact"
const COMMANDS = ["publish", "comments", "status"] as const

const here = path.dirname(fileURLToPath(import.meta.url))
// Published package: files copied in by scripts/sync.mjs at pack time.
// In the plugins repo: the shared files under plugins/cloudy/.
const roots = [path.join(here, ".."), path.join(here, "..", "..", "plugins", "cloudy")]

function find(rel: string): string | undefined {
  for (const root of roots) {
    const file = path.join(root, rel)
    if (fs.existsSync(file)) return file
  }
}

function parse(text: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!match) return { meta: {}, body: text.trim() }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line)
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "")
  }
  return { meta, body: text.slice(match[0].length).trim() }
}

type Options = { mcp?: boolean; skill?: boolean; commands?: boolean }

export default Plugin.define({
  id: "cloudy",
  async setup(ctx) {
    const options = (ctx.options ?? {}) as Options

    if (options.mcp !== false) {
      await ctx.mcp.transform((editor) => {
        // Leave a server the user set up themselves alone.
        if (!editor.get(MCP_NAME)) editor.set(MCP_NAME, { type: "remote", url: MCP_URL })
      })
    }

    const skillFile = find(path.join("skills", SKILL_ID, "SKILL.md"))
    if (options.skill !== false && skillFile) {
      const { meta, body } = parse(fs.readFileSync(skillFile, "utf8"))
      await ctx.skill.transform((editor) => {
        // `cloudy skill install` writes the same skill; a copy the CLI wrote wins.
        if (editor.get(SKILL_ID)) return
        editor.add({
          id: SKILL_ID as Skill.ID,
          name: (meta.name ?? SKILL_ID) as Skill.Name,
          description: meta.description,
          path: skillFile as Skill.Info["path"],
          content: body,
        })
      })
    }

    if (options.commands !== false) {
      const commands = COMMANDS.flatMap((name) => {
        const file = find(path.join("commands", `${name}.md`))
        return file ? [{ name, ...parse(fs.readFileSync(file, "utf8")) }] : []
      })
      await ctx.command.transform((editor) => {
        for (const command of commands) {
          editor.add({
            name: `cloudy-${command.name}`,
            description: command.meta.description,
            execute: async ({ sessionID, prompt, delivery }) => {
              await ctx.session.prompt({
                ...prompt,
                sessionID,
                text: command.body.replaceAll("$ARGUMENTS", prompt.text ?? "").trim(),
                delivery,
              })
            },
          })
        }
      })
    }
  },
})
