import { create } from 'zustand';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

interface GameState {
  status: GameStatus;
  score: number;
  setStatus: (status: GameStatus) => void;
  setScore: (score: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'IDLE',
  score: 0,
  setStatus: (status) => set({ status }),
  setScore: (score) => set({ score }),
  reset: () => set({ status: 'IDLE', score: 0 }),
}));
