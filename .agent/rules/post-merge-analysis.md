# Post-Merge Sync & Cross-Role Impact Analysis Protocol

## Purpose
Prevent regression and silent breakages when teammates merge changes into `dev`. Every agent must perform this analytical check immediately after pulling from `origin/dev`.

---

## 1. Mandatory Post-Sync Workflow
Whenever the developer pulls or rebases `origin/dev`:
```bash
git fetch origin dev && git rebase origin/dev
```

The agent MUST automatically:
1. **Run Build Verification:**
   Execute `npm run build`. If it fails, report the exact TypeScript compiler output and fix integration mismatches before continuing feature work.
2. **Perform Impact Analysis:**
   Inspect the incoming commits (`git log -n 3 --oneline --stat`):
   - **Contract & Store Impact (`src/types/**`, `src/store/**`):**
     - Did Role 2 add or modify state properties in `useGameStore.ts`?
     - *For Role 1 (Game Dev):* Identify new actions to trigger from the game loop (`damagePlayer`, `nextWave`, etc.).
     - *For Role 3 (UI/UX):* Identify new state variables to render in the HUD or telemetry cards.
   - **Tuning Impact (`src/config/constants.ts`):**
     - Did Role 4 calibrate entity speeds, HP, cooldowns, or colors? Confirm that local game math uses these updated constants.
   - **Asset Impact (`public/assets/**`):**
     - Are new sprites (`public/assets/sprites/`) or authentic NASA audio files (`public/assets/audio/`) ready for `Assets.load()` or `Howler` instantiation?
3. **Emit Integration Brief:**
   Provide the developer with a concise 3-bullet summary:
   - **What landed in `dev`:** Brief summary of teammates' merged work.
   - **Impact on current role:** Concrete integration points or adjustments needed.
   - **Build status:** Exit code and verification confirmation.
