---
name: nasa-neows-mapper
description: Normalization equations and mappings from NASA NeoWs JSON to GameAsteroid interface.
---

# NASA NeoWs Data Normalization Skill

Endpoint: `https://api.nasa.gov/neo/rest/v1/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=${KEY}`

## Mapping Equations
Given raw NEO item:
- `diameterMeters`: `Math.round((estimated_diameter.meters.estimated_diameter_min + estimated_diameter_max) / 2)`
- `velocityKmH`: `parseFloat(close_approach_data[0].relative_velocity.kilometers_per_hour)`
- `missDistanceKm`: `parseFloat(close_approach_data[0].miss_distance.kilometers)`
- `missDistanceLunar`: `parseFloat(close_approach_data[0].miss_distance.lunar)`
- `isHazardous`: `Boolean(is_potentially_hazardous_asteroid)`

## Calculated Gameplay Props
- `renderRadiusPx`: `Math.min(68, Math.max(18, Math.round(Math.log10(diameterMeters + 10) * 18)))`
- `speedPxPerFrame`: `Math.min(6.0, Math.max(1.5, velocityKmH / 22000))`
- `maxHp`: `Math.max(1, Math.ceil(renderRadiusPx / 20) + (isHazardous ? 2 : 0))`
- `scoreValue`: `Math.round(velocityKmH / 500) * (isHazardous ? 2 : 1)`
