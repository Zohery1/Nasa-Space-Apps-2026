export interface RectArea {
  id: string;
  name: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
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

export const DECK_WALKABLE_ZONES: readonly RectArea[] = [
  // 1. Central Hub
  { id: 'HUB', name: 'Airlock Hub', xMin: -60, xMax: 60, yMin: -60, yMax: 60 },
  // 2. Cockpit (Top)
  { id: 'COCKPIT', name: 'Bridge', xMin: -130, xMax: 130, yMin: -240, yMax: -100 },
  // 3. Science Lab (Left)
  { id: 'LAB', name: 'Science Lab', xMin: -240, xMax: -90, yMin: -80, yMax: 80 },
  // 4. CapCom / Avionics (Right)
  { id: 'CAPCOM', name: 'Avionics', xMin: 90, xMax: 240, yMin: -80, yMax: 80 },
  // 5. Engine Bay (Bottom)
  { id: 'ENGINE', name: 'Propulsion', xMin: -140, xMax: 140, yMin: 100, yMax: 240 },
  // 6. Airlock Corridors
  { id: 'DOOR_TOP', name: 'Cockpit Airlock', xMin: -18, xMax: 18, yMin: -100, yMax: -60 },
  { id: 'DOOR_LEFT', name: 'Lab Airlock', xMin: -90, xMax: -60, yMin: -18, yMax: 18 },
  { id: 'DOOR_RIGHT', name: 'CapCom Airlock', xMin: 60, xMax: 90, yMin: -18, yMax: 18 },
  { id: 'DOOR_BOTTOM', name: 'Engine Airlock', xMin: -18, xMax: 18, yMin: 60, yMax: 100 },
] as const;

export const STATIONS_CATALOG: readonly StationLocation[] = [
  {
    id: 'station_helm',
    roomId: 'COCKPIT',
    name: 'Helm Navigation Console',
    label: 'HELM CONSOLE',
    x: 0,
    y: -190,
    promptText: '[HOLD E] STEER / STABILIZE',
    themeColor: 0x38bdf8,
  },
  {
    id: 'station_power',
    roomId: 'CAPCOM',
    name: 'Power Distribution Matrix',
    label: 'POWER GRID',
    x: 170,
    y: -20,
    promptText: '[HOLD E] ROUTE POWER',
    themeColor: 0x06b6d4,
  },
  {
    id: 'station_o2',
    roomId: 'LAB',
    name: 'Emergency O2 Hand-Pump',
    label: 'O2 HAND-PUMP',
    x: -170,
    y: -20,
    promptText: '[HOLD E] PUMP OXYGEN',
    themeColor: 0x10b981,
  },
  {
    id: 'station_coolant',
    roomId: 'ENGINE_BAY',
    name: 'Fusion Coolant Relief Valve',
    label: 'COOLANT VALVE',
    x: 0,
    y: 165,
    promptText: '[HOLD E] REPAIR & VENT',
    themeColor: 0xf59e0b,
  },
] as const;

export const CREW_SPAWNS: Record<number, { x: number; y: number; role: string; sprite: string }> = {
  1: { x: 0, y: -150, role: 'CDR', sprite: '/assets/sprites/crew_commander.svg' },
  2: { x: 170, y: 0, role: 'CAP', sprite: '/assets/sprites/crew_capcom.svg' },
  3: { x: 0, y: 175, role: 'ENG', sprite: '/assets/sprites/crew_engineer.svg' },
  4: { x: -170, y: 0, role: 'SCI', sprite: '/assets/sprites/crew_science.svg' },
};
