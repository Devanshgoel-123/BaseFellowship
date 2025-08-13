"use client";

import { useEffect } from "react";
import { GameState } from "~/lib/bubbleType";
import "./styles.scss";
interface GameControlsProps {
  gameState: GameState;
  score: number;
  onResetGame: () => void;
  onInitializeBubbles: () => void;
}

export default function GameControls({
  gameState,
  score,
  onResetGame,
  onInitializeBubbles,
}: GameControlsProps) {
  // Initialize game on mount
  useEffect(() => {
    onInitializeBubbles();
  }, [onInitializeBubbles]);

  return (
    <div className="relative">
      {/* Game Over/Won Overlay */}
      {(gameState === "gameOver" || gameState === "won") && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="text-center p-6 bg-gray-900 rounded-lg border border-blue-500 mx-4 max-w-sm w-full">
            <h2 className="text-3xl font-bold text-blue-400 mb-4 md:text-4xl">
              {gameState === "won" ? "You Won!" : "Game Over!"}
            </h2>
            <p className="text-lg mb-6 md:text-xl">Final Score: {score}</p>
            <div
              onClick={onResetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Play Again
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm md:text-base">
          {typeof window !== "undefined" && window.innerWidth < 768
            ? "Tap to aim and shoot • Match 3+ same colors"
            : "Move mouse to aim • Click to shoot • Match 3+ bubbles of same color"}
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div
          onClick={onResetGame}
          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent px-4 py-2"
        >
          New Game
        </div>
      </div>
    </div>
  );
}
