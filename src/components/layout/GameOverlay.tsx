import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Shield, Crosshair, AlertTriangle, Play } from 'lucide-react';

export const GameOverlay: React.FC = () => {
  const status = useGameStore((s) => s.status);
  const score = useGameStore((s) => s.score);
  const playerHp = useGameStore((s) => s.playerHp);
  const wave = useGameStore((s) => s.currentWave);
  const activeAsteroid = useGameStore((s) => s.activeAsteroid);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 font-mono">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* HP and Wave */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 backdrop-blur-md shadow-lg pointer-events-auto">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-xs uppercase tracking-wider text-slate-300">Shield Integrity</span>
          </div>
          <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-300 ${
                playerHp > 50 ? 'bg-cyan-400' : playerHp > 20 ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${playerHp}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>HP: {playerHp}%</span>
            <span>WAVE: {wave}</span>
          </div>
        </div>

        {/* Score Counter */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 backdrop-blur-md shadow-lg pointer-events-auto text-right">
          <div className="text-xs uppercase tracking-wider text-slate-400">Planetary Defense Score</div>
          <div className="text-3xl font-black text-cyan-400 tracking-wider">
            {score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Center Modals (Start / Game Over) */}
      {status === 'IDLE' && (
        <div className="self-center my-auto bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-xl shadow-2xl pointer-events-auto">
          <h1 className="text-3xl font-black text-cyan-400 tracking-wider mb-2">NASA NEO DEFENDER</h1>
          <p className="text-slate-300 text-sm mb-6">
            Real-time Near Earth Asteroid simulation driven by NASA NeoWs telemetry. Protect Earth from approaching orbital bodies.
          </p>
          <button
            onClick={resetGame}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/30"
          >
            <Play className="w-5 h-5" />
            <span>START MISSION</span>
          </button>
        </div>
      )}

      {status === 'GAME_OVER' && (
        <div className="self-center my-auto bg-slate-900/95 border border-red-500/50 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-xl shadow-2xl pointer-events-auto">
          <div className="text-red-500 flex justify-center mb-2">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-red-400 tracking-wide mb-2">DEFENSE BREACHED</h2>
          <p className="text-slate-400 text-sm mb-4">Planetary shields depleted. Orbital interception failed.</p>
          <div className="bg-slate-800/80 rounded-lg p-3 mb-6">
            <div className="text-xs text-slate-400">Final Defense Score</div>
            <div className="text-2xl font-bold text-cyan-400">{score.toLocaleString()}</div>
          </div>
          <button
            onClick={resetGame}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition duration-200"
          >
            RELAUNCH DEFENSE
          </button>
        </div>
      )}

      {/* Bottom Telemetry Card */}
      <div className="flex justify-end">
        {activeAsteroid && (
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 max-w-sm w-full backdrop-blur-md pointer-events-auto">
            <div className="flex items-center space-x-2 text-amber-400 text-xs mb-2">
              <Crosshair className="w-4 h-4" />
              <span>LIVE NASA TARGET TELEMETRY</span>
            </div>
            <div className="text-sm font-bold text-slate-200">{activeAsteroid.name}</div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-400">
              <div>
                <span>Diameter:</span>{' '}
                <span className="text-slate-200">{activeAsteroid.diameterMeters}m</span>
              </div>
              <div>
                <span>Speed:</span>{' '}
                <span className="text-slate-200">{Math.round(activeAsteroid.velocityKmH)} km/h</span>
              </div>
              <div className="col-span-2">
                <span>Hazard Status:</span>{' '}
                <span className={activeAsteroid.isHazardous ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {activeAsteroid.isHazardous ? 'HAZARDOUS' : 'SAFE FLYBY'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
