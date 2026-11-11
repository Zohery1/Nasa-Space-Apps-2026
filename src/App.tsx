import React, { useEffect } from 'react';
import { PixiWrapper } from './game/PixiWrapper';
import { GameOverlay } from './components/layout/GameOverlay';
import { fetchNeoAsteroids } from './services/nasaService';
import { useGameStore } from './store/useGameStore';

export const App: React.FC = () => {
  const setAsteroidList = useGameStore((s) => s.setAsteroidList);
  const setActiveAsteroid = useGameStore((s) => s.setActiveAsteroid);

  useEffect(() => {
    // Initial fetch of NASA Asteroid Data (with offline fallback)
    fetchNeoAsteroids().then((asteroids) => {
      setAsteroidList(asteroids);
      if (asteroids.length > 0) {
        setActiveAsteroid(asteroids[0]);
      }
    });
  }, [setAsteroidList, setActiveAsteroid]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-950">
      <PixiWrapper />
      <GameOverlay />
    </div>
  );
};

export default App;
