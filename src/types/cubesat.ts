/**
 * NASA CubeSat 101 CSLI Standard Types (Resource 7)
 * Directly citing NASA CubeSat 101 Guide (CSLI) standards & safety inhibits
 */

export type CubeSatFormFactor = '1U' | '1.5U' | '2U' | '3U' | '6U' | '12U';

export interface CubeSatDimensionsMm {
  x: number; // width mm
  y: number; // length mm
  z: number; // height mm
}

export interface CubeSatBusSpec {
  formFactor: CubeSatFormFactor;
  dimensionsMm: CubeSatDimensionsMm;
  maxAllowableMassKg: number;
  availableInternalVolumeU: number;
  maxSolarPowerWatts: number;
  maxBatteryCapacityWh: number;
  deployablesTimerSeconds: number; // Mandatory >= 1800s (30 min)
  rfSilenceTimerSeconds: number;    // Mandatory >= 2700s (45 min)
  batteryCertification: 'UL_1642';
  requiredInhibitsCount: 3;
}

export interface CubeSatSafetyCheckResult {
  isCompliant: boolean;
  deployablesTimerValid: boolean;
  rfSilenceTimerValid: boolean;
  massWithinLimits: boolean;
  centerOfGravityValid: boolean;
  violations: string[];
}
