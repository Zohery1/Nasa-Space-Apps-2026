# 🚀 NASA NEO Defender — Planetary Defense Simulator

> 2D Real-Time Orbital Defense Simulation Game powered by live **NASA NeoWs** (Near Earth Object Web Service) telemetry data.
> Built for **NASA Space Apps Hackathon (48h)**.

---

## 🛠️ Tech Stack & Engine
- **Engine / Rendering**: [PixiJS v8](https://pixijs.com/) (High-performance WebGL 2D engine)
- **UI & HUD Overlay**: React 18 + Tailwind CSS + Framer Motion
- **State Management**: Zustand (`src/store/useGameStore.ts`)
- **Data Caching & Offline Resilience**: TanStack Query v5 + NASA NeoWs API
- **Audio**: Howler.js
- **Bundler & Tooling**: Vite + TypeScript

---

## 👥 Team Territories & Boundaries
To prevent git merge conflicts and ensure parallel execution:
| Role | Title | Territory Folder | Key Responsibility |
|---|---|---|---|
| **Role 1** | Lead Game Dev | `src/game/**` | PixiJS v8 Canvas, Ticker, Physics, Asteroid Spawner, Collisions, Lasers |
| **Role 2** | Data & Integration Eng | `src/services/**`, `src/data/**`, `src/store/**` | NASA NeoWs API, TanStack Query, offline mock fallback, Zustand Store |
| **Role 3** | UI/UX & Web Dev | `src/components/**`, `src/audio/**`, `src/App.tsx` | HUD Overlay, Live NASA Telemetry Card, Game Over Modal, SFX, Tailwind |
| **Role 4** | Pitch, Story & Assets | `public/assets/**`, `README.md`, `constants.ts` | Lore, AI Assets (sprites/audio), Game Balancing, Pitch Deck, Video Demo |

*Note: `src/types/asteroid.ts` is the shared immutable data contract.*

---

## 💻 Machine Setup & Quickstart (Today & Tomorrow)

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x+` (`node -v && npm -v`)
- **Git**: Installed and configured (`git --version`)

### 2. Setup Project
```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd nasa-neo-defender

# Checkout the active development branch
git checkout dev

# Install dependencies
npm install

# Test compilation
npm run build

# Start local development server
npm run dev
```

### 3. Context7 MCP Setup
This project mandates the **Context7-First Rule**: AI agents must query live documentation via `context7` MCP before generating library code.
- Ensure `.mcp.json` is present in the repository root.
- For Codex CLI users: verify `~/.codex/config.toml` includes:
  ```toml
  [mcp_servers.context7]
  command = "npx"
  args = ["-y", "@upstash/context7-mcp@latest"]
  ```

### 4. NASA API Key
Register for a free key at [https://api.nasa.gov/](https://api.nasa.gov/) to get 1,000 req/hr.
Create `.env.local`:
```bash
VITE_NASA_API_KEY=your_registered_key_here
```
*(If omitted, the app automatically falls back to `mockNeoData.json` with zero errors).*

---

## 🔄 Daily Workflow for Each Task
1. **Pull latest integration code:**
   ```bash
   git checkout dev && git pull origin dev
   ```
2. **Create feature branch:**
   ```bash
   git checkout -b feat/r1-player-movement   # Replace r1 with your role number
   ```
3. **Execute task with your AI Agent** (`Antigravity` or `Codex`).
4. **Finish task & verify:**
   Run the `/finish-task` workflow:
   ```bash
   npm run build
   git add .
   git commit -m "feat(role): summary of changes"
   git push -u origin HEAD
   ```
5. **Open Pull Request to `dev`** and merge.
