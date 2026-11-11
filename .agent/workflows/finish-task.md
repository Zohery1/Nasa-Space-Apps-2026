---
description: Verify TypeScript compilation, commit task, rebase on dev, and push.
---

1. Run short git status to confirm no out-of-territory files were touched:
   `git status --short`
2. Run build verification:
   `npm run build`
3. If build fails, fix errors first. Never push broken code.
4. Stage and commit:
   `git add .`
   `git commit -m "feat(role): <concise summary of completed task>"`
5. Fetch and rebase dev:
   `git fetch origin dev && git rebase origin/dev`
6. Push branch:
   `git push -u origin HEAD`
7. Halt and instruct developer to merge PR into `dev` on GitHub before beginning next task.
