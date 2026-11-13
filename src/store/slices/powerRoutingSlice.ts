import { StateCreator } from 'zustand';

/**
 * NASA Space Apps — Power Routing Slice
 * Enforces strict Power Grid Constraint: Exactly / at most 2 systems powered simultaneously.
 * Citing Resource 4 (NASA GSFC MDL: Spacecraft Power EPS & Distribution Discipline)
 */

export type PoweredSystem = 'Engines' | 'LifeSupport' | 'Shields' | 'Doors';

export const ALL_ROUTABLE_SYSTEMS: readonly PoweredSystem[] = [
  'Engines',
  'LifeSupport',
  'Shields',
  'Doors',
] as const;

export const MAX_SIMULTANEOUS_POWERED_SYSTEMS = 2;

export interface PowerRoutingSlice {
  poweredSystems: PoweredSystem[];
  lastRoutingError: string | null;

  toggleSystemPower: (system: PoweredSystem) => boolean;
  setSystemPower: (system: PoweredSystem, enabled: boolean) => boolean;
  routePower: (systems: PoweredSystem[]) => boolean;
  clearRoutingError: () => void;
  isSystemPowered: (system: PoweredSystem) => boolean;
}

export const createPowerRoutingSlice: StateCreator<
  PowerRoutingSlice,
  [],
  [],
  PowerRoutingSlice
> = (set, get) => ({
  poweredSystems: ['LifeSupport', 'Doors'], // Default nominal state
  lastRoutingError: null,

  isSystemPowered: (system: PoweredSystem) => {
    return get().poweredSystems.includes(system);
  },

  toggleSystemPower: (system: PoweredSystem): boolean => {
    const { poweredSystems } = get();
    const isCurrentlyActive = poweredSystems.includes(system);

    if (isCurrentlyActive) {
      // Disengage system
      set({
        poweredSystems: poweredSystems.filter((s) => s !== system),
        lastRoutingError: null,
      });
      return true;
    }

    // Attempt to engage system
    if (poweredSystems.length >= MAX_SIMULTANEOUS_POWERED_SYSTEMS) {
      set({
        lastRoutingError: `POWER_LIMIT_EXCEEDED: Maximum ${MAX_SIMULTANEOUS_POWERED_SYSTEMS} systems can be powered simultaneously. Disengage an active system first.`,
      });
      return false;
    }

    set({
      poweredSystems: [...poweredSystems, system],
      lastRoutingError: null,
    });
    return true;
  },

  setSystemPower: (system: PoweredSystem, enabled: boolean): boolean => {
    const { poweredSystems } = get();
    const isCurrentlyActive = poweredSystems.includes(system);

    if (!enabled) {
      if (isCurrentlyActive) {
        set({
          poweredSystems: poweredSystems.filter((s) => s !== system),
          lastRoutingError: null,
        });
      }
      return true;
    }

    if (isCurrentlyActive) return true;

    if (poweredSystems.length >= MAX_SIMULTANEOUS_POWERED_SYSTEMS) {
      set({
        lastRoutingError: `POWER_LIMIT_EXCEEDED: Maximum ${MAX_SIMULTANEOUS_POWERED_SYSTEMS} systems can be powered simultaneously.`,
      });
      return false;
    }

    set({
      poweredSystems: [...poweredSystems, system],
      lastRoutingError: null,
    });
    return true;
  },

  routePower: (systems: PoweredSystem[]): boolean => {
    const unique = Array.from(new Set(systems)).filter((s) =>
      ALL_ROUTABLE_SYSTEMS.includes(s)
    );

    if (unique.length > MAX_SIMULTANEOUS_POWERED_SYSTEMS) {
      set({
        lastRoutingError: `POWER_LIMIT_EXCEEDED: Cannot assign more than ${MAX_SIMULTANEOUS_POWERED_SYSTEMS} systems simultaneously.`,
      });
      return false;
    }

    set({
      poweredSystems: unique,
      lastRoutingError: null,
    });
    return true;
  },

  clearRoutingError: () => set({ lastRoutingError: null }),
});
