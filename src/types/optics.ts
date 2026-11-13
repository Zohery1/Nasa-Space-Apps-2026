/**
 * Telescope & Optical Instrument Design Types (Resource 6: JWST Game)
 * Direct extraction from NASA gametext.pdf
 */

export type ScienceGoalId =
  | 'BLACK_HOLES'
  | 'STAR_FORMATION'
  | 'EARLY_UNIVERSE'
  | 'EXOPLANETS'
  | 'GALAXIES';

export type WavelengthBand =
  | 'GAMMA_RAY'
  | 'X_RAY'
  | 'ULTRAVIOLET'
  | 'OPTICAL'
  | 'INFRARED'
  | 'MICROWAVE';

export type OpticalConfiguration =
  | 'NO_OPTICS'              // Required for Gamma-ray and high-energy particles
  | 'NESTED_GRAZING_SHELLS'  // Required for X-ray grazing reflection
  | 'MONOLITHIC_PRIMARY'     // Single mirror (Hubble / Spitzer style)
  | 'SEGMENTED_DEPLOYABLE';  // Multi-segment mirror (JWST style)

export type NASAFlagshipId =
  | 'FERMI'
  | 'CHANDRA'
  | 'JWST'
  | 'SPITZER'
  | 'SWIFT_RXTE'
  | 'WMAP_PLANCK'
  | 'HUBBLE';

export interface ScienceObjectiveRule {
  goalId: ScienceGoalId;
  name: string;
  description: string;
  compatibleWavelengths: WavelengthBand[];
  forbiddenWavelengths: WavelengthBand[];
}

export interface TelescopeDesignValidation {
  isValid: boolean;
  matchedFlagship?: NASAFlagshipId;
  opticsValid: boolean;
  wavelengthValid: boolean;
  feedbackNotes: string[];
}
