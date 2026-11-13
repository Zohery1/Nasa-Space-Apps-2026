import { StateCreator } from 'zustand';
import {
  FlightRankDebrief,
  FlightDebriefInput,
  calculateFlightRank,
  saveFlightDebrief,
  loadFlightRankHistory,
  RANKING_STORAGE_KEY,
} from '../../services/flightRankingService';

/**
 * NASA Space Apps — Mission Debrief & Ranking Slice
 * Manages player flight evaluations, S/A/B/C ranks, and persistent records
 */

export interface RankingSlice {
  latestDebrief: FlightRankDebrief | null;
  rankHistory: FlightRankDebrief[];

  evaluateFlightDebrief: (input: FlightDebriefInput) => FlightRankDebrief;
  loadSavedRankings: () => void;
  clearRankHistory: () => void;
}

export const createRankingSlice: StateCreator<
  RankingSlice,
  [],
  [],
  RankingSlice
> = (set) => ({
  latestDebrief: null,
  rankHistory: [],

  evaluateFlightDebrief: (input: FlightDebriefInput) => {
    const debrief = calculateFlightRank(input);
    saveFlightDebrief(debrief);

    set((state) => ({
      latestDebrief: debrief,
      rankHistory: [debrief, ...state.rankHistory].slice(0, 20),
    }));

    return debrief;
  },

  loadSavedRankings: () => {
    const history = loadFlightRankHistory();
    set({
      rankHistory: history,
      latestDebrief: history[0] || null,
    });
  },

  clearRankHistory: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(RANKING_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    set({ rankHistory: [], latestDebrief: null });
  },
});
