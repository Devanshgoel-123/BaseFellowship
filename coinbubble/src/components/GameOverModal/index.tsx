import { useEffect, useState } from "react";
import { PlayerStats } from "../../lib/scoring";

interface GameOverModalProps {
  isVisible: boolean;
  stats: PlayerStats;
  onRestart: () => void;
}

export default function GameOverModal({ 
  isVisible, 
  stats, 
  onRestart 
}: GameOverModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowCountdown(true);
      setCountdown(5);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onRestart();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, onRestart]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 max-w-md w-full mx-4 text-white text-center shadow-2xl border border-blue-600">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Game Over!</h2>
          <p className="text-gray-300">The bubbles reached the danger line</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Total Points</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-800 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-300">
                {stats.totalBubblesPopped.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300">Bubbles Popped</div>
            </div>

            <div className="bg-blue-800 rounded-lg p-3">
              <div className="text-xl font-bold text-green-300">
                {stats.colorStats.length > 0 ? stats.colorStats[0].count : 0}
              </div>
              <div className="text-xs text-gray-300">Top Color Hits</div>
            </div>
          </div>

          {stats.lastHitColor && (
            <div className="bg-blue-800 rounded-lg p-3">
              <div className="text-sm text-gray-300 mb-2">Last Hit Color</div>
              <div 
                className="w-8 h-8 rounded-full mx-auto border-2 border-white"
                style={{ backgroundColor: stats.lastHitColor }}
              />
            </div>
          )}
        </div>

        {showCountdown && (
          <div className="text-center">
            <div className="text-lg text-gray-300 mb-2">
              New game starting in...
            </div>
            <div className="text-4xl font-bold text-yellow-400">
              {countdown}
            </div>
          </div>
        )}

        <button
          onClick={onRestart}
          className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Restart Now
        </button>
      </div>
    </div>
  );
}
