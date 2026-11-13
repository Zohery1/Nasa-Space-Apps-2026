# NASA Space Apps Hackathon — Master AI Rules (Antigravity & Codex Only)

This repository is strictly configured for **Google Antigravity (`agy`)** and **OpenAI Codex CLI (`codex`)**.

---

## 1. MANDATORY LAW: Zero-Hallucination & Absolute Truthfulness (Never Lie)
1. **Never fabricate execution or success:** NEVER claim `npm run build`, tests, or a feature works without actually executing the command and inspecting the exit code and real output.
2. **Evidence before assertions:** If you did not execute a verification tool, state that explicitly. Never claim "everything compiles cleanly" without running the build.
3. **No fabricated APIs or Data:** Never invent fake NASA endpoints, fake response schemas, or fake mock data out of thin air. ALL mission parameters, components, masses, orbits, formulas, and constraints are strictly locked to the 9 official NASA Challenge resources documented in `.agent/rules/nasa-data-integrity-lock.md`. Any external data or arbitrary numbers are strictly forbidden.
4. **Honest error reporting:** If a tool fails, a package is missing, an API rate-limits, or a type check errors, report the exact raw error immediately. Never hide, fake, or sugarcoat issues.
5. **No guessing library APIs:** Always verify external library syntax via `context7` MCP or official documentation. If unsure, admit uncertainty rather than hallucinating deprecated methods.

---

## 2. ROLE DISCOVERY & IDENTITY LOCK
At the start of any session, check `.role.json` (or the active branch / user prompt) to identify the developer's role:
- **Role 1 (Lead Game Dev):** `src/game/**` ONLY.
  - Skills: `.agent/skills/pixijs/` and `.agent/skills/pixijs-performance/`
  - PixiJS v8 Rule: ALWAYS use **PixiJS v8** syntax (`await app.init()`, `app.canvas`, `Assets.load()`). NEVER use v7 (`new PIXI.Application({...})`, `app.view`).
- **Role 2 (Data & Integration Eng):** `src/services/**`, `src/data/**`, `src/store/**` ONLY.
  - Skill: `.agent/skills/zustand/`
  - Rule: Keep high-frequency coordinates out of the store; use discrete event actions only.
- **Role 3 (UI/UX & Web Dev):** `src/components/**`, `src/audio/**`, `src/App.tsx` ONLY.
  - Skills: `.agent/skills/frontend-design/`, `.agent/skills/vercel-react-best-practices/`, and `.agent/skills/animation-performance/`
  - Audio: Follow `public/assets/audio/NASA_AUDIO_LIBRARY.md` to wire authentic NASA sound assets via Howler.js.
  - Rule: Maintain `pointer-events-none` on overlay roots, prevent unnecessary re-renders in HUD counters.
- **Role 4 (Pitch, Lore, Design & Assets):** `public/assets/**`, `README.md`, `src/config/constants.ts` (tuning only).
  - Skills: `.agent/skills/game-design-theory/` and `.agent/skills/sound-effects/`
  - Audio: Source real audio clips from `public/assets/audio/NASA_AUDIO_LIBRARY.md` (Apollo comms, countdown, plasma sounds).

If the user asks you to edit files outside the role's assigned folder, STOP and warn them immediately.

---

## 3. ARCHITECTURAL LAWS
1. **Max 180 lines per file:** Split into smaller modules if any file exceeds 180 lines.
2. **Zero React State in 60 FPS Loop:** Never store high-frequency entity positions or frame ticks inside React `useState`.
3. **One-Way Zustand Bridge:** PixiJS communicates with the UI strictly via `useGameStore.getState().actionName()`.
4. **Offline Resilience:** All network requests in `src/services/` must catch errors gracefully.

---

## 4. GIT TASK GUARD (STOP & MERGE PROTOCOL)
- Never work directly on `main` or `dev`.
- Branches must follow `feat/r<RoleNumber>-<task-name>` branched from the developer's base branch.
- **MANDATORY STOP ON TASK COMPLETION:** When the current task is verified with `npm run build`, REFUSE to start the next task until the branch is committed, pushed, and merged into `dev`.
- Execute `/finish-task` workflow to verify build and stage commits cleanly.

---

## 5. POST-MERGE SYNC & IMPACT DISPATCH (MANDATORY AFTER PULLING DEV)
Whenever changes are pulled or rebased from `origin/dev`:
1. Run `npm run impact-check` (or `/sync-impact` workflow).
2. The system automatically inspects `.role.json` and outputs **ONLY** that role's required integration tasks and changes.
3. Verify that `npm run build` passes with zero compilation errors before continuing feature work.
