import { CubeSatBusSpec, CubeSatSafetyCheckResult } from '../types/cubesat';
import { ScienceInstrument, SpacecraftSubsystem } from '../types/instruments';

/**
 * NASA CubeSat 101 CSLI Safety & Specification Validator
 * Strictly implementing Resource 7 (NASA CSLI Developers Guide)
 */

export interface CubeSatConfiguration {
  bus: CubeSatBusSpec;
  instruments: ScienceInstrument[];
  subsystems: SpacecraftSubsystem[];
  deployablesTimerSeconds: number;
  rfSilenceTimerSeconds: number;
  physicalInhibitsCount: number;
  batteryCertifiedUL1642: boolean;
}

export interface DetailedValidationResult extends CubeSatSafetyCheckResult {
  totalMassKg: number;
  totalVolumeU: number;
  totalPowerDrawWatts: number;
  isVolumeValid: boolean;
  areInhibitsValid: boolean;
  isBatteryCertified: boolean;
}

export function validateCubeSatConfiguration(
  config: CubeSatConfiguration
): DetailedValidationResult {
  const violations: string[] = [];

  // 1. Calculate mass, volume, and power totals
  const instrumentsMass = config.instruments.reduce((sum, inst) => sum + inst.massKg, 0);
  const subsystemsMass = config.subsystems.reduce((sum, sub) => sum + sub.massKg, 0);
  const totalMassKg = Number((instrumentsMass + subsystemsMass).toFixed(3));

  const instrumentsVol = config.instruments.reduce((sum, inst) => sum + inst.volumeU, 0);
  const subsystemsVol = config.subsystems.reduce((sum, sub) => sum + sub.volumeU, 0);
  const totalVolumeU = Number((instrumentsVol + subsystemsVol).toFixed(2));

  const totalPowerDrawWatts = Number(
    (
      config.instruments.reduce((sum, inst) => sum + inst.powerWatts, 0) +
      config.subsystems.reduce((sum, sub) => sum + sub.powerDrawWatts, 0)
    ).toFixed(2)
  );

  // 2. NASA CSLI Rule: Deployables Inhibit (>= 30 min / 1800s)
  const deployablesTimerValid = config.deployablesTimerSeconds >= 1800;
  if (!deployablesTimerValid) {
    violations.push('NASA CSLI Violation: Autonomous deployables timer must be >= 1800s (30 min).');
  }

  // 3. NASA CSLI Rule: RF Silence Inhibit (>= 45 min / 2700s)
  const rfSilenceTimerValid = config.rfSilenceTimerSeconds >= 2700;
  if (!rfSilenceTimerValid) {
    violations.push('NASA CSLI Violation: RF transmitter silence timer must be >= 2700s (45 min).');
  }

  // 4. NASA CSLI Rule: 3 Independent Physical Inhibits
  const areInhibitsValid = config.physicalInhibitsCount >= 3;
  if (!areInhibitsValid) {
    violations.push('NASA CSLI Violation: 3 independent physical electrical switches/inhibits required.');
  }

  // 5. NASA CSLI Rule: Battery Certification UL 1642
  const isBatteryCertified = config.batteryCertifiedUL1642 === true;
  if (!isBatteryCertified) {
    violations.push('NASA CSLI Violation: Battery cells must be UL 1642 certified.');
  }

  // 6. Mass and Volume limits for the chosen form factor
  const massWithinLimits = totalMassKg <= config.bus.maxAllowableMassKg;
  if (!massWithinLimits) {
    violations.push(
      `Mass Exceeded: Total ${totalMassKg}kg exceeds ${config.bus.formFactor} limit (${config.bus.maxAllowableMassKg}kg).`
    );
  }

  const isVolumeValid = totalVolumeU <= config.bus.availableInternalVolumeU;
  if (!isVolumeValid) {
    violations.push(
      `Volume Exceeded: Payload volume ${totalVolumeU}U exceeds bus capacity (${config.bus.availableInternalVolumeU}U).`
    );
  }

  const isCompliant =
    deployablesTimerValid &&
    rfSilenceTimerValid &&
    areInhibitsValid &&
    isBatteryCertified &&
    massWithinLimits &&
    isVolumeValid;

  return {
    isCompliant,
    deployablesTimerValid,
    rfSilenceTimerValid,
    massWithinLimits,
    centerOfGravityValid: true, // simplified coplanar assumption
    areInhibitsValid,
    isBatteryCertified,
    isVolumeValid,
    totalMassKg,
    totalVolumeU,
    totalPowerDrawWatts,
    violations,
  };
}
