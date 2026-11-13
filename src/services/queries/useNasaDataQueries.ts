import { useQuery } from '@tanstack/react-query';
import { CubeSatBusSpec } from '../../types/cubesat';
import { ScienceObjectiveRule } from '../../types/optics';
import { ScienceInstrument, SpacecraftSubsystem } from '../../types/instruments';
import { LaunchSegment } from '../../types/mission';

import cubesatBusesData from '../../data/cubesatBuses.json';
import scienceObjectivesData from '../../data/scienceObjectives.json';
import instrumentsData from '../../data/instruments.json';
import launchVehiclesData from '../../data/launchVehicles.json';
import subsystemsData from '../../data/subsystems.json';

/**
 * NASA Space Apps — TanStack React Query v5 hooks
 * Cached retrieval for canonical locked JSON datasets (Resources 1, 4, 6, 7)
 */

export const NASA_DATA_QUERY_KEYS = {
  cubesatBuses: ['nasaData', 'cubesatBuses'] as const,
  scienceObjectives: ['nasaData', 'scienceObjectives'] as const,
  instruments: ['nasaData', 'instruments'] as const,
  launchVehicles: ['nasaData', 'launchVehicles'] as const,
  subsystems: ['nasaData', 'subsystems'] as const,
};

export function useCubeSatBuses() {
  return useQuery({
    queryKey: NASA_DATA_QUERY_KEYS.cubesatBuses,
    queryFn: async (): Promise<CubeSatBusSpec[]> => cubesatBusesData as CubeSatBusSpec[],
    staleTime: Infinity,
  });
}

export function useScienceObjectives() {
  return useQuery({
    queryKey: NASA_DATA_QUERY_KEYS.scienceObjectives,
    queryFn: async (): Promise<ScienceObjectiveRule[]> =>
      scienceObjectivesData as ScienceObjectiveRule[],
    staleTime: Infinity,
  });
}

export function useInstruments() {
  return useQuery({
    queryKey: NASA_DATA_QUERY_KEYS.instruments,
    queryFn: async (): Promise<ScienceInstrument[]> =>
      instrumentsData as ScienceInstrument[],
    staleTime: Infinity,
  });
}

export function useLaunchVehicles() {
  return useQuery({
    queryKey: NASA_DATA_QUERY_KEYS.launchVehicles,
    queryFn: async (): Promise<LaunchSegment[]> =>
      launchVehiclesData as LaunchSegment[],
    staleTime: Infinity,
  });
}

export function useSubsystems() {
  return useQuery({
    queryKey: NASA_DATA_QUERY_KEYS.subsystems,
    queryFn: async (): Promise<SpacecraftSubsystem[]> =>
      subsystemsData as SpacecraftSubsystem[],
    staleTime: Infinity,
  });
}
