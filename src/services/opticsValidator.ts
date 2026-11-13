import {
  ScienceGoalId,
  WavelengthBand,
  OpticalConfiguration,
  NASAFlagshipId,
  TelescopeDesignValidation,
  ScienceObjectiveRule,
} from '../types/optics';
import scienceObjectivesData from '../data/scienceObjectives.json';

/**
 * NASA JWST "Build It Yourself: Satellite!" Optics Validator
 * Strictly implementing Resource 6 (gametext.pdf)
 */

export interface ExtendedTelescopeValidation extends TelescopeDesignValidation {
  scienceEfficiencyScore: number;
  forbiddenWavelengths: WavelengthBand[];
}

const scienceObjectives: ScienceObjectiveRule[] = scienceObjectivesData as ScienceObjectiveRule[];

export function validateOpticsForWavelength(
  wavelength: WavelengthBand,
  optics: OpticalConfiguration
): boolean {
  switch (wavelength) {
    case 'GAMMA_RAY':
      return optics === 'NO_OPTICS';
    case 'X_RAY':
      return optics === 'NESTED_GRAZING_SHELLS';
    case 'ULTRAVIOLET':
    case 'OPTICAL':
    case 'INFRARED':
      return optics === 'MONOLITHIC_PRIMARY' || optics === 'SEGMENTED_DEPLOYABLE';
    case 'MICROWAVE':
      return optics === 'NO_OPTICS';
    default:
      return false;
  }
}

export function matchFlagshipMission(
  wavelength: WavelengthBand,
  optics: OpticalConfiguration
): NASAFlagshipId | undefined {
  if (wavelength === 'GAMMA_RAY' && optics === 'NO_OPTICS') return 'FERMI';
  if (wavelength === 'X_RAY' && optics === 'NESTED_GRAZING_SHELLS') return 'CHANDRA';
  if (wavelength === 'X_RAY' && optics === 'NO_OPTICS') return 'SWIFT_RXTE';
  if (wavelength === 'INFRARED' && optics === 'SEGMENTED_DEPLOYABLE') return 'JWST';
  if (wavelength === 'INFRARED' && optics === 'MONOLITHIC_PRIMARY') return 'SPITZER';
  if ((wavelength === 'OPTICAL' || wavelength === 'ULTRAVIOLET') && optics === 'MONOLITHIC_PRIMARY') {
    return 'HUBBLE';
  }
  if (wavelength === 'MICROWAVE' && optics === 'NO_OPTICS') return 'WMAP_PLANCK';
  return undefined;
}

export function validateTelescopeDesign(
  goalId: ScienceGoalId,
  wavelength: WavelengthBand,
  optics: OpticalConfiguration
): ExtendedTelescopeValidation {
  return validateMultiBandTelescope(goalId, [wavelength], optics);
}

export function validateMultiBandTelescope(
  goalId: ScienceGoalId,
  wavelengths: WavelengthBand[],
  optics: OpticalConfiguration
): ExtendedTelescopeValidation {
  const feedbackNotes: string[] = [];
  const objective = scienceObjectives.find((obj) => obj.goalId === goalId);

  if (!objective) {
    return {
      isValid: false,
      opticsValid: false,
      wavelengthValid: false,
      feedbackNotes: [`Unknown science goal ID: ${goalId}`],
      scienceEfficiencyScore: 0,
      forbiddenWavelengths: [],
    };
  }

  // Guard against empty array
  if (!wavelengths || wavelengths.length === 0) {
    return {
      isValid: false,
      opticsValid: false,
      wavelengthValid: false,
      feedbackNotes: ['No wavelength bands selected for telescope configuration.'],
      scienceEfficiencyScore: 0,
      forbiddenWavelengths: [],
    };
  }

  // Deduplicate wavelengths
  const uniqueWavelengths = Array.from(new Set(wavelengths));

  // 1. Validate optics configuration against each wavelength
  const opticsValid = uniqueWavelengths.every((w) => validateOpticsForWavelength(w, optics));
  if (!opticsValid) {
    feedbackNotes.push(
      `Resource 6 Rule Violation: ${optics} optics incompatible with selected wavelength bands.`
    );
  }

  // 2. Identify forbidden wavelengths
  const forbiddenWavelengths = uniqueWavelengths.filter((w) =>
    objective.forbiddenWavelengths.includes(w)
  );
  if (forbiddenWavelengths.length > 0) {
    feedbackNotes.push(
      `Resource 6 Rule Violation: Wavelength(s) [${forbiddenWavelengths.join(', ')}] are forbidden for ${objective.name}.`
    );
  }

  // 3. Check compatible wavelengths
  const compatibleCount = uniqueWavelengths.filter((w) =>
    objective.compatibleWavelengths.includes(w)
  ).length;
  const wavelengthValid = forbiddenWavelengths.length === 0 && compatibleCount > 0;

  if (compatibleCount === 0) {
    feedbackNotes.push(
      `No selected wavelengths contribute to primary science goal: ${objective.name}.`
    );
  }

  // 4. Calculate Science Efficiency Score (0 - 100%)
  let scienceEfficiencyScore = 0;
  if (opticsValid && forbiddenWavelengths.length === 0 && compatibleCount > 0) {
    const ratio = compatibleCount / uniqueWavelengths.length;
    scienceEfficiencyScore = Math.round(ratio * 100);
  }

  // 5. Match Flagship benchmark across all selected wavelengths
  let matchedFlagship: NASAFlagshipId | undefined;
  for (const w of uniqueWavelengths) {
    const match = matchFlagshipMission(w, optics);
    if (match) {
      matchedFlagship = match;
      break;
    }
  }

  if (matchedFlagship) {
    feedbackNotes.push(`Benchmark Match: Design aligns with NASA Flagship mission ${matchedFlagship}.`);
  }

  const isValid = opticsValid && wavelengthValid;

  return {
    isValid,
    matchedFlagship,
    opticsValid,
    wavelengthValid,
    feedbackNotes,
    scienceEfficiencyScore,
    forbiddenWavelengths,
  };
}
