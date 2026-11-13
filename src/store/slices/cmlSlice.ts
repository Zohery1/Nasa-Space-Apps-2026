import { StateCreator } from 'zustand';
import { CMLReviewEvaluation } from '../../types/cml';
import { evaluateCML } from '../../services/cmlEvaluator';
import { MissionSlice } from './missionSlice';
import { CubeSatSlice } from './cubesatSlice';

export interface CMLSlice {
  cmlReview: CMLReviewEvaluation | null;
  evaluateCurrentCML: () => CMLReviewEvaluation;
}

export const createCMLSlice: StateCreator<
  MissionSlice & CubeSatSlice & CMLSlice,
  [],
  [],
  CMLSlice
> = (set, get) => ({
  cmlReview: null,

  evaluateCurrentCML: () => {
    const {
      selectedGoalId,
      selectedBus,
      installedInstruments,
      installedSubsystems,
      physicalInhibitsCount,
      deployablesTimerSeconds,
      rfSilenceTimerSeconds,
      allocatedBudgetUSD,
    } = get();

    const hasSafetyInhibits =
      physicalInhibitsCount >= 3 &&
      deployablesTimerSeconds >= 1800 &&
      rfSilenceTimerSeconds >= 2700;

    // Approximate cost: base bus + instruments ($250k each) + subsystems ($150k each)
    const baseCostUSD = selectedBus ? 200000 : 0;
    const instrumentsCost = installedInstruments.length * 250000;
    const subsystemsCost = installedSubsystems.length * 150000;
    const totalCostUSD = baseCostUSD + instrumentsCost + subsystemsCost;

    const evaluation = evaluateCML({
      hasScienceGoal: Boolean(selectedGoalId),
      bus: selectedBus,
      instruments: installedInstruments,
      subsystems: installedSubsystems,
      hasSafetyInhibits,
      totalCostUSD,
      allocatedBudgetUSD,
    });

    set({ cmlReview: evaluation });
    return evaluation;
  },
});
