import { StateCreator } from 'zustand';

/**
 * NASA Space Apps — Flight Trajectory & Delta-V Slice
 * Citing Resource 8 (Flight Profiles) and Resource 2 (GMAT Delta-V Budget)
 */

export type FlightStage =
  | 'ON_PAD'
  | 'ASCENT'
  | 'STAGE_SEPARATION'
  | 'ORBIT_INSERTION'
  | 'DEPLOYED'
  | 'SCIENCE_OPERATIONS';

export const FLIGHT_STAGES: readonly FlightStage[] = [
  'ON_PAD',
  'ASCENT',
  'STAGE_SEPARATION',
  'ORBIT_INSERTION',
  'DEPLOYED',
  'SCIENCE_OPERATIONS',
] as const;

export interface FlightSlice {
  flightStage: FlightStage;
  consumedDeltaVM_s: number;
  advanceFlightStage: () => void;
  resetFlightStage: () => void;
  expendDeltaV: (amount_m_s: number) => void;
}

export const createFlightSlice: StateCreator<
  FlightSlice,
  [],
  [],
  FlightSlice
> = (set) => ({
  flightStage: 'ON_PAD',
  consumedDeltaVM_s: 0,

  advanceFlightStage: () =>
    set((state) => {
      const currentIndex = FLIGHT_STAGES.indexOf(state.flightStage);
      if (currentIndex >= 0 && currentIndex < FLIGHT_STAGES.length - 1) {
        return { flightStage: FLIGHT_STAGES[currentIndex + 1] };
      }
      return {};
    }),

  resetFlightStage: () =>
    set({
      flightStage: 'ON_PAD',
      consumedDeltaVM_s: 0,
    }),

  expendDeltaV: (amount_m_s: number) =>
    set((state) => {
      if (!Number.isFinite(amount_m_s) || amount_m_s <= 0) {
        return {};
      }
      const current = Number.isFinite(state.consumedDeltaVM_s) ? state.consumedDeltaVM_s : 0;
      return {
        consumedDeltaVM_s: Number((current + amount_m_s).toFixed(2)),
      };
    }),
});
