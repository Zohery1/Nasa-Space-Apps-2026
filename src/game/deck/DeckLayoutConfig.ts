export interface RectArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  borderColor: number;
}

export interface StationLocation {
  id: string;
  roomId: string;
  name: string;
  label: string;
  x: number;
  y: number;
  promptText: string;
  themeColor: number;
}

export interface WallSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const DECK_ROOMS: readonly RectArea[] = [
  {
    id: 'COCKPIT',
    name: 'BRIDGE / COCKPIT',
    x: -170,
    y: -280,
    width: 340,
    height: 150,
    color: 0x0a192f,
    borderColor: 0x38bdf8,
  },
  {
    id: 'CAPCOM',
    name: 'CapCom / AVIONICS',
    x: 80,
    y: -90,
    width: 170,
    height: 180,
    color: 0x082f49,
    borderColor: 0x06b6d4,
  },
  {
    id: 'LAB',
    name: 'SCIENCE LAB & MED',
    x: -250,
    y: -90,
    width: 170,
    height: 180,
    color: 0x064e3b,
    borderColor: 0x10b981,
  },
  {
    id: 'ENGINE_BAY',
    name: 'MAIN PROPULSION BAY',
    x: -170,
    y: 110,
    width: 340,
    height: 160,
    color: 0x451a03,
    borderColor: 0xf59e0b,
  },
  {
    id: 'AIRLOCK_HUB',
    name: 'CENTRAL AIRLOCK HUB',
    x: -60,
    y: -60,
    width: 120,
    height: 120,
    color: 0x0f172a,
    borderColor: 0x64748b,
  },
] as const;

export const STATIONS_CATALOG: readonly StationLocation[] = [
  {
    id: 'station_helm',
    roomId: 'COCKPIT',
    name: 'Helm Navigation Console',
    label: 'HELM CONSOLE',
    x: 0,
    y: -235,
    promptText: '[HOLD E] STEER / STABILIZE',
    themeColor: 0x38bdf8,
  },
  {
    id: 'station_power',
    roomId: 'CAPCOM',
    name: 'Power Distribution Matrix',
    label: 'POWER GRID',
    x: 165,
    y: 0,
    promptText: '[HOLD E] ROUTE POWER',
    themeColor: 0x06b6d4,
  },
  {
    id: 'station_o2',
    roomId: 'LAB',
    name: 'Emergency O2 Hand-Pump',
    label: 'O2 HAND-PUMP',
    x: -165,
    y: 0,
    promptText: '[HOLD E] PUMP OXYGEN',
    themeColor: 0x10b981,
  },
  {
    id: 'station_coolant',
    roomId: 'ENGINE_BAY',
    name: 'Fusion Coolant Relief Valve',
    label: 'COOLANT VALVE',
    x: 0,
    y: 195,
    promptText: '[HOLD E] VENT COOLANT / REPAIR',
    themeColor: 0xf59e0b,
  },
] as const;

export const CREW_SPAWNS: Record<number, { x: number; y: number; role: string }> = {
  1: { x: 0, y: -190, role: 'CDR' },
  2: { x: 130, y: 0, role: 'CAP' },
  3: { x: 0, y: 150, role: 'ENG' },
  4: { x: -130, y: 0, role: 'SCI' },
};
