import { StateCreator } from 'zustand';

/**
 * NASA Space Apps — 4 Crisis States & Resource Degradation Slice
 * Grounded in Resource 4 (GSFC MDL Disciplines: ECLSS, Thermal, Power)
 */

export type CrisisType =
  | 'OXYGEN_LEAK'
  | 'THERMAL_RUNAWAY'
  | 'POWER_GRID_FAILURE'
  | 'HULL_BREACH';

export const NOMINAL_TEMPERATURE_C = 21.0;
export const CRISIS_COUNTDOWN_SECONDS = 60;

export interface CrisisSlice {
  activeCrisis: CrisisType | null;
  isCrisisActive: boolean;
  crisisTimerSeconds: number;
  oxygenLevelPercent: number;
  oxygenLeakRatePerSecond: number;
  internalTemperatureCelsius: number;
  temperatureDriftRatePerSecond: number;
  hullIntegrityPercent: number;

  triggerCrisis: (type: CrisisType) => void;
  tickCrisis: (deltaSeconds: number) => void;
  patchOxygenLeak: (amountRecovered?: number) => void;
  stabilizeTemperature: () => void;
  repairHull: (amountRecovered?: number) => void;
  resolveCrisis: () => void;
  resetCrisisState: () => void;
}

export const createCrisisSlice: StateCreator<
  CrisisSlice,
  [],
  [],
  CrisisSlice
> = (set, get) => ({
  activeCrisis: null,
  isCrisisActive: false,
  crisisTimerSeconds: CRISIS_COUNTDOWN_SECONDS,
  oxygenLevelPercent: 100.0,
  oxygenLeakRatePerSecond: 0,
  internalTemperatureCelsius: NOMINAL_TEMPERATURE_C,
  temperatureDriftRatePerSecond: 0,
  hullIntegrityPercent: 100.0,

  triggerCrisis: (type: CrisisType) => {
    let o2Leak = 0;
    let tempDrift = 0;

    switch (type) {
      case 'OXYGEN_LEAK':
        o2Leak = 1.25; // 1.25% per second (~75% over 60s)
        break;
      case 'THERMAL_RUNAWAY':
        tempDrift = 0.65; // +0.65 C per second (~+39 C over 60s)
        break;
      case 'HULL_BREACH':
        o2Leak = 1.8;
        tempDrift = -0.5; // Rapid cooling into vacuum
        break;
      case 'POWER_GRID_FAILURE':
        tempDrift = -0.3; // Heaters offline
        break;
    }

    set({
      activeCrisis: type,
      isCrisisActive: true,
      crisisTimerSeconds: CRISIS_COUNTDOWN_SECONDS,
      oxygenLeakRatePerSecond: o2Leak,
      temperatureDriftRatePerSecond: tempDrift,
    });
  },

  tickCrisis: (deltaSeconds: number) => {
    const state = get();
    if (!state.isCrisisActive || deltaSeconds <= 0) return;

    const newTimer = Math.max(0, state.crisisTimerSeconds - deltaSeconds);
    const newO2 = Math.max(
      0,
      state.oxygenLevelPercent - state.oxygenLeakRatePerSecond * deltaSeconds
    );
    const newTemp =
      state.internalTemperatureCelsius +
      state.temperatureDriftRatePerSecond * deltaSeconds;

    set({
      crisisTimerSeconds: Number(newTimer.toFixed(1)),
      oxygenLevelPercent: Number(newO2.toFixed(1)),
      internalTemperatureCelsius: Number(newTemp.toFixed(1)),
    });
  },

  patchOxygenLeak: (amountRecovered = 20) => {
    set((state) => ({
      oxygenLeakRatePerSecond: 0,
      oxygenLevelPercent: Math.min(100, state.oxygenLevelPercent + amountRecovered),
    }));
  },

  stabilizeTemperature: () => {
    set({
      temperatureDriftRatePerSecond: 0,
      internalTemperatureCelsius: NOMINAL_TEMPERATURE_C,
    });
  },

  repairHull: (amountRecovered = 25) => {
    set((state) => ({
      hullIntegrityPercent: Math.min(100, state.hullIntegrityPercent + amountRecovered),
      oxygenLeakRatePerSecond: 0,
    }));
  },

  resolveCrisis: () => {
    set({
      activeCrisis: null,
      isCrisisActive: false,
      oxygenLeakRatePerSecond: 0,
      temperatureDriftRatePerSecond: 0,
    });
  },

  resetCrisisState: () => {
    set({
      activeCrisis: null,
      isCrisisActive: false,
      crisisTimerSeconds: CRISIS_COUNTDOWN_SECONDS,
      oxygenLevelPercent: 100.0,
      oxygenLeakRatePerSecond: 0,
      internalTemperatureCelsius: NOMINAL_TEMPERATURE_C,
      temperatureDriftRatePerSecond: 0,
      hullIntegrityPercent: 100.0,
    });
  },
});
