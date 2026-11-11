import { create } from 'zustand';
import { GameAsteroid, GameStatus } from '../types/asteroid';
import { GAME_CONFIG } from '../config/constants';

interface GameState {
  status: GameStatus;
  score: number;
  playerHp: number;
  currentWave: number;
  activeAsteroid: GameAsteroid | null;
  destroyedHistory: GameAsteroid[];
  activeAsteroidList: GameAsteroid[];

  // Actions
  setStatus: (status: GameStatus) => void;
  addScore: (points: number) => void;
  damagePlayer: (amount: number) => void;
  setActiveAsteroid: (asteroid: GameAsteroid | null) => void;
  logDestroyedAsteroid: (asteroid: GameAsteroid) => void;
  setAsteroidList: (list: GameAsteroid[]) => void;
  nextWave: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'IDLE',
  score: 0,
  playerHp: GAME_CONFIG.PLAYER.MAX_HP,
  currentWave: 1,
  activeAsteroid: null,
  destroyedHistory: [],
  activeAsteroidList: [],

  setStatus: (status) => set({ status }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  damagePlayer: (amount) =>
    set((state) => {
      const nextHp = Math.max(0, state.playerHp - amount);
      return {
        playerHp: nextHp,
        status: nextHp === 0 ? 'GAME_OVER' : state.status,
      };
    }),
  setActiveAsteroid: (activeAsteroid) => set({ activeAsteroid }),
  logDestroyedAsteroid: (asteroid) =>
    set((state) => ({
      destroyedHistory: [...state.destroyedHistory, asteroid],
      score: state.score + asteroid.scoreValue,
    })),
  setAsteroidList: (activeAsteroidList) => set({ activeAsteroidList }),
  nextWave: () => set((state) => ({ currentWave: state.currentWave + 1 })),
  resetGame: () =>
    set({
      status: 'PLAYING',
      score: 0,
      playerHp: GAME_CONFIG.PLAYER.MAX_HP,
      currentWave: 1,
      activeAsteroid: null,
      destroyedHistory: [],
    }),
}));
