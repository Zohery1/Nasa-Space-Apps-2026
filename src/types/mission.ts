/**
 * NASA Systems Engineering Mission Types (Resource 1: Design & Develop Science Missions)
 * Grounded in NASA SP-2016-6105 Rev 2 & NPR 7120.5F / NPR 7120.8A
 */

export type MissionPhase =
  | 'Phase_PreA_ConceptStudies'
  | 'Phase_A_ConceptDevelopment'
  | 'Phase_B_PreliminaryDesign'
  | 'Phase_C_FinalDesign'
  | 'Phase_D_SystemAssembly'
  | 'Phase_E_Operations'
  | 'Phase_F_Closeout';

export interface LaunchSegment {
  launchVehicleId: string;
  vehicleName: string;
  payloadCapacityLEO_kg: number;
  payloadCapacitySSO_kg: number;
  fairingDiameter_m: number;
  fairingHeight_m: number;
  estimatedCostUSD: number;
}

export interface GroundSegment {
  networkName: 'DSN' | 'NSN' | 'Commercial_Ground';
  groundStationLocations: string[];
  supportedBands: Array<'UHF' | 'S_Band' | 'X_Band' | 'Ka_Band'>;
  maxDailyContactPasses: number;
  contactDurationMinutes: number;
}

export interface UserSegment {
  scienceDisciplines: string[];
  decadalSurveyPriorities: string[];
  dataArchivingCenter: string; // e.g. NASA PDS, MAST, HEASARC
}

export interface ScienceMissionDefinition {
  id: string;
  name: string;
  primaryObjective: string;
  phase: MissionPhase;
  launchSegment: LaunchSegment;
  groundSegment: GroundSegment;
  userSegment: UserSegment;
}
