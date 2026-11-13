import { CubeSatFormFactor } from '../types/cubesat';

/**
 * NASA Mission Configuration Persistence & Serialization Service
 * Grounded in Resource 1 (Mission Lifecycle) and Resource 7 (CubeSat Specification)
 */

export const STORAGE_KEY_MISSION_V1 = 'nasa_space_mission_profile_v1';

export interface PersistentMissionData {
  schemaVersion: '1.0.0';
  savedAt: string;
  missionName: string;
  busFormFactor: CubeSatFormFactor;
  selectedPayloadIds: string[];
  selectedSubsystemIds: string[];
  targetAltitudeKm: number;
  consumedDeltaVM_s: number;
}

const VALID_FORM_FACTORS: readonly CubeSatFormFactor[] = [
  '1U', '1.5U', '2U', '3U', '6U', '12U'
];

/**
 * Serializes mission state into a formatted JSON string
 */
export function exportMissionConfigJson(data: PersistentMissionData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Validates and imports mission configuration from raw JSON string
 */
export function importMissionConfigJson(rawJson: string): {
  success: boolean;
  data?: PersistentMissionData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Parsed content is not a valid JSON object.' };
    }

    if (!VALID_FORM_FACTORS.includes(parsed.busFormFactor)) {
      return { success: false, error: `Invalid CubeSat form factor: ${parsed.busFormFactor}` };
    }

    if (!Array.isArray(parsed.selectedPayloadIds) || !Array.isArray(parsed.selectedSubsystemIds)) {
      return { success: false, error: 'Payload and subsystem IDs must be arrays.' };
    }

    const validated: PersistentMissionData = {
      schemaVersion: '1.0.0',
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : new Date().toISOString(),
      missionName: typeof parsed.missionName === 'string' ? parsed.missionName : 'Unnamed Mission',
      busFormFactor: parsed.busFormFactor,
      selectedPayloadIds: parsed.selectedPayloadIds.filter((id: unknown) => typeof id === 'string'),
      selectedSubsystemIds: parsed.selectedSubsystemIds.filter((id: unknown) => typeof id === 'string'),
      targetAltitudeKm: Number(parsed.targetAltitudeKm) || 400,
      consumedDeltaVM_s: Number(parsed.consumedDeltaVM_s) || 0,
    };

    return { success: true, data: validated };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';
    return { success: false, error: `JSON parsing failed: ${msg}` };
  }
}

/**
 * Saves mission data to LocalStorage with fail-soft offline handling
 */
export function saveMissionToLocalStorage(data: PersistentMissionData): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const jsonStr = JSON.stringify(data);
    window.localStorage.setItem(STORAGE_KEY_MISSION_V1, jsonStr);
    return true;
  } catch {
    // Offline resilience: silent catch on quota or disabled storage
    return false;
  }
}

/**
 * Loads mission data from LocalStorage
 */
export function loadMissionFromLocalStorage(): PersistentMissionData | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY_MISSION_V1);
    if (!raw) return null;
    const result = importMissionConfigJson(raw);
    return result.success && result.data ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Clears mission cache from LocalStorage
 */
export function clearMissionLocalStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY_MISSION_V1);
    }
  } catch {
    // ignore
  }
}
