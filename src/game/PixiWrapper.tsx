import React, { useEffect, useRef } from 'react';
import { GameApp } from './core/GameApp';

export const PixiWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameAppRef = useRef<GameApp | null>(null);

  useEffect(() => {
    let isMounted = true;
    const game = new GameApp();
    gameAppRef.current = game;

    if (containerRef.current) {
      game.init(containerRef.current).catch((err) => {
        console.error('Failed to initialize PixiJS GameApp:', err);
      });
      containerRef.current.focus();
    }

    const handleResize = () => {
      if (isMounted && gameAppRef.current) {
        gameAppRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (gameAppRef.current) {
        gameAppRef.current.destroy();
        gameAppRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="absolute inset-0 w-full h-full overflow-hidden outline-none cursor-default"
    />
  );
};
