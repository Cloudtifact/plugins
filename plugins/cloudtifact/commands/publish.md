---
description: Publish an HTML page (or the page you just made) to Cloudy and share the link
argument-hint: "[file.html] [--public]"
---

Publish with Cloudy, following the cloudtifact skill.

- File: $ARGUMENTS. If no file is given, use the HTML page you made or edited most recently in this conversation. If there isn't one, ask which file to publish.
- Run `cloudy publish <file>` (add `--public` only if the user asked for a link anyone can open).
- Reply with the link(s) it prints, and say whether the page is private or public. If it joined an existing space (`Looks like "<space>"`), say which one.
