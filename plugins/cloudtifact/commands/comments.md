---
description: Read the open Cloudtifact comments, fix what they ask for, then reply and resolve
argument-hint: "[--path file] [--space id]"
---

Work through the open comments on the Cloudtifact space for this repo or page, following the cloudtifact skill.

1. Run `cloudtifact comments --toon $ARGUMENTS` and read every open thread.
2. For each thread you can address: make the change, then `cloudtifact reply <commentId> "<what you changed>"` and `cloudtifact resolve <commentId>`.
3. If a comment needs a decision from the user, or you disagree, reply with your question or reason and leave it open.
4. Publish the changes (`cloudtifact push -m "<summary>"`, or publish the page again), unless hooks already push.
5. Finish with a short list: resolved, replied and left open, and anything you need from the user.
