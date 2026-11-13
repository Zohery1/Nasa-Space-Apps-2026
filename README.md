# 🚀 100 Days to Orbit — NASA Space Apps Challenge

> **Co-operative & Solo Emergency Survival Simulator in Deep Space**
> Built with PixiJS v8, React 18, Zustand, Tailwind CSS, and authentic NASA audio telemetry.
> Configured exclusively for **Google Antigravity (`agy`)** and **OpenAI Codex CLI (`codex`)**.

---

## 🌌 The Narrative Pitch
Year 2145. Earth's biosphere is undergoing irreversible collapse, leaving humanity with only 100 days to vacate. The colony starship **Hope-1** has been launched on an urgent 20-day transit toward exoplanet **Kepler-X** with four specialized crew members.

In the frantic pre-launch scramble, maintenance oversights left latent engineering defects across the ship's propulsion and life support systems. Players must coordinate across 4 high-stakes crisis stages (60 seconds each) to balance power, suppress fires, weld breaches, pump oxygen, and survive the journey to Kepler-X.

---

## 👥 Crew Roles & Gameplay Mechanics

| Role | Station | Key Responsibility | Controls |
|---|---|---|---|
| **Commander (CDR)** | Cockpit | Manual helm steering & trajectory alignment | `WASD` / Arrow keys at Helm |
| **CapCom (CAP)** | Avionics Bay | Tactical power distribution (Max 2 active buses) | `E` to toggle power routes |
| **Flight Engineer (ENG)** | Engine Room | Physical welding, fire extinguishing & pressure venting | `WASD` to move, `Hold E` (3–5s) to repair |
| **Science Specialist (SCI)** | Med & Life Lab | Manual O2 pumping & radiation stimpak injections | `Hold E` at O2 station, `E` to heal crew |

*Solo mode allows instant switching between crew members using keys `1`, `2`, `3`, and `4`.*

---

## 🔥 The 4 Crisis Stages (Transit Loop)

1. **Days 1–5: Pressure Shockwave**: An open maintenance valve ruptures under warp strain. The engine room ignites, doors lockdown, and oxygen rapidly escapes into vacuum.
2. **Days 6–10: Dense Meteor Storm**: Burned guidance wiring forces manual evasive steering through a high-velocity asteroid field while routing shields.
3. **Days 11–15: Coronal Mass Ejection**: Severe solar thermal spike threatens hull liquefaction; crew must vent heat valves and inject radiation counters.
4. **Days 16–20: Atmospheric Insertion & Spore Toxin**: Alien spores invade life support systems as the ship approaches Kepler-X; the crew synthesizes an antidote while locking the precise atmospheric entry corridor.

---

## 🔬 NASA Scientific Rigor & Canonical Source Locking
All engineering constraints, mission budgeting, and subsystems in *100 Days to Orbit* are verifiably locked to the 9 official NASA Space Apps Challenge resources:
- **NASA Systems Engineering Handbook (`NPR 7120.5F`)**: $100M pre-flight mission engineering trade-offs (Mass vs Power vs Reserves).
- **NASA GSFC Mission Design Lab (MDL)**: 16 spacecraft engineering disciplines (ADCS, Thermal Balance, Power EPS, Avionics).
- **GMAT R2025a (`GSC-19468-1`)**: Realistic orbital insertion physics and delta-v constraints.
- **JWST "Build It Yourself"**: Exoplanet atmospheric transit detection and habitability certification.
- **NASA Audio Archive**: Authentic Quindar telemetry tones, Apollo 11 countdown chatter, and Voyager plasma sounds via Howler.js.

---

## 🛠️ Tech Stack & Engine
- **2D Rendering Engine**: [PixiJS v8](https://pixijs.com/) (Async WebGL/WebGPU pipeline)
- **UI & HUD Overlay**: React 18 + Tailwind CSS + Framer Motion
- **State Management**: Zustand atomic stores (`src/store/useGameStore.ts`)
- **Data Caching & API Client**: TanStack Query v5
- **Audio Engine**: Howler.js with authentic NASA public-domain audio
- **Bundler & Tooling**: Vite + TypeScript

---

## 👥 Team Territories & Multi-Agent Boundaries
| Role | Title | Territory Folder | Key Responsibility |
|---|---|---|---|
| **Role 1** | Lead Game Dev | `src/game/**` | PixiJS v8 Canvas, Ticker, 2D Entities, Movement, Physics Loop |
| **Role 2** | Data & Integration Eng | `src/services/**`, `src/data/**`, `src/store/**` | NASA APIs, TanStack Query, Zustand State Store & Data Pipeline |
| **Role 3** | UI/UX & Web Dev | `src/components/**`, `src/audio/**`, `src/App.tsx` | HUD Overlays, Modals, Menus, SFX Integration, Tailwind Styling |
| **Role 4** | Pitch, Story & Assets | `public/assets/**`, `README.md`, `constants.ts` | Game Lore, Visual/Audio Assets, Gameplay Balancing, Pitch Deck |

---

## 💻 Machine Setup & Quickstart

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd nasa

# Checkout development branch
git checkout dev

# Install dependencies
npm install

# Test compilation
npm run build

# Start local development server
npm run dev
```

---

## 📜 Complete Game Design Document (GDD)
Read the full technical specification at [`public/assets/lore/GDD.md`](public/assets/lore/GDD.md).
