import { GameAsteroid, RawNeoFeedResponse, RawNeoItem } from '../types/asteroid';
import mockData from '../data/mockNeoData.json';

const NASA_API_BASE = 'https://api.nasa.gov/neo/rest/v1/feed';

/**
 * Normalizes raw NASA NeoWs item into a typed GameAsteroid
 * with clamped coordinates and gameplay props.
 */
export function normalizeNeoAsteroid(raw: RawNeoItem): GameAsteroid {
  const minM = raw.estimated_diameter?.meters?.estimated_diameter_min ?? 20;
  const maxM = raw.estimated_diameter?.meters?.estimated_diameter_max ?? 50;
  const diameterMeters = Math.round((minM + maxM) / 2);

  const approach = raw.close_approach_data?.[0];
  const velocityKmH = approach ? parseFloat(approach.relative_velocity.kilometers_per_hour) : 40000;
  const missDistanceKm = approach ? parseFloat(approach.miss_distance.kilometers) : 2500000;
  const missDistanceLunar = approach ? parseFloat(approach.miss_distance.lunar) : 6.5;
  const isHazardous = Boolean(raw.is_potentially_hazardous_asteroid);

  // Clamp visual radius between 18px and 68px (logarithmic scaling)
  const renderRadiusPx = Math.min(68, Math.max(18, Math.round(Math.log10(diameterMeters + 10) * 18)));

  // Clamp downward speed between 1.5px and 6.0px per frame
  const speedPxPerFrame = Math.min(6.0, Math.max(1.5, velocityKmH / 22000));

  // HP scales with size and hazardous classification
  const maxHp = Math.max(1, Math.ceil(renderRadiusPx / 20) + (isHazardous ? 2 : 0));

  // Score scales with real astronomical velocity and danger
  const scoreValue = Math.round(velocityKmH / 500) * (isHazardous ? 2 : 1);

  return {
    id: raw.id,
    name: raw.name,
    diameterMeters,
    velocityKmH,
    missDistanceKm,
    missDistanceLunar,
    isHazardous,
    nasaJplUrl: raw.nasa_jpl_url,
    renderRadiusPx,
    speedPxPerFrame,
    maxHp,
    currentHp: maxHp,
    scoreValue,
  };
}

/**
 * Fetches NASA NEO Feed with automatic offline fallback to local mock data
 */
export async function fetchNeoAsteroids(apiKey?: string): Promise<GameAsteroid[]> {
  const key = apiKey || import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
  const today = new Date().toISOString().split('T')[0];

  try {
    const url = `${NASA_API_BASE}?start_date=${today}&end_date=${today}&api_key=${key}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      console.warn(`NASA API returned status ${response.status}. Using offline mock data.`);
      return parseFeedResponse(mockData as unknown as RawNeoFeedResponse);
    }

    const data: RawNeoFeedResponse = await response.json();
    return parseFeedResponse(data);
  } catch (error) {
    console.warn('NASA API network failed or timed out. Falling back to offline mock dataset:', error);
    return parseFeedResponse(mockData as unknown as RawNeoFeedResponse);
  }
}

function parseFeedResponse(data: RawNeoFeedResponse): GameAsteroid[] {
  const results: GameAsteroid[] = [];
  const dates = Object.keys(data.near_earth_objects || {});

  for (const date of dates) {
    const items = data.near_earth_objects[date] || [];
    for (const item of items) {
      results.push(normalizeNeoAsteroid(item));
    }
  }

  return results.length > 0 ? results : parseFeedResponse(mockData as unknown as RawNeoFeedResponse);
}
