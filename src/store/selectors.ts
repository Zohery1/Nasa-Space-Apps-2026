import { RootStore } from './useGameStore';

/**
 * High-Performance Atomic Selectors for Role 3 (UI/UX)
 * Follows Zustand best practices: atomic picks prevent unnecessary React renders
 */

// Basic State Selectors
export const selectGameStatus = (state: RootStore) => state.status;
export const selectGameScore = (state: RootStore) => state.score;

// Flight Selectors (Discrete state updates only)
export const selectFlightStage = (state: RootStore) => state.flightStage;
export const selectConsumedDeltaV = (state: RootStore) => state.consumedDeltaVM_s;

// CML Selectors
export const selectCmlReview = (state: RootStore) => state.cmlReview;
export const selectAchievedCML = (state: RootStore): number => state.cmlReview?.achievedCML ?? 1;

// CubeSat Hardware Selectors
export const selectSelectedBus = (state: RootStore) => state.selectedBus;
export const selectInstalledInstruments = (state: RootStore) => state.installedInstruments;
export const selectInstalledSubsystems = (state: RootStore) => state.installedSubsystems;
export const selectCubeSatValidation = (state: RootStore) => state.cubeSatValidation;

// Crisis State Selectors
export const selectActiveCrisis = (state: RootStore) => state.activeCrisis;
export const selectIsCrisisActive = (state: RootStore) => state.isCrisisActive;
export const selectCrisisTimerSeconds = (state: RootStore) => state.crisisTimerSeconds;
export const selectOxygenLevelPercent = (state: RootStore) => state.oxygenLevelPercent;
export const selectInternalTemperature = (state: RootStore) => state.internalTemperatureCelsius;
export const selectHullIntegrityPercent = (state: RootStore) => state.hullIntegrityPercent;

// Power Routing Selectors
export const selectPoweredSystems = (state: RootStore) => state.poweredSystems;
export const selectLastRoutingError = (state: RootStore) => state.lastRoutingError;

// Flight Debrief & Ranking Selectors
export const selectLatestDebrief = (state: RootStore) => state.latestDebrief;
export const selectRankHistory = (state: RootStore) => state.rankHistory;

// Derived Atomic Selectors (Memoized calculations)
export const selectTotalInstrumentsMassKg = (state: RootStore): number => {
  return Number(
    state.installedInstruments
      .reduce((sum, item) => sum + item.massKg, 0)
      .toFixed(2)
  );
};

export const selectTotalSubsystemsMassKg = (state: RootStore): number => {
  return Number(
    state.installedSubsystems
      .reduce((sum, item) => sum + item.massKg, 0)
      .toFixed(2)
  );
};

export const selectTotalPowerDrawWatts = (state: RootStore): number => {
  const instrumentsPower = state.installedInstruments.reduce(
    (sum, item) => sum + item.powerWatts,
    0
  );
  const subsystemsPower = state.installedSubsystems.reduce(
    (sum, item) => sum + item.powerDrawWatts,
    0
  );
  return Number((instrumentsPower + subsystemsPower).toFixed(2));
};

export const selectHardwareMassMarginPercent = (state: RootStore): number => {
  if (!state.selectedBus) return 0;
  const maxMass = state.selectedBus.maxAllowableMassKg;
  const currentMass =
    selectTotalInstrumentsMassKg(state) + selectTotalSubsystemsMassKg(state);
  const margin = ((maxMass - currentMass) / maxMass) * 100.0;
  return Number(margin.toFixed(2));
};

export const selectIsLaunchReady = (state: RootStore): boolean => {
  if (!state.selectedBus || !state.cubeSatValidation) return false;
  return state.cubeSatValidation.isCompliant && state.flightStage === 'ON_PAD';
};
