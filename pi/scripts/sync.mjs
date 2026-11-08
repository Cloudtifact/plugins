// Copies the shared Cloudy skill and commands from ../plugins/cloudy into this package,
// because an npm tarball can't reference files outside its folder. Runs before `npm pack`/`npm publish`.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shared = join(root, "..", "plugins", "cloudy");
if (!existsSync(shared)) {
	console.log("sync: ../plugins/cloudy not found, keeping the committed copies");
	process.exit(0);
}

rmSync(join(root, "skills"), { recursive: true, force: true });
cpSync(join(shared, "skills", "cloudtifact"), join(root, "skills", "cloudtifact"), { recursive: true });

// Pi names a prompt after its file, so prefix them: /cloudy-publish, /cloudy-comments, /cloudy-status.
rmSync(join(root, "prompts"), { recursive: true, force: true });
mkdirSync(join(root, "prompts"));
for (const file of readdirSync(join(shared, "commands"))) {
	if (file.endsWith(".md")) cpSync(join(shared, "commands", file), join(root, "prompts", `cloudy-${file}`));
}
console.log("sync: copied skills/cloudtifact and prompts from ../plugins/cloudy");
