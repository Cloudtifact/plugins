// Copy the Cloudy skill from plugins/cloudy (the one the CLI writes) into this package.
// Run `npm run sync-skill` before `npm publish` (not a lifecycle script, so git installs need no build approval); a no-op outside the Cloudtifact/plugins checkout.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const from = fileURLToPath(new URL('../../plugins/cloudy/skills/cloudtifact/SKILL.md', import.meta.url))
const to = fileURLToPath(new URL('../skills/cloudtifact/SKILL.md', import.meta.url))
if (existsSync(from)) {
  mkdirSync(fileURLToPath(new URL('../skills/cloudtifact/', import.meta.url)), { recursive: true })
  copyFileSync(from, to)
  console.log('synced skills/cloudtifact/SKILL.md from plugins/cloudy')
} else {
  console.log('plugins/cloudy not found; keeping the bundled skill as is')
}
