# Git Guard Rules (Stop & Merge Protocol)

1. **Branching Enforcement:**
   - NEVER commit code while on `main` or `dev`.
   - Feature branches MUST follow:
     - Role 1: `feat/r1-<task-description>`
     - Role 2: `feat/r2-<task-description>`
     - Role 3: `feat/r3-<task-description>`
     - Role 4: `feat/r4-<task-description>`

2. **Single Task Lifespan:**
   - A branch must only cover a single task from the roadmap.
   - Once `npm run build` succeeds, the agent must halt and request a commit + merge before picking up a new task.

3. **Workflow Invocation:**
   - Trigger the `/finish-task` workflow to rebase and push cleanly to origin.
