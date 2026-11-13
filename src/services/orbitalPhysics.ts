/**
 * NASA Orbital Mechanics & Delta-V Calculations
 * Grounded strictly in GMAT R2025a (Resource 2: GSC-19468-1)
 */

export const EARTH_MU_KM3_S2 = 398600.4418; // Earth gravitational parameter mu (km^3/s^2)
export const EARTH_RADIUS_KM = 6378.137;   // WGS-84 / GMAT Earth equatorial radius (km)
export const STANDARD_GRAVITY_M_S2 = 9.80665; // g0 standard acceleration of gravity (m/s^2)

export interface HohmannTransferResult {
  deltaV1_km_s: number;
  deltaV2_km_s: number;
  totalDeltaV_km_s: number;
  totalDeltaV_m_s: number;
  transferTimeSeconds: number;
}

/**
 * Calculates orbital velocity at given altitude using Vis-Viva equation
 * v = sqrt(mu * (2/r - 1/a)) -> for circular orbit a = r, v = sqrt(mu / r)
 */
export function calculateCircularOrbitalSpeed(altitudeKm: number): number {
  if (altitudeKm < 0) throw new Error('Altitude cannot be negative');
  const r = EARTH_RADIUS_KM + altitudeKm;
  return Math.sqrt(EARTH_MU_KM3_S2 / r); // km/s
}

/**
 * Computes Coplanar Hohmann Transfer between two circular orbits (r1 -> r2)
 */
export function calculateHohmannTransfer(
  initialAltitudeKm: number,
  targetAltitudeKm: number
): HohmannTransferResult {
  const r1 = EARTH_RADIUS_KM + initialAltitudeKm;
  const r2 = EARTH_RADIUS_KM + targetAltitudeKm;

  // Semi-major axis of transfer ellipse
  const aTransfer = (r1 + r2) / 2.0;

  // Speeds at periapsis and apoapsis of transfer orbit
  const v1Circular = Math.sqrt(EARTH_MU_KM3_S2 / r1);
  const vTransfer1 = Math.sqrt(EARTH_MU_KM3_S2 * (2.0 / r1 - 1.0 / aTransfer));
  const deltaV1 = Math.abs(vTransfer1 - v1Circular);

  const v2Circular = Math.sqrt(EARTH_MU_KM3_S2 / r2);
  const vTransfer2 = Math.sqrt(EARTH_MU_KM3_S2 * (2.0 / r2 - 1.0 / aTransfer));
  const deltaV2 = Math.abs(v2Circular - vTransfer2);

  const totalDeltaV = deltaV1 + deltaV2;
  const transferTimeSeconds = Math.PI * Math.sqrt(Math.pow(aTransfer, 3) / EARTH_MU_KM3_S2);

  return {
    deltaV1_km_s: deltaV1,
    deltaV2_km_s: deltaV2,
    totalDeltaV_km_s: totalDeltaV,
    totalDeltaV_m_s: totalDeltaV * 1000.0,
    transferTimeSeconds,
  };
}

/**
 * Tsiolkovsky Rocket Equation: deltaV = Isp * g0 * ln(m0 / mf)
 * Returns deltaV in m/s
 */
export function calculateTsiolkovskyDeltaV(
  ispSeconds: number,
  dryMassKg: number,
  propellantMassKg: number
): number {
  if (dryMassKg <= 0 || propellantMassKg < 0 || ispSeconds <= 0) return 0;
  const m0 = dryMassKg + propellantMassKg;
  const mf = dryMassKg;
  return ispSeconds * STANDARD_GRAVITY_M_S2 * Math.log(m0 / mf);
}

/**
 * Computes required propellant mass for a target delta-V (m/s)
 * mf * (exp(deltaV / (Isp * g0)) - 1)
 */
export function calculateRequiredPropellantMass(
  targetDeltaVm_s: number,
  ispSeconds: number,
  dryMassKg: number
): number {
  if (ispSeconds <= 0 || dryMassKg <= 0 || targetDeltaVm_s <= 0) return 0;
  const exponent = targetDeltaVm_s / (ispSeconds * STANDARD_GRAVITY_M_S2);
  return dryMassKg * (Math.exp(exponent) - 1.0);
}
