import { create } from 'zustand';
import { MissionSlice, createMissionSlice } from './slices/missionSlice';
import { CubeSatSlice, createCubeSatSlice } from './slices/cubesatSlice';
import { CMLSlice, createCMLSlice } from './slices/cmlSlice';
import { FlightSlice, createFlightSlice } from './slices/flightSlice';
import { CrisisSlice, createCrisisSlice } from './slices/crisisSlice';
import { PowerRoutingSlice, createPowerRoutingSlice } from './slices/powerRoutingSlice';
import { RankingSlice, createRankingSlice } from './slices/rankingSlice';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface BaseGameSlice {
  status: GameStatus;
  score: number;
  setStatus: (status: GameStatus) => void;
  setScore: (score: number) => void;
  reset: () => void;
}

export type RootStore = BaseGameSlice &
  MissionSlice &
  CubeSatSlice &
  CMLSlice &
  FlightSlice &
  CrisisSlice &
  PowerRoutingSlice &
  RankingSlice;

export const useGameStore = create<RootStore>()((...a) => ({
  // Base Game Slice
  status: 'IDLE',
  score: 0,
  setStatus: (status) => a[0]({ status }),
  setScore: (score) => a[0]({ score }),
  reset: () => a[0]({ status: 'IDLE', score: 0 }),

  // Modular Slices
  ...createMissionSlice(...a),
  ...createCubeSatSlice(...a),
  ...createCMLSlice(...a),
  ...createFlightSlice(...a),
  ...createCrisisSlice(...a),
  ...createPowerRoutingSlice(...a),
  ...createRankingSlice(...a),
}));

export * from './selectors';
