/**
 * Cloudy for DeepSeek Harness: registers the `cloudtifact` skill, which teaches the
 * agent to publish pages with the Cloudy CLI and to read, fix, reply to and resolve
 * the comments people leave on them.
 *
 * The skill is a bundled candidate. A newer copy that `cloudy skill install` writes
 * to ~/.agents/skills/cloudtifact outranks it, so the CLI's own copy wins when present.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const PROVIDER_NAME = 'cloudy'
const SKILL_DIR = new URL('./skills/cloudtifact/', import.meta.url)
const SKILL_FILE = new URL('SKILL.md', SKILL_DIR)
// Same as BUNDLED_SKILL_RANK in @deepseek-ai/dsh-skill: the lowest priority, so a
// project or user copy of the skill wins.
const BUNDLED_SKILL_RANK = 600
const RESOURCE_BASE = { kind: 'directory', path: fileURLToPath(SKILL_DIR) }
const INVOCATION = { modelInvocable: true, userInvocable: true }

/** Split `---` YAML frontmatter from the body and read its name and description. */
function parseSkill(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!match) throw new Error('cloudy: SKILL.md has no frontmatter')
  const field = (key) => {
    const line = new RegExp(`^${key}:\\s*(.*)$`, 'm').exec(match[1])
    return line ? line[1].trim().replace(/^(['"])(.*)\1$/, '$2') : undefined
  }
  const name = field('name')
  const description = field('description')
  if (!name || !description) throw new Error('cloudy: SKILL.md frontmatter needs name and description')
  return { name, description, content: text.slice(match[0].length) }
}

let parsed
async function load() {
  parsed ??= readFile(SKILL_FILE, 'utf8').then(parseSkill)
  try {
    return await parsed
  } catch (error) {
    parsed = undefined
    throw error
  }
}

const provider = {
  name: PROVIDER_NAME,
  async list() {
    const skill = await load()
    return [
      {
        name: skill.name,
        description: skill.description,
        invocation: INVOCATION,
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase: RESOURCE_BASE,
        rank: BUNDLED_SKILL_RANK,
        locator: SKILL_FILE,
      },
    ]
  },
  async get() {
    const skill = await load()
    return {
      name: skill.name,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      content: skill.content,
    }
  },
}

/** Cordis plugin name. */
export const name = 'cloudy'
/** The skill registry this plugin adds to. */
export const inject = ['skills']

/** Register the Cloudy skill provider on `ctx.skills`. */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
