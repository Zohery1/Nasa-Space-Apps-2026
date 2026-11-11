# NASA Space Apps Hackathon — Master AI Rules (Antigravity & Codex Only)

This repository is strictly configured for **Google Antigravity (`agy`)** and **OpenAI Codex CLI (`codex`)**.

---

## 1. MANDATORY LAW: Zero-Hallucination & Absolute Truthfulness (Never Lie)
1. **Never fabricate execution or success:** NEVER claim `npm run build`, tests, or a feature works without actually executing the command and inspecting the exit code and real output.
2. **Evidence before assertions:** If you did not execute a verification tool, state that explicitly. Never claim "everything compiles cleanly" without running the build.
3. **No fabricated APIs or Data:** Never invent fake NASA endpoints, fake response schemas, or fake mock data out of thin air unless explicitly instructed by the user.
4. **Honest error reporting:** If a tool fails, a package is missing, an API rate-limits, or a type check errors, report the exact raw error immediately. Never hide, fake, or sugarcoat issues.
5. **No guessing library APIs:** Always verify external library syntax via `context7` MCP or official documentation. If unsure, admit uncertainty rather than hallucinating deprecated methods.

---

## 2. MANDATORY SKILLS & CONTEXT7 COMPLIANCE
Before writing or refactoring code involving external libraries, the agent MUST consult the repository skills located in `.agent/skills/` and query live documentation via `context7` MCP:

- **Role 1 (Lead Game Dev):**
  - Skills: `.agent/skills/pixijs/` and `.agent/skills/pixijs-performance/`
  - PixiJS v8 Rule: ALWAYS use **PixiJS v8** syntax (`await app.init()`, `app.canvas`, `Assets.load()`). NEVER use v7 (`new PIXI.Application({...})`, `app.view`).
- **Role 2 (Data & Integration Eng):**
  - Skill: `.agent/skills/zustand/`
  - Rule: Keep high-frequency coordinates out of the store; use discrete event actions only.
- **Role 3 (UI/UX & Web Dev):**
  - Skills: `.agent/skills/frontend-design/`, `.agent/skills/vercel-react-best-practices/`, and `.agent/skills/animation-performance/`
  - Audio: Follow `public/assets/audio/NASA_AUDIO_LIBRARY.md` to wire authentic NASA sound assets via Howler.js.
  - Rule: Maintain `pointer-events-none` on overlay roots, prevent unnecessary re-renders in HUD counters.
- **Role 4 (Pitch, Lore, Design & Assets):**
  - Skills: `.agent/skills/game-design-theory/` and `.agent/skills/sound-effects/`
  - Audio: Source real audio clips from `public/assets/audio/NASA_AUDIO_LIBRARY.md` (Apollo comms, countdown, plasma sounds).

---

## 3. STRICT FOLDER OWNERSHIP (TERRITORY LOCK)
Verify the developer's role before modifying any file:
- **Role 1 (Lead Game Dev):** `src/game/**` ONLY.
- **Role 2 (Data & Integration Eng):** `src/services/**`, `src/data/**`, `src/store/**` ONLY.
- **Role 3 (UI/UX & Web Dev):** `src/components/**`, `src/audio/**`, `src/App.tsx` ONLY.
- **Role 4 (Pitch, Lore & Assets):** `public/assets/**`, `README.md`, `src/config/constants.ts` (tuning only).
- **Shared Immutable Contracts:** Any file in `src/types/**` is strictly read-only after team consensus.

If the user asks you to edit files outside the role's assigned folder, STOP and warn them immediately.

---

## 4. ARCHITECTURAL LAWS
1. **Max 180 lines per file:** Split into smaller modules if any file exceeds 180 lines.
2. **Zero React State in 60 FPS Loop:** Never store high-frequency entity positions or frame ticks inside React `useState`.
3. **One-Way Zustand Bridge:** PixiJS communicates with the UI strictly via `useGameStore.getState().actionName()`.
4. **Offline Resilience:** All network requests in `src/services/` must catch errors gracefully.

---

## 5. GIT TASK GUARD (STOP & MERGE PROTOCOL)
- Never work directly on `main` or `dev`.
- Branches must follow `feat/r<RoleNumber>-<task-name>` branched from the developer's base branch.
- **MANDATORY STOP ON TASK COMPLETION:** When the current task is verified with `npm run build`, REFUSE to start the next task until the branch is committed, pushed, and merged into `dev`.
- Execute `/finish-task` workflow to verify build and stage commits cleanly.

---

## 6. POST-MERGE SYNC & IMPACT ANALYSIS (MANDATORY AFTER PULLING DEV)
Whenever changes are pulled or rebased from `origin/dev`:
1. Run `npm run build` immediately to verify zero compilation breakages.
2. Analyze incoming commits (`git log -n 3 --oneline --stat`):
   - **Role 1:** Check if `useGameStore.ts` added new actions to invoke from the PixiJS game loop.
   - **Role 3:** Check if `useGameStore.ts` added new state variables to render in the React HUD.
   - **All Roles:** Check if `src/config/constants.ts` or `src/types/` changed.
3. Emit a concise integration brief outlining teammates' changes and any necessary local adjustments.
