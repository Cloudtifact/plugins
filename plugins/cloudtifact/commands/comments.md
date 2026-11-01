---
description: Read the open Cloudy comments, fix what they ask for, then reply and resolve
argument-hint: "[--path file] [--space id]"
---

Work through the open comments on the Cloudy space for this repo or page, following the cloudtifact skill.

1. Run `cloudy comments --toon $ARGUMENTS` and read every open thread.
2. For each thread you can address: make the change, then `cloudy reply <commentId> "<what you changed>"` and `cloudy resolve <commentId>`.
3. If a comment needs a decision from the user, or you disagree, reply with your question or reason and leave it open.
4. Publish the changes (`cloudy push -m "<summary>"`, or publish the page again), unless hooks already push.
5. Finish with a short list: resolved, replied and left open, and anything you need from the user.
