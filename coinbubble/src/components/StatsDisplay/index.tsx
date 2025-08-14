import { ColorStats } from "../../lib/scoring";

interface StatsDisplayProps {
  totalPoints: number;
  totalBubbles: number;
  colorStats: ColorStats[];
  isVisible: boolean;
}

export default function StatsDisplay({
  totalPoints,
  totalBubbles,
  colorStats,
  isVisible,
}: StatsDisplayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black bg-opacity-50 rounded-lg p-4 text-white min-w-48">
      <h3 className="text-lg font-bold mb-3 text-center">Player Stats</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Total Points:</span>
          <span className="font-bold text-yellow-400">{totalPoints.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Bubbles Popped:</span>
          <span className="font-bold text-blue-400">{totalBubbles.toLocaleString()}</span>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-3">
        <h4 className="text-sm font-semibold mb-2">Color Breakdown:</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {colorStats
            .filter(stat => stat.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((stat) => (
              <div key={stat.color} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span>{stat.count}</span>
                </div>
                <span className="text-gray-300">{stat.points}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
