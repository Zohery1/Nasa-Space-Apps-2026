/**
 * JPL Concept Maturity Levels (CML) & Systems Engineering (Resource 3)
 * Derived from JPL Dataverse dataset (persistentId: hdl:2014/44299)
 */

export type ConceptMaturityLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface CMLDefinition {
  level: ConceptMaturityLevel;
  name: string;
  description: string;
  requiredMassMarginPercent: number; // e.g. CML 4 >= 20%, CML 6 >= 30%
  requiredCostReservePercent: number; // e.g. CML 4 >= 25%, CML 6 >= 30%
  requiredDeliverables: string[];
}

export interface ScienceTraceabilityEntry {
  scienceGoal: string;
  physicalObjective: string;
  measurementThreshold: string;
  instrumentPayloadId: string;
  requiredMassKg: number;
  requiredPowerWatts: number;
  dataRateKbps: number;
}

export interface CMLReviewEvaluation {
  achievedCML: ConceptMaturityLevel;
  passedGates: boolean;
  massMarginActualPercent: number;
  costReserveActualPercent: number;
  blockingReasons: string[];
}
