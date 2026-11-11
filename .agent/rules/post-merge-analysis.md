# Post-Merge Sync & Cross-Role Impact Analysis Protocol

## Purpose
Prevent regression and silent breakages when teammates merge changes into `dev`. Every agent must perform this analytical check immediately after pulling from `origin/dev`.

---

## 1. Mandatory Post-Sync Workflow
Whenever the developer pulls or rebases `origin/dev`:
```bash
git fetch origin dev && git rebase origin/dev
```

Run the automated dispatcher:
```bash
npm run impact-check
# Or in Antigravity:
/sync-impact
```

---

## 2. Automated Role-Specific Dispatch Actions

When `npm run impact-check` executes, it analyzes all modified files and dispatches specific tasks:

### 👨💻 Role 1 (Lead Game Dev):
- **Store Changes (`src/store/**`):** Identifies new store actions (e.g. `addScore`, `damagePlayer`, `nextWave`) that must be triggered from PixiJS collision/ticker events.
- **Contract Changes (`src/types/**`):** Updates internal entity properties and math to match new shared schemas.
- **Balancing Changes (`src/config/constants.ts`):** Recalibrates movement speeds, projectile cooldowns, and physics damping.
- **Sprite Assets (`public/assets/sprites/**`):** Instantiates new textures via `Assets.load()`.

### 🔌 Role 2 (Data & Integration Eng):
- **Contract Changes (`src/types/**`):** Updates API parser output and TanStack Query transformer to match new contract fields.
- **Store Changes:** Ensures store actions mutate state cleanly and exposes needed selectors.

### 🎨 Role 3 (UI/UX & Web Dev):
- **Store Changes (`src/store/**`):** Binds newly added state variables into reactive HUD components, telemetry cards, and modals.
- **Audio Assets (`public/assets/audio/**`):** Instantiates Howler sound channels and wires audio triggers to discrete store events.
- **Canvas Viewports:** Verifies `pointer-events-none` on overlay roots so canvas input is unblocked.

### 📝 Role 4 (Pitch, Lore, Design & Assets):
- **Balancing Tuning (`src/config/constants.ts`):** Adjusts gameplay difficulty curves based on playtesting feedback.
- **Asset Fulfillment (`public/assets/**`):** Generates missing sprites or procures authentic NASA audio clips requested by Role 1 or Role 3.

---

## 3. Mandatory Build Guard
The dispatcher automatically runs `npm run build`. If any compilation error occurs, the agent **MUST STOP** and resolve it before proceeding with any new feature work.
