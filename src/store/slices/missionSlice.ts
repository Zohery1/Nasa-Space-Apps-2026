import { StateCreator } from 'zustand';
import { ScienceGoalId } from '../../types/optics';
import { MissionPhase } from '../../types/mission';

export interface MissionSlice {
  selectedGoalId: ScienceGoalId | null;
  selectedOrbitAltitudeKm: number;
  missionPhase: MissionPhase;
  allocatedBudgetUSD: number;
  setScienceGoal: (goalId: ScienceGoalId | null) => void;
  setOrbitAltitude: (altitudeKm: number) => void;
  setMissionPhase: (phase: MissionPhase) => void;
  setAllocatedBudget: (budgetUSD: number) => void;
}

export const createMissionSlice: StateCreator<
  MissionSlice,
  [],
  [],
  MissionSlice
> = (set) => ({
  selectedGoalId: 'EXOPLANETS',
  selectedOrbitAltitudeKm: 550, // Standard LEO altitude in km
  missionPhase: 'Phase_PreA_ConceptStudies',
  allocatedBudgetUSD: 5000000, // $5M typical SmallSat / CSLI research envelope
  setScienceGoal: (selectedGoalId) => set({ selectedGoalId }),
  setOrbitAltitude: (selectedOrbitAltitudeKm) => set({ selectedOrbitAltitudeKm }),
  setMissionPhase: (missionPhase) => set({ missionPhase }),
  setAllocatedBudget: (allocatedBudgetUSD) => set({ allocatedBudgetUSD }),
});
