import React from 'react';
import { PixiWrapper } from './game/PixiWrapper';
import { useGameStore } from './store/useGameStore';

export const App: React.FC = () => {
  const status = useGameStore((s) => s.status);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-950 font-mono text-white">
      {/* PixiJS 2D Engine Surface */}
      <PixiWrapper />

      {/* Neutral UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
        <header className="flex justify-between items-center bg-slate-900/80 border border-slate-700/60 rounded-xl px-5 py-3 backdrop-blur-md pointer-events-auto">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-cyan-400">NASA SPACE APPS 2026</span>
          </div>
          <div className="text-xs text-slate-400">STATUS: {status}</div>
        </header>

        <main className="self-center my-auto text-center pointer-events-auto">
          <h1 className="text-4xl font-black text-cyan-400 tracking-widest mb-3">ENVIRONMENT READY</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Vite + React + PixiJS v8 + TanStack Query + Zustand scaffolding is active. Ready to implement your custom game mechanics and NASA API data models.
          </p>
        </main>

        <footer className="text-center text-xs text-slate-500 pointer-events-auto">
          Vibe Coding Architecture • Strictly Decoupled Pixi & React
        </footer>
      </div>
    </div>
  );
};

export default App;
