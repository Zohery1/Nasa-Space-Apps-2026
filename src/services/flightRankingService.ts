/**
 * NASA Space Apps — Flight Evaluation & S/A/B/C Ranking Service
 * Grounded in Resource 1 (Mission Success Criteria) and Resource 4 (Systems Reliability)
 */

export type MissionRank = 'S' | 'A' | 'B' | 'C' | 'FAIL';

export interface FlightDebriefInput {
  timeRemainingSeconds: number; // Out of 60s
  finalOxygenPercent: number;    // 0 to 100
  finalTemperatureCelsius: number; // Baseline 21 C
  finalHullPercent: number;      // 0 to 100
  crisesResolvedCount: number;
}

export interface FlightRankDebrief {
  rank: MissionRank;
  score: number; // 0 - 100
  title: string;
  feedbackNotes: string[];
  evaluatedAt: string;
}

export const RANKING_STORAGE_KEY = 'nasa_flight_rankings_v1';

/**
 * Evaluates mission performance and determines S/A/B/C rank
 */
export function calculateFlightRank(input: FlightDebriefInput): FlightRankDebrief {
  const {
    timeRemainingSeconds,
    finalOxygenPercent,
    finalTemperatureCelsius,
    finalHullPercent,
    crisesResolvedCount,
  } = input;

  // Catastrophic failure checks
  if (finalOxygenPercent <= 0 || finalHullPercent <= 0) {
    return {
      rank: 'FAIL',
      score: 0,
      title: 'Mission Catastrophe — Spacecraft Lost',
      feedbackNotes: ['Critical life support or hull failure resulted in total mission loss.'],
      evaluatedAt: new Date().toISOString(),
    };
  }

  // Component Scores (Normalized to 100)
  const timeScore = Math.min(100, (Math.max(0, timeRemainingSeconds) / 60.0) * 100);
  const o2Score = Math.max(0, Math.min(100, finalOxygenPercent));
  const hullScore = Math.max(0, Math.min(100, finalHullPercent));

  // Temperature deviation penalty: 0 penalty at 21 C, -5 pts per deg deviation
  const tempDeviation = Math.abs(finalTemperatureCelsius - 21.0);
  const tempScore = Math.max(0, 100 - tempDeviation * 5);

  // Weighted Composite Score
  // 35% Reaction Time + 25% O2 + 20% Hull + 20% Thermal
  let compositeScore =
    timeScore * 0.35 + o2Score * 0.25 + hullScore * 0.2 + tempScore * 0.2;

  // Bonus for multiple crises resolved
  if (crisesResolvedCount > 1) {
    compositeScore = Math.min(100, compositeScore + (crisesResolvedCount - 1) * 5);
  }

  const finalScore = Number(compositeScore.toFixed(1));
  const feedbackNotes: string[] = [];
  let rank: MissionRank;
  let title: string;

  if (finalScore >= 90) {
    rank = 'S';
    title = 'S-Rank: Legendary Flight Commander';
    feedbackNotes.push('Flawless crisis response with minimal resource depletion.');
  } else if (finalScore >= 75) {
    rank = 'A';
    title = 'A-Rank: Exemplary Mission Specialist';
    feedbackNotes.push('Efficient response with well-managed oxygen and thermal buffers.');
  } else if (finalScore >= 50) {
    rank = 'B';
    title = 'B-Rank: Qualified Flight Engineer';
    feedbackNotes.push('Crisis resolved within standard margin of safety.');
  } else if (finalScore >= 30) {
    rank = 'C';
    title = 'C-Rank: Marginal Recovery';
    feedbackNotes.push('Spacecraft survived, but severe resource depletion was sustained.');
  } else {
    rank = 'FAIL';
    title = 'Mission Failure: Unacceptable Degradation';
    feedbackNotes.push('Systems degraded beyond acceptable flight safety thresholds.');
  }

  return {
    rank,
    score: finalScore,
    title,
    feedbackNotes,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Saves debrief to LocalStorage with fail-soft offline handling
 */
export function saveFlightDebrief(debrief: FlightRankDebrief): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const history = loadFlightRankHistory();
    history.unshift(debrief);
    // Keep last 20 evaluations
    const trimmed = history.slice(0, 20);
    window.localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Fail-soft offline persistence
  }
}

/**
 * Loads flight rank history from LocalStorage
 */
export function loadFlightRankHistory(): FlightRankDebrief[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(RANKING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
