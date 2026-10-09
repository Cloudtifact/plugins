---
description: Publish an HTML page (or the page you just made) to Cloudtifact and share the link
argument-hint: "[file.html] [--public]"
---

Publish with Cloudtifact, following the cloudtifact skill.

- File: $ARGUMENTS. If no file is given, use the HTML page you made or edited most recently in this conversation. If there isn't one, ask which file to publish.
- Run `cloudtifact publish <file>` (add `--public` only if the user asked for a link anyone can open).
- Reply with the link(s) it prints, and say whether the page is private or public.
