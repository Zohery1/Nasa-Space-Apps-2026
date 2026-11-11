# Architecture & State Separation Rules

1. **PixiJS Canvas Isolation:**
   - PixiJS rendering code belongs strictly inside `src/game/`.
   - Never import React hooks (`useState`, `useEffect`) inside the game physics/ticker loop.
   - Use `PixiWrapper.tsx` as the single mounting surface for `app.canvas`.

2. **Discrete Event Bridging:**
   - Communication from PixiJS to React is strictly event-driven:
     - Player damaged: `useGameStore.getState().damagePlayer(amount)`
     - Asteroid destroyed: `useGameStore.getState().logDestroyedAsteroid(asteroid)`
     - Wave finished: `useGameStore.getState().nextWave()`
   - Never pass high-frequency coordinates (60 FPS positions) into Zustand or React state.

3. **Data Caching & Offline Guard:**
   - Query client must configure `staleTime: Infinity` to prevent rate-limit exhaustion.
   - In case of API failure or offline connection, immediately return `src/data/mockNeoData.json`.
