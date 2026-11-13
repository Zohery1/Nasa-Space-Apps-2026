import { WavelengthBand } from './optics';

/**
 * NASA GSFC Mission Design Lab & JWST Instrument Types
 * Citing Resource 4 (GSFC MDL Disciplines) and Resource 6 (JWST Build-It-Yourself)
 */

export type InstrumentCategory =
  | 'OPTICAL_PAYLOAD'
  | 'SPECTROMETER'
  | 'PARTICLE_DETECTOR'
  | 'RADIO_SCIENCE'
  | 'RADAR_ALTIMETER';

export interface ScienceInstrument {
  id: string;
  name: string;
  category: InstrumentCategory;
  primaryWavelength: WavelengthBand;
  massKg: number;
  powerWatts: number;
  dataRateKbps: number;
  volumeU: number;
  description: string;
  sourceResource: string; // e.g. "Resource 6: JWST gametext.pdf" or "Resource 4: GSFC MDL"
}

export type SubsystemCategory =
  | 'ADCS'
  | 'PROPULSION'
  | 'POWER_EPS'
  | 'COMMUNICATIONS'
  | 'THERMAL'
  | 'AVIONICS_OBC';

export interface SpacecraftSubsystem {
  id: string;
  name: string;
  category: SubsystemCategory;
  massKg: number;
  powerDrawWatts: number;
  volumeU: number;
  description: string;
  efficiencyOrDeltaV?: number; // delta-V (m/s) for propulsion, efficiency for power
  sourceResource?: string; // e.g. "Resource 4: NASA GSFC MDL Disciplines"
}
