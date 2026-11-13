import { EARTH_RADIUS_KM } from './orbitalPhysics';
import { calculateOrbitalPeriodSeconds } from './orbitalTrajectory';

/**
 * NASA Ground Segment & Communication Passes Service
 * Grounded in Resource 1 (NASA SP-2016-6105 Rev 2) and Resource 4 (GSFC MDL Communications)
 */

export type DownlinkBand = 'UHF' | 'S_Band' | 'X_Band' | 'Ka_Band';

export interface GroundStation {
  id: string;
  name: string;
  network: 'DSN' | 'NSN';
  latitudeDeg: number;
  longitudeDeg: number;
  supportedBands: DownlinkBand[];
  minElevationDeg: number; // NASA standard tracking mask is typically 10 deg
}

export const CANONICAL_GROUND_STATIONS: readonly GroundStation[] = [
  {
    id: 'DSN_GOLDSTONE',
    name: 'Goldstone Deep Space Communications Complex',
    network: 'DSN',
    latitudeDeg: 35.4267,
    longitudeDeg: -116.89,
    supportedBands: ['S_Band', 'X_Band', 'Ka_Band'],
    minElevationDeg: 10,
  },
  {
    id: 'DSN_MADRID',
    name: 'Madrid Deep Space Communications Complex',
    network: 'DSN',
    latitudeDeg: 40.4314,
    longitudeDeg: -4.248,
    supportedBands: ['S_Band', 'X_Band', 'Ka_Band'],
    minElevationDeg: 10,
  },
  {
    id: 'DSN_CANBERRA',
    name: 'Canberra Deep Space Communication Complex',
    network: 'DSN',
    latitudeDeg: -35.4014,
    longitudeDeg: 148.9817,
    supportedBands: ['S_Band', 'X_Band', 'Ka_Band'],
    minElevationDeg: 10,
  },
  {
    id: 'NSN_WALLOPS',
    name: 'NASA Wallops Flight Facility Station',
    network: 'NSN',
    latitudeDeg: 37.9402,
    longitudeDeg: -75.4664,
    supportedBands: ['UHF', 'S_Band'],
    minElevationDeg: 10,
  },
  {
    id: 'NSN_WHITE_SANDS',
    name: 'White Sands Complex Ground Station',
    network: 'NSN',
    latitudeDeg: 32.5408,
    longitudeDeg: -106.6111,
    supportedBands: ['S_Band', 'Ka_Band'],
    minElevationDeg: 10,
  },
] as const;

export const BAND_DATA_RATES_MBPS: Record<DownlinkBand, number> = {
  UHF: 0.0096,   // 9.6 kbps (Resource 7: CubeSat standard beacon)
  S_Band: 2.0,    // 2.0 Mbps (Resource 4: GSFC MDL Comms baseline)
  X_Band: 50.0,   // 50 Mbps (Resource 4: High-rate science telemetry)
  Ka_Band: 150.0, // 150 Mbps (Resource 1: High-throughput science downlink)
};

export interface ContactPassEstimate {
  stationId: string;
  stationName: string;
  band: DownlinkBand;
  maxPassDurationMinutes: number;
  maxDataCapacityMbits: number;
}

/**
 * Calculates max geometric contact duration (minutes) for a circular orbit pass directly overhead
 * Formula: lambda = acos( (Re / (Re + h)) * cos(elevation) ) - elevation
 * PassDuration = (lambda / pi) * OrbitalPeriod
 */
export function calculateMaxPassDurationMinutes(
  altitudeKm: number,
  minElevationDeg: number = 10
): number {
  if (altitudeKm <= 0) return 0;
  const elevRad = (minElevationDeg * Math.PI) / 180.0;
  const cosElev = Math.cos(elevRad);
  const ratio = (EARTH_RADIUS_KM / (EARTH_RADIUS_KM + altitudeKm)) * cosElev;
  if (ratio > 1.0) return 0;

  const lambdaCentralAngle = Math.acos(ratio) - elevRad;
  const periodSeconds = calculateOrbitalPeriodSeconds(altitudeKm);
  const passSeconds = (lambdaCentralAngle / Math.PI) * periodSeconds;

  return Number((passSeconds / 60.0).toFixed(2));
}

/**
 * Evaluates downlink potential across supported ground stations for a given orbit
 */
export function evaluateGroundPasses(
  altitudeKm: number,
  preferredBand: DownlinkBand
): ContactPassEstimate[] {
  const durationMin = calculateMaxPassDurationMinutes(altitudeKm, 10);
  const durationSec = durationMin * 60;
  const dataRateMbps = BAND_DATA_RATES_MBPS[preferredBand];

  return CANONICAL_GROUND_STATIONS.filter((station) =>
    station.supportedBands.includes(preferredBand)
  ).map((station) => ({
    stationId: station.id,
    stationName: station.name,
    band: preferredBand,
    maxPassDurationMinutes: durationMin,
    maxDataCapacityMbits: Number((durationSec * dataRateMbps).toFixed(2)),
  }));
}

/**
 * Simulates data buffer offload during a contact pass
 */
export function simulateDataOffload(
  initialBufferMbits: number,
  passDurationMinutes: number,
  band: DownlinkBand
): { remainingBufferMbits: number; transferredMbits: number } {
  const rateMbps = BAND_DATA_RATES_MBPS[band];
  const maxTransferable = passDurationMinutes * 60 * rateMbps;
  const transferred = Math.min(initialBufferMbits, maxTransferable);

  return {
    remainingBufferMbits: Number(Math.max(0, initialBufferMbits - transferred).toFixed(2)),
    transferredMbits: Number(transferred.toFixed(2)),
  };
}
