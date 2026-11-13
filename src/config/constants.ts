/**
 * Central Game Configuration & Constants (Role 4: Lore, Design & Tuning)
 * Master tuning for "100 Days to Orbit"
 */

export const APP_CONFIG = {
  FPS: 60,
  CANVAS: {
    BACKGROUND_COLOR: 0x030712,
    ANTIALIAS: true,
  },
} as const;

export const MISSION_CONFIG = {
  TITLE: '100 Days to Orbit',
  TOTAL_DAYS: 20,
  CRISIS_STAGES_COUNT: 4,
  STAGE_DURATION_SECONDS: 60,
  INITIAL_BUDGET_MILLIONS: 100,
  HOLD_INTERACT_DURATION_MS: 3000,
  OXYGEN: {
    MAX: 100,
    INITIAL: 100,
    DRAIN_RATE_BREACH: 2.5,
    REGEN_RATE_MANUAL: 4.0,
  },
  HULL: {
    MAX: 100,
    INITIAL: 100,
    METEOR_DAMAGE_SMALL: 10,
    METEOR_DAMAGE_LARGE: 35,
  },
} as const;

export const POWER_GRID_CONFIG = {
  MAX_ACTIVE_BUSES: 2,
  BUSES: ['ENGINES', 'LIFE_SUPPORT', 'SHIELDS', 'DOORS'] as const,
} as const;

export const SUBSYSTEM_CATALOG = {
  PROPULSION: [
    { id: 'prop_chem', name: 'Standard Ion Engine', cost: 30, massKg: 4200, powerKw: 20, warpChargeSec: 75 },
    { id: 'prop_fusion', name: 'High-Yield Fusion Drive', cost: 60, massKg: 8500, powerKw: 50, warpChargeSec: 50 },
  ],
  LIFE_SUPPORT: [
    { id: 'life_sabatier', name: 'Basic Sabatier Filter', cost: 20, massKg: 1800, powerKw: 15, o2BufferSec: 15 },
    { id: 'life_bioregen', name: 'Closed-Loop Biome Pod', cost: 50, massKg: 3900, powerKw: 40, o2BufferSec: 45 },
  ],
  SHIELDS: [
    { id: 'hull_whipple', name: 'Whipple Shielding', cost: 20, massKg: 2100, powerKw: 10, absorptionHits: 2 },
    { id: 'hull_heavy', name: 'Heavy Composite Armor', cost: 50, massKg: 6400, powerKw: 35, absorptionHits: 6 },
  ],
} as const;

export const CREW_ROLES = {
  1: { id: 'CDR', name: 'Commander', station: 'Cockpit', key: '1' },
  2: { id: 'CAP', name: 'CapCom', station: 'Avionics', key: '2' },
  3: { id: 'ENG', name: 'Flight Engineer', station: 'Engine Bay', key: '3' },
  4: { id: 'SCI', name: 'Science Specialist', station: 'Lab', key: '4' },
} as const;

export const NARRATIVE_STRINGS = {
  INTRO: [
    {
      slide: 1,
      title: 'The Cataclysm',
      text: 'Year 2145... Earth is dying. Atmospheric collapse is accelerating. Humanity has 100 days before the surface becomes uninhabitable.',
      audio: 'somber_alarm',
    },
    {
      slide: 2,
      title: 'The Last Hope',
      text: 'Our sole salvation lies on exoplanet Kepler-X. A crew of four specialists has been launched on a 20-day high-risk transit to certify habitability.',
      audio: 'apollo_countdown',
    },
    {
      slide: 3,
      title: 'The Fatal Flaw',
      text: 'In the frantic rush of departure, human error slipped past QA. The vessel is riddled with latent critical defects. Stand by for warp insertion!',
      audio: 'electrical_arc',
    },
  ],
  CRISES: [
    {
      stage: 1,
      days: 'Days 1-5',
      title: 'Pressure Shockwave',
      bark: 'WARNING: Engine valve seal failure! Hull breach detected in Engine Bay!',
    },
    {
      stage: 2,
      days: 'Days 6-10',
      title: 'Dense Meteor Storm',
      bark: 'ALERT: Guidance sensor blind. Incoming hypervelocity debris cluster!',
    },
    {
      stage: 3,
      days: 'Days 11-15',
      title: 'Coronal Mass Ejection',
      bark: 'CRITICAL: Solar thermal spike! Reroute power to cryo-coolers immediately!',
    },
    {
      stage: 4,
      days: 'Days 16-20',
      title: 'Atmospheric Insertion & Spore Toxin',
      bark: 'FINAL APPROACH: Bio-hazard in ventilation! Hold entry vector at all costs!',
    },
  ],
  VICTORY: {
    title: 'Kepler-X Orbital Insertion Achieved',
    subtext: 'Atmosphere certified habitable. Coordinates transmitted to Earth. Humanity will endure.',
  },
} as const;
