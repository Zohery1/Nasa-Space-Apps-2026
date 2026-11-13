# 🚀 Master Game Design Document (GDD): 100 Days to Orbit
**Hackathon Final Specification Edition — NASA Space Apps**
**Lead Narrative & Mission Designer (Role 4)**

---

## 📖 1. Overview & Core Concept
- **Title:** `100 Days to Orbit`
- **Genre:** Co-operative / Solo-Swappable 2D Sci-Fi Emergency Survival Simulator
- **Platform:** Web (Vite + React 18 + PixiJS v8 + Zustand + Howler.js)
- **Engine Rules:** Max 180 lines per file, Zero React state in 60 FPS loop, One-way Zustand bridge.
- **Narrative Premise:** In 2145, Earth's biosphere suffers catastrophic collapse. The colony ship *Hope-1* is dispatched on an urgent 20-day transit toward habitable exoplanet *Kepler-X*. Due to hurried pre-launch maintenance by a distracted ground technician, hidden flaws trigger cascading emergencies across the 4 stages of transit.

---

## 🎬 2. Narrative Script & Slideshow Intro (In-Game English)
Format: Visual Novel / Slideshow sequence with typewriter text effect, ambient NASA audio, and SFX.

### Slide 1: The Cataclysm
- **Visual:** Scorched dying Earth, scarlet volcanic skies, cracked monitors broadcasting global evacuation broadcasts.
- **Audio Cue:** Radio static + distant Klaxon alarm + somber piano melody.
- **English Text:**
  > *"Year 2145... Earth is dying. Atmospheric collapse is accelerating. Humanity has 100 days before the surface becomes uninhabitable."*

### Slide 2: The Last Hope
- **Visual:** Gargantuan launch gantry at night. Starship *Hope-1* undergoing cryo-fueling under floodlights.
- **Audio Cue:** Apollo 11 countdown chatter + Quindar telemetry tones.
- **English Text:**
  > *"Our sole salvation lies on exoplanet Kepler-X. A crew of four specialists has been launched on a 20-day high-risk transit to certify habitability and prep for evacuation fleets."*

### Slide 3: The Fatal Oversight (The Twist)
- **Visual:** Close-up inside the propulsion bay during pre-launch checks. A technician wearing headphones listening to music overlooks an open pressure valve and a sparking high-voltage relay.
- **Audio Cue:** Muffled disco music through headphones interrupted by harsh electrical arc snap (`SNAP-SIZZLE`).
- **English Text:**
  > *"In the frantic chaos of departure, human error slipped past QA. The vessel is riddled with latent critical defects. Stand by for orbital warp insertion!"*

---

## 🛠️ 3. Pre-Flight Mission Engineering Phase (NASA Standards)
Implemented in accordance with NASA Systems Engineering (`NPR 7120.5F`) and GSFC Mission Design Lab trade-offs.

- **Total Budget:** $100M
- **Engineering Trilemma:** Mass vs Power vs Budget

| Subsystem | Option | Cost | Mass | Power Req | Gameplay Impact |
|---|---|---|---|---|---|
| **Propulsion** | Standard Chemical/Ion | $30M | 4,200 kg | Low (20 kW) | Long Warp charge time (75s crisis timer) |
| **Propulsion** | High-Yield Fusion | $60M | 8,500 kg | High (50 kW) | Fast Warp charge time (50s crisis timer) |
| **Life Support** | Basic Sabatier Scrubbers | $20M | 1,800 kg | Low (15 kW) | Rapid O2 depletion during cabin breaches |
| **Life Support** | Closed-Loop Bio-Regen | $50M | 3,900 kg | High (40 kW) | Stable O2 buffer; high generator drain |
| **Hull & Armor** | Whipple Micro-Shielding | $20M | 2,100 kg | Low (10 kW) | Breached after 2 projectile impacts |
| **Hull & Armor** | Reinforced Heavy Alloy | $50M | 6,400 kg | High (35 kW) | Absorbs 6+ impacts; reduces helm agility by 35% |

---

## 🗺️ 4. Spacecraft Deck Layout (Top-Down Level Design)
Single continuous 2D top-down view partitioned into four distinct modules connected by motorized airlock bulkheads:

1. **Cockpit / Bridge (Top):**
   - **Station:** Helm console (`E` to engage manual thrust/steering).
   - **Viewport:** Panoramic window displaying real-time cosmic environment (starfield, meteors, Kepler-X horizon).
2. **CapCom / Avionics Bay (Right):**
   - **Station:** Power Distribution Terminal (`E` to open routing matrix).
   - **Mechanism:** 4 power buses (Engines, Science/O2, Deflector Shields, Bulkhead Doors). Only **2** can be energized simultaneously.
3. **Science Lab & MedBay (Left):**
   - **Station:** Bio-synthesizer and manual O2 hand-pump (`Hold E`).
   - **Function:** Emergency oxygen generation during generator blackouts; antidote / radiation serum synthesis.
4. **Main Propulsion Bay (Bottom):**
   - **Station:** Fusion core generator, plasma coolant vents, hydraulic valves.
   - **Function:** Structural hull repair, fire suppression, heat venting (`Hold E` for 3–5 seconds).

---

## 👥 5. Crew Roles & Mechanics (4-Player Co-op / Solo Switcher)
In Solo Mode, switch active crew member instantly via keys `1`, `2`, `3`, `4`.

### 1. Commander (CDR) — Key `1`
- **Role:** Trajectory navigation & manual evasion.
- **Controls:** Interact with Helm (`E`), steer ship using `WASD` / Arrow keys to avoid hazards visible through viewport.

### 2. CapCom / Mission Specialist (CAP) — Key `2`
- **Role:** Power routing & tactical telemetry.
- **Controls:** Access avionics panel (`E`), toggle bus routing (Max 2 active allocations). Communicates power availability to team.

### 3. Flight Engineer (ENG) — Key `3`
- **Role:** Physical maintenance & emergency field repairs.
- **Controls:** Navigate interior (`WASD`), repair breached hulls, leaking valves, and electrical arcs (`Hold E` for 3–5s).

### 4. Science Specialist (SCI) — Key `4`
- **Role:** Environmental control, life support triage & medical injections.
- **Controls:** Manual O2 pumping in Lab (`Hold E`), administer healing/radiation stimpaks to crew (`E` adjacent to crewmate).

---

## 🔥 6. The 4 Crisis Stages (60-Second Loops)

### Stage 1: Pressure Shock (Days 1–5)
- **Root Cause:** Ground worker's open engine valve ruptures under warp load.
- **Hazards:** Engine room fire, hull breach decompression, auto-lockdown trapping Engineer.
- **Timeline:**
  - `00:00–00:10`: Helm destabilization; Commander must manually stabilize yaw/pitch.
  - `00:10–00:20`: Engine bulkhead auto-locks. CapCom must divert power from Science to Doors.
  - `00:20–00:40`: Engineer enters bay to weld valve (`Hold E`). Cabin O2 drops rapidly without power in Lab.
  - `00:40–00:50`: Science Specialist operates manual O2 hand-crank to sustain crew breathing.
  - `00:50–01:00`: Valve sealed. Warp drive re-engages!

### Stage 2: Meteor Field (Days 6–10)
- **Root Cause:** Damaged wire harness blinds auto-collision avoidance system.
- **Hazards:** High-density meteor shower. Small debris punch holes in hull; large asteroids inflict lethal hull damage.
- **Timeline:**
  - `00:00–00:60`: Commander dodges large boulders via Helm.
  - `Continuous`: CapCom routes power to directional shields facing incoming clusters.
  - `Continuous`: Engineer sprints through corridors welding micro-breaches before cabin vents into vacuum.
  - `00:60`: Flight computer finishes calculating exit trajectory vector.

### Stage 3: Coronal Mass Ejection / Solar Storm (Days 11–15)
- **Root Cause:** Passing through unshielded solar radiation zone.
- **Hazards:** Extreme thermal spike (`Hull Temp` gauge 0% -> 100%). Radiation sickness draining crew health.
- **Timeline:**
  - `00:00–00:20`: CapCom cuts door and navigation power; dedicates 100% power to Cryo-Coolers and Radiation Deflectors.
  - `00:20–00:40`: Doors unpowered; crew immobilized in current rooms. Science Specialist requests temporary door power to deliver anti-rad injections to Engineer & Commander.
  - `00:40–00:55`: Engineer manually vents thermal relief valves (`Hold E`).
  - `00:55–01:00`: Temperature normalizes. Core thermal critical cleared.

### Stage 4: Toxic Bio-Gas & Atmospheric Penetration (Days 16–20)
- **Root Cause:** Alien spores react with ship air scrubber ducts as Kepler-X orbit approaches.
- **Hazards:** Green neurotoxin slows movement speed by 50% and drains HP. Narrow atmospheric entry corridor.
- **Timeline:**
  - `00:00–00:25`: Science Specialist synthesizes neutralizer vaccine in Lab (`Hold E` for 15s).
  - `00:25–00:45`: Engineer takes antidote canister, treks through gas-filled corridor to Central Scrubber in Engine Room.
  - `00:30–00:60`: Commander pilots ship to stay inside a shifting atmospheric entry green target corridor on HUD.
  - `00:60`: Gas neutralized, entry angle locked. Ship punches through Kepler-X atmosphere to safety!

---

## 🏆 7. Mission Debrief & Victory Screen
- **Visual:** Serene panorama of Kepler-X's azure oceans and emerald continents viewed from low orbit.
- **Audio:** Victorious, hopeful piano & strings accompanied by Apollo "The Eagle has landed" static transmission.
- **English Debrief Text:**
  > *"Kepler-X confirmed habitable. Transmission of orbital coordinates to Earth successful. Humanity will endure."*
- **Crew Evaluation Grades:**
  - `Rank S`: 0 Hull breaches unresolved, >80% O2 retained, 0 crew incapacitations.
  - `Rank A`: <2 Breaches unresolved, >50% O2 retained.
  - `Rank B`: <4 Breaches, >25% O2 retained.
  - `Rank C / Survived`: Critical damage sustained, barely landed.
