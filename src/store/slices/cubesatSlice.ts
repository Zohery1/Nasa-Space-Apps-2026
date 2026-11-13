import { StateCreator } from 'zustand';
import { CubeSatBusSpec } from '../../types/cubesat';
import { ScienceInstrument, SpacecraftSubsystem } from '../../types/instruments';
import { validateCubeSatConfiguration, DetailedValidationResult } from '../../services/cubesatValidator';

export interface CubeSatSlice {
  selectedBus: CubeSatBusSpec | null;
  installedInstruments: ScienceInstrument[];
  installedSubsystems: SpacecraftSubsystem[];
  deployablesTimerSeconds: number;
  rfSilenceTimerSeconds: number;
  physicalInhibitsCount: number;
  batteryCertifiedUL1642: boolean;
  cubeSatValidation: DetailedValidationResult | null;

  selectBus: (bus: CubeSatBusSpec) => void;
  addInstrument: (instrument: ScienceInstrument) => void;
  removeInstrument: (id: string) => void;
  addSubsystem: (subsystem: SpacecraftSubsystem) => void;
  removeSubsystem: (id: string) => void;
  setDeployablesTimer: (seconds: number) => void;
  setRfSilenceTimer: (seconds: number) => void;
  setPhysicalInhibitsCount: (count: number) => void;
  setBatteryCertified: (certified: boolean) => void;
  recomputeValidation: () => void;
}

export const createCubeSatSlice: StateCreator<
  CubeSatSlice,
  [],
  [],
  CubeSatSlice
> = (set, get) => ({
  selectedBus: null,
  installedInstruments: [],
  installedSubsystems: [],
  deployablesTimerSeconds: 1800, // CSLI default >= 30m
  rfSilenceTimerSeconds: 2700,    // CSLI default >= 45m
  physicalInhibitsCount: 3,       // CSLI default 3
  batteryCertifiedUL1642: true,
  cubeSatValidation: null,

  selectBus: (selectedBus) => {
    set({ selectedBus });
    get().recomputeValidation();
  },

  addInstrument: (instrument) => {
    set((state) => ({
      installedInstruments: [...state.installedInstruments.filter(i => i.id !== instrument.id), instrument],
    }));
    get().recomputeValidation();
  },

  removeInstrument: (id) => {
    set((state) => ({
      installedInstruments: state.installedInstruments.filter((i) => i.id !== id),
    }));
    get().recomputeValidation();
  },

  addSubsystem: (subsystem) => {
    set((state) => ({
      installedSubsystems: [...state.installedSubsystems.filter(s => s.id !== subsystem.id), subsystem],
    }));
    get().recomputeValidation();
  },

  removeSubsystem: (id) => {
    set((state) => ({
      installedSubsystems: state.installedSubsystems.filter((s) => s.id !== id),
    }));
    get().recomputeValidation();
  },

  setDeployablesTimer: (deployablesTimerSeconds) => {
    set({ deployablesTimerSeconds });
    get().recomputeValidation();
  },

  setRfSilenceTimer: (rfSilenceTimerSeconds) => {
    set({ rfSilenceTimerSeconds });
    get().recomputeValidation();
  },

  setPhysicalInhibitsCount: (physicalInhibitsCount) => {
    set({ physicalInhibitsCount });
    get().recomputeValidation();
  },

  setBatteryCertified: (batteryCertifiedUL1642) => {
    set({ batteryCertifiedUL1642 });
    get().recomputeValidation();
  },

  recomputeValidation: () => {
    const {
      selectedBus,
      installedInstruments,
      installedSubsystems,
      deployablesTimerSeconds,
      rfSilenceTimerSeconds,
      physicalInhibitsCount,
      batteryCertifiedUL1642,
    } = get();

    if (!selectedBus) {
      set({ cubeSatValidation: null });
      return;
    }

    const validation = validateCubeSatConfiguration({
      bus: selectedBus,
      instruments: installedInstruments,
      subsystems: installedSubsystems,
      deployablesTimerSeconds,
      rfSilenceTimerSeconds,
      physicalInhibitsCount,
      batteryCertifiedUL1642,
    });

    set({ cubeSatValidation: validation });
  },
});
