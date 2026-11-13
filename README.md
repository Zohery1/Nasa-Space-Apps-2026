# 🚀 NASA Space Apps Hackathon — Foundation & Multi-Agent Workspace

> High-Performance 2D Web Game Starter (Vite + React 18 + PixiJS v8 + TanStack Query + Zustand + Tailwind CSS).
> Configured exclusively for **Google Antigravity (`agy`)** and **OpenAI Codex CLI (`codex`)**.

---

## 🛠️ Tech Stack & Engine
- **Engine / 2D Rendering**: [PixiJS v8](https://pixijs.com/) (Async WebGL/WebGPU pipeline)
- **UI & HUD Overlay**: React 18 + Tailwind CSS + Framer Motion
- **State Management**: Zustand (`src/store/useGameStore.ts`)
- **Data Caching & API Client**: TanStack Query v5
- **Audio Engine**: Howler.js
- **Bundler & Tooling**: Vite + TypeScript

---

## 👥 Team Territories & Boundaries
To eliminate git merge conflicts and ensure parallel development:
| Role | Title | Territory Folder | Key Responsibility |
|---|---|---|---|
| **Role 1** | Lead Game Dev | `src/game/**` | PixiJS v8 Canvas, Ticker, 2D Entities, Movement, Physics Loop |
| **Role 2** | Data & Integration Eng | `src/services/**`, `src/data/**`, `src/store/**` | NASA APIs, TanStack Query, Zustand State Store & Data Pipeline |
| **Role 3** | UI/UX & Web Dev | `src/components/**`, `src/audio/**`, `src/App.tsx` | HUD Overlays, Modals, Menus, SFX Integration, Tailwind Styling |
| **Role 4** | Pitch, Story & Assets | `public/assets/**`, `README.md`, `constants.ts` | Game Lore, Visual/Audio Assets, Gameplay Balancing, Pitch Deck, Demo Video |

*Note: `src/types/**` contains shared immutable contracts agreed upon by the team.*

---

## 📜 Core AI Agent Laws (Antigravity & Codex)
1. **Zero-Hallucination & NASA Data Integrity Lock**: Agents must never lie, fabricate mock data, or invent parameters. All components, masses, orbits, formulas, and constraints are strictly locked to the 9 official NASA Challenge resources (`.agent/rules/nasa-data-integrity-lock.md`). Verify with `npm run validate:data`.
2. **Context7-First Rule**: Agents must query live documentation via `context7` MCP before generating third-party library code (`pixi.js`, `zustand`, `@tanstack/react-query`).
3. **Territory Lock**: Agents refuse to modify files outside the user's assigned role folder.
4. **Git Task Guard**: Every feature requires a dedicated branch (`feat/rX-<task>`). Running `/finish-task` verifies build, commits, rebases on `dev`, and pushes.

---

## 💻 Machine Setup & Quickstart

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x+` (`node -v && npm -v`)
- **Git**: Installed and configured (`git --version`)

### 2. Setup Project
```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd nasa

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
- The file `.mcp.json` is already present in the repository root for Antigravity.
- For Codex CLI users: verify `~/.codex/config.toml` includes:
  ```toml
  [mcp_servers.context7]
  command = "npx"
  args = ["-y", "@upstash/context7-mcp@latest"]

  [mcp_servers.filesystem]
  command = "npx"
  args = ["-y", "@modelcontextprotocol/server-filesystem", "."]
  ```

---

## 🔄 Daily Workflow for Each Task
1. **Pull latest integration code:**
   ```bash
   git checkout dev && git pull origin dev
   ```
2. **Create feature branch:**
   ```bash
   git checkout -b feat/r1-task-name   # Replace r1 with your role number
   ```
3. **Execute task with Antigravity (`agy`) or Codex CLI (`codex`).**
4. **Finish task & verify:**
   Run the `/finish-task` workflow:
   ```bash
   npm run build
   git add .
   git commit -m "feat(role): summary of changes"
   git push -u origin HEAD
   ```
5. **Open Pull Request to `dev`** and merge.
