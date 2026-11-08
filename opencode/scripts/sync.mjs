// Copies the shared skill and commands from plugins/cloudy/ into this package
// before `npm pack` / `npm publish`, so the published package carries them.
// The skill is written by the Cloudy CLI: run this again when it changes.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const pkg = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const shared = path.join(pkg, "..", "plugins", "cloudy")
const copies = [
  ["skills/cloudtifact/SKILL.md", "skills/cloudtifact/SKILL.md"],
  ["commands/publish.md", "commands/publish.md"],
  ["commands/comments.md", "commands/comments.md"],
  ["commands/status.md", "commands/status.md"],
]
for (const [from, to] of copies) {
  const dest = path.join(pkg, to)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(path.join(shared, from), dest)
  console.log(`copied ${from}`)
}
