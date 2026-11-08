#!/bin/sh
# Some harnesses only load files inside their own folder, so they carry copies of the skill and commands from
# plugins/cloudy/. Run this after packages/cli/scripts/sync-plugins.sh (which updates plugins/cloudy/) so every copy
# matches. pi and opencode copy theirs when they're packed, so they aren't listed here.
set -eu
cd "$(dirname "$0")/.."
skill=plugins/cloudy/skills/cloudtifact/SKILL.md
for d in gemini grok deepseek copilot/cloudy kiro jetbrains/cloudy vscode antigravity/cloudy; do
  cp "$skill" "$d/skills/cloudtifact/SKILL.md"
done
for d in grok/commands copilot/cloudy/commands; do
  [ -d "$d" ] && cp plugins/cloudy/commands/*.md "$d/"
done
echo "Copied the skill (and commands where kept) from plugins/cloudy. Bump versions where a SUBMIT.md says to."
