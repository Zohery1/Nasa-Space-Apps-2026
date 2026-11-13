import { EARTH_RADIUS_KM } from './orbitalPhysics';
import { calculateOrbitalPeriodSeconds } from './orbitalTrajectory';

/**
 * NASA Space Apps — Power EPS & Thermal Eclipse Balance Service
 * Grounded in Resource 4 (NASA GSFC MDL Disciplines) and Resource 7 (CubeSat 101)
 */

export const SOLAR_CONSTANT_W_M2 = 1361.0; // Solar irradiance at 1 AU (W/m^2)
export const TRIPLE_JUNCTION_EFFICIENCY = 0.295; // 29.5% GaAs solar cell efficiency
export const MAX_LEO_BATTERY_DOD_PERCENT = 30.0; // NASA GSFC MDL requirement: DoD <= 30% for LEO

export interface EclipseDurationResult {
  orbitalPeriodMinutes: number;
  sunlightMinutes: number;
  eclipseMinutes: number;
  eclipseFraction: number;
}

export interface BatteryDoDEvaluation {
  depthOfDischargePercent: number;
  isDoDCompliant: boolean;
  energyConsumedWh: number;
  remainingCapacityWh: number;
  warnings: string[];
}

/**
 * Calculates orbital eclipse time using cylindrical Earth shadow geometry
 * Fraction of orbit in umbra: theta = asin(Re / (Re + h)) -> Fraction = theta / pi
 */
export function calculateOrbitalEclipse(altitudeKm: number): EclipseDurationResult {
  if (altitudeKm <= 0) {
    return { orbitalPeriodMinutes: 0, sunlightMinutes: 0, eclipseMinutes: 0, eclipseFraction: 0 };
  }

  const periodSec = calculateOrbitalPeriodSeconds(altitudeKm);
  const periodMin = periodSec / 60.0;
  const rTotal = EARTH_RADIUS_KM + altitudeKm;
  const shadowHalfAngleRad = Math.asin(Math.min(1.0, EARTH_RADIUS_KM / rTotal));
  const eclipseFraction = shadowHalfAngleRad / Math.PI;

  const eclipseMinutes = periodMin * eclipseFraction;
  const sunlightMinutes = periodMin - eclipseMinutes;

  return {
    orbitalPeriodMinutes: Number(periodMin.toFixed(2)),
    sunlightMinutes: Number(sunlightMinutes.toFixed(2)),
    eclipseMinutes: Number(eclipseMinutes.toFixed(2)),
    eclipseFraction: Number(eclipseFraction.toFixed(4)),
  };
}

/**
 * Calculates solar array electrical generation power (Watts)
 * P = S0 * Area * Efficiency * cos(SunAngle)
 */
export function calculateSolarArrayGenerationWatts(
  panelAreaM2: number,
  sunIncidenceAngleDeg: number = 0
): number {
  if (panelAreaM2 <= 0) return 0;
  const angleRad = (Math.abs(sunIncidenceAngleDeg) * Math.PI) / 180.0;
  const cosineFactor = Math.max(0, Math.cos(angleRad));

  const power = SOLAR_CONSTANT_W_M2 * panelAreaM2 * TRIPLE_JUNCTION_EFFICIENCY * cosineFactor;
  return Number(power.toFixed(2));
}

/**
 * Evaluates Battery Depth of Discharge (DoD) during orbital night
 * Strictly enforces NASA GSFC MDL rule: DoD <= 30% to prevent rapid battery degradation
 */
export function evaluateBatteryDoD(
  batteryCapacityWh: number,
  powerDrawWatts: number,
  eclipseDurationMinutes: number
): BatteryDoDEvaluation {
  if (batteryCapacityWh <= 0) {
    return {
      depthOfDischargePercent: 100,
      isDoDCompliant: false,
      energyConsumedWh: 0,
      remainingCapacityWh: 0,
      warnings: ['Battery capacity must be greater than zero.'],
    };
  }

  const eclipseHours = Math.max(0, eclipseDurationMinutes) / 60.0;
  const energyConsumedWh = Math.max(0, powerDrawWatts) * eclipseHours;
  const dodPercent = (energyConsumedWh / batteryCapacityWh) * 100.0;
  const remainingCapacityWh = Math.max(0, batteryCapacityWh - energyConsumedWh);

  const warnings: string[] = [];
  const isDoDCompliant = dodPercent <= MAX_LEO_BATTERY_DOD_PERCENT;

  if (!isDoDCompliant) {
    warnings.push(
      `Battery Depth of Discharge (${dodPercent.toFixed(1)}%) exceeds NASA limit of ${MAX_LEO_BATTERY_DOD_PERCENT}%. Risk of battery failure!`
    );
  }

  if (remainingCapacityWh <= 0) {
    warnings.push('CRITICAL: Complete battery depletion during eclipse. Spacecraft blackout.');
  }

  return {
    depthOfDischargePercent: Number(dodPercent.toFixed(2)),
    isDoDCompliant,
    energyConsumedWh: Number(energyConsumedWh.toFixed(2)),
    remainingCapacityWh: Number(remainingCapacityWh.toFixed(2)),
    warnings,
  };
}

/**
 * Computes net power balance over one complete orbit
 */
export function calculateOrbitalNetEnergyWh(
  generationWatts: number,
  consumptionWatts: number,
  altitudeKm: number
): { netEnergyWh: number; isEnergyPositive: boolean } {
  const { sunlightMinutes, eclipseMinutes } = calculateOrbitalEclipse(altitudeKm);
  const energyGeneratedWh = generationWatts * (sunlightMinutes / 60.0);
  const energyConsumedWh = consumptionWatts * ((sunlightMinutes + eclipseMinutes) / 60.0);
  const netEnergyWh = energyGeneratedWh - energyConsumedWh;

  return {
    netEnergyWh: Number(netEnergyWh.toFixed(2)),
    isEnergyPositive: netEnergyWh >= 0,
  };
}
