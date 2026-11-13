import { ConceptMaturityLevel, CMLReviewEvaluation } from '../types/cml';
import { CubeSatBusSpec } from '../types/cubesat';
import { ScienceInstrument, SpacecraftSubsystem } from '../types/instruments';

/**
 * JPL Concept Maturity Level (CML) Assessment Engine
 * Grounded in JPL Dataverse dataset (persistentId: hdl:2014/44299) - Resource 3
 */

export interface MissionDesignEvaluationInput {
  hasScienceGoal: boolean;
  bus: CubeSatBusSpec | null;
  instruments: ScienceInstrument[];
  subsystems: SpacecraftSubsystem[];
  hasSafetyInhibits: boolean;
  totalCostUSD: number;
  allocatedBudgetUSD: number;
}

export function evaluateCML(input: MissionDesignEvaluationInput): CMLReviewEvaluation {
  const blockingReasons: string[] = [];

  // Gate CML 1: Must define a primary science objective
  if (!input.hasScienceGoal) {
    return {
      achievedCML: 1,
      passedGates: false,
      massMarginActualPercent: 0,
      costReserveActualPercent: 0,
      blockingReasons: ['CML 1 Gate: Primary science goal must be selected.'],
    };
  }

  // Gate CML 2: Must select a baseline bus form factor
  if (!input.bus) {
    return {
      achievedCML: 1,
      passedGates: true,
      massMarginActualPercent: 0,
      costReserveActualPercent: 0,
      blockingReasons: ['CML 2 Gate: Spacecraft bus form factor must be identified.'],
    };
  }

  // Gate CML 3: Science Traceability Matrix (STM) - at least 1 instrument selected
  if (input.instruments.length === 0) {
    return {
      achievedCML: 2,
      passedGates: true,
      massMarginActualPercent: 0,
      costReserveActualPercent: 0,
      blockingReasons: ['CML 3 Gate: At least one science instrument must be selected to trace science objectives.'],
    };
  }

  // Calculate mass margin
  const totalMass =
    input.instruments.reduce((s, i) => s + i.massKg, 0) +
    input.subsystems.reduce((s, sub) => s + sub.massKg, 0);

  const massMarginActualPercent = input.bus.maxAllowableMassKg > 0
    ? Number((((input.bus.maxAllowableMassKg - totalMass) / input.bus.maxAllowableMassKg) * 100).toFixed(1))
    : 0;

  // Calculate cost reserves
  const costReserveActualPercent = input.allocatedBudgetUSD > 0
    ? Number((((input.allocatedBudgetUSD - input.totalCostUSD) / input.allocatedBudgetUSD) * 100).toFixed(1))
    : 0;

  // Gate CML 4: Point design requiring >= 20% mass margin and >= 25% cost reserve
  if (massMarginActualPercent < 20.0) {
    blockingReasons.push(`CML 4 Gate: Mass margin (${massMarginActualPercent}%) is below mandatory 20% reserve.`);
  }
  if (costReserveActualPercent < 25.0) {
    blockingReasons.push(`CML 4 Gate: Cost reserve (${costReserveActualPercent}%) is below mandatory 25% threshold.`);
  }
  if (!input.hasSafetyInhibits) {
    blockingReasons.push('CML 4 Gate: NASA CSLI safety inhibits (timers & 3 switches) must be configured.');
  }

  if (blockingReasons.length > 0) {
    return {
      achievedCML: 3,
      passedGates: false,
      massMarginActualPercent,
      costReserveActualPercent,
      blockingReasons,
    };
  }

  // Gate CML 5 & 6: Pre-Phase A to Phase A complete baseline
  if (massMarginActualPercent >= 30.0 && costReserveActualPercent >= 30.0 && input.subsystems.length >= 2) {
    return {
      achievedCML: 6,
      passedGates: true,
      massMarginActualPercent,
      costReserveActualPercent,
      blockingReasons: [],
    };
  }

  return {
    achievedCML: 4,
    passedGates: true,
    massMarginActualPercent,
    costReserveActualPercent,
    blockingReasons: [],
  };
}
