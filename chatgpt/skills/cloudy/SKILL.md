---
name: cloudy
description: Publish and update pages on Cloudy, and work through the comments people leave on them. Use when the person asks to publish, share or update a page, or asks what people said about one.
---

# Cloudy

Cloudy keeps pages at a stable link. Each publish is a new version at the same link; earlier versions stay.

## Publish

- New page: write a self-contained HTML page and call `publish_page` with it as `html` (other files it loads go in
  `files`) and no `space_id`. Give the person the link it returns.
- New pages are private to the workspace. Pass `public: true` only when the person asks for a public link.
- Before filing it in a folder, call `list_folders` and read what each folder is for.

## Update a page

1. Find it: `find_spaces` with words from its title, or the link the person gave you.
2. Read its open comments first (`list_comments`): they're often why it's being changed.
3. Read the files you'll change (`read_file`), change only what was asked, and call `publish_page` with the same
   `space_id`. The link stays the same.

## Comments

- "What did people say?": `list_comments`, then summarise each open thread with who wrote it.
- After you change something a comment asked for, `reply_to_comment` with what you changed, then `resolve_comment`.
  Only resolve threads you addressed. If you disagree or need input, reply and leave it open.
- Fix your own reply with `edit_comment` instead of adding another.

## Don't

- Don't delete anything. There's no tool for it: only people delete, in Cloudy.
- Don't change visibility, move, rename or archive unless the person asked.
- Every change shows in the workspace's Activity under the person's name, with Undo.
