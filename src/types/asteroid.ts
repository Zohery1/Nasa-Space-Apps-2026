/**
 * Immutable Team Data Contract
 * Role 1, Role 2, and Role 3 MUST strictly adhere to these interfaces.
 */

export interface RawNeoDiameter {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface RawNeoCloseApproach {
  close_approach_date: string;
  close_approach_date_full: string;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface RawNeoItem {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: RawNeoDiameter;
    kilometers: RawNeoDiameter;
  };
  close_approach_data: RawNeoCloseApproach[];
}

export interface RawNeoFeedResponse {
  element_count: number;
  near_earth_objects: Record<string, RawNeoItem[]>;
}

export interface GameAsteroid {
  id: string;
  name: string;
  diameterMeters: number;
  velocityKmH: number;
  missDistanceKm: number;
  missDistanceLunar: number;
  isHazardous: boolean;
  nasaJplUrl: string;

  // Computed Rendering & Gameplay Properties (Pre-calculated for Role 1)
  renderRadiusPx: number;
  speedPxPerFrame: number;
  maxHp: number;
  currentHp: number;
  scoreValue: number;
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
