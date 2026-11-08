---
name: get-started
description: First steps with Cloudy after it's added. Check the person is signed in, show which workspace new pages go to, and publish a first page with them.
---

# Get started with Cloudy

Cloudy gives a page a stable link that people can open and comment on. Help the person publish their first page.

1. Call `list_workspaces`. Say who they're signed in as and name the workspace new pages go to (the first one they
   can edit). If they belong to more than one, ask which to use.
2. Ask what they'd like to publish: something from this chat, or a short page you write with them. Keep it to one
   page.
3. Write it as one self-contained HTML file (`index.html`). Show them the title you'll use, then call
   `publish_page`. New pages are private to their workspace. Only ask for a public link if they say they want one.
4. Give them the link `publish_page` returns. Tell them that people they share it with can leave comments, and that
   they can come back and say "what did people say?" to read them.

If `list_workspaces` fails because they aren't signed in, ask them to connect Cloudy again from the plugin's
settings. Don't ask for a password or a key: signing in happens on a Cloudy page.
