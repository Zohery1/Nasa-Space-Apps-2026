import { EARTH_RADIUS_KM, EARTH_MU_KM3_S2, calculateCircularOrbitalSpeed } from './orbitalPhysics';

/**
 * 2D Orbital Trajectory & Keplerian Motion Generator for PixiJS (60 FPS loop)
 * Grounded strictly in NASA mission-viz (Resource 5) and GMAT R2025a (Resource 2)
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface ScreenScaleConfig {
  originX: number;       // Center of Earth X in screen pixels
  originY: number;       // Center of Earth Y in screen pixels
  pixelsPerKm: number;   // Visual scale factor (e.g. 0.03 for LEO view)
}

export interface SatellitePosition extends Point2D {
  angleRad: number;
  speedKmS: number;
  altitudeKm: number;
  distanceFromCenterKm: number;
}

/**
 * Calculates orbital period in seconds using Kepler's Third Law
 * T = 2 * pi * sqrt(a^3 / mu)
 */
export function calculateOrbitalPeriodSeconds(altitudeKm: number): number {
  if (altitudeKm < 0) throw new Error('Altitude cannot be negative');
  const a = EARTH_RADIUS_KM + altitudeKm;
  return 2.0 * Math.PI * Math.sqrt(Math.pow(a, 3) / EARTH_MU_KM3_S2);
}

/**
 * Generates discrete points for a circular orbit path around Earth
 */
export function generateCircularOrbitPath(
  altitudeKm: number,
  scale: ScreenScaleConfig,
  numPoints: number = 64
): Point2D[] {
  const rKm = EARTH_RADIUS_KM + altitudeKm;
  const radiusPx = rKm * scale.pixelsPerKm;
  const points: Point2D[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2.0 * Math.PI;
    points.push({
      x: scale.originX + radiusPx * Math.cos(angle),
      y: scale.originY + radiusPx * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Generates points along a Hohmann elliptical transfer orbit between r1 and r2
 */
export function generateEllipticalTransferPath(
  periapsisAltKm: number,
  apoapsisAltKm: number,
  scale: ScreenScaleConfig,
  numPoints: number = 64
): Point2D[] {
  const rp = EARTH_RADIUS_KM + periapsisAltKm;
  const ra = EARTH_RADIUS_KM + apoapsisAltKm;
  const a = (rp + ra) / 2.0;
  const e = (ra - rp) / (ra + rp); // Orbital eccentricity
  const points: Point2D[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const trueAnomaly = (i / numPoints) * 2.0 * Math.PI;
    // Polar equation of an ellipse with focus at origin: r = a * (1 - e^2) / (1 + e * cos(nu))
    const rKm = (a * (1.0 - Math.pow(e, 2))) / (1.0 + e * Math.cos(trueAnomaly));
    const rPx = rKm * scale.pixelsPerKm;

    points.push({
      x: scale.originX + rPx * Math.cos(trueAnomaly),
      y: scale.originY + rPx * Math.sin(trueAnomaly),
    });
  }

  return points;
}

/**
 * Computes instantaneous satellite position at a given elapsed time (t seconds)
 * Zero React state — ideal for high-frequency PixiJS ticker updates
 */
export function getSatellitePositionAtTime(
  altitudeKm: number,
  timeSeconds: number,
  scale: ScreenScaleConfig
): SatellitePosition {
  const periodSeconds = calculateOrbitalPeriodSeconds(altitudeKm);
  const meanMotion = (2.0 * Math.PI) / periodSeconds; // Angular velocity omega (rad/s)
  const angleRad = (meanMotion * timeSeconds) % (2.0 * Math.PI);

  const rKm = EARTH_RADIUS_KM + altitudeKm;
  const rPx = rKm * scale.pixelsPerKm;
  const speedKmS = calculateCircularOrbitalSpeed(altitudeKm);

  return {
    x: scale.originX + rPx * Math.cos(angleRad),
    y: scale.originY + rPx * Math.sin(angleRad),
    angleRad,
    speedKmS,
    altitudeKm,
    distanceFromCenterKm: rKm,
  };
}
