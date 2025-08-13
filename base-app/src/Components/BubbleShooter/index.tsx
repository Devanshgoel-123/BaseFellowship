"use client";

import { useState, useCallback } from "react";
import GameCanvas from "../GameCanvas";
import ScoreBoard from "../ScoreBoard";
import GameControls from "../GameControls";
import type {
  Bubble,
  ShootingBubble,
  GameState,
} from "../../utils/types/bubbleType";
import {
  COLORS,
  ROWS,
  COLS,
  BUBBLE_RADIUS,
} from "../../utils/constants/constant";

export default function BubbleShooter() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shootingBubble, setShootingBubble] = useState<ShootingBubble | null>(
    null
  );
  const [nextBubbleColor, setNextBubbleColor] = useState<string>(COLORS[0]);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("playing");

  const initializeBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    const isMobile = window.innerWidth < 768;
    const adjustedRows = isMobile ? 6 : ROWS;
    const adjustedCols = isMobile ? 8 : COLS;

    for (let row = 0; row < adjustedRows; row++) {
      const colsInRow = row % 2 === 0 ? adjustedCols : adjustedCols - 1;
      for (let col = 0; col < colsInRow; col++) {
        const x =
          col * (BUBBLE_RADIUS * 2) +
          (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
        const y = row * (BUBBLE_RADIUS * 1.7) + BUBBLE_RADIUS;
        newBubbles.push({
          x,
          y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          row,
          col,
        });
      }
    }
    setBubbles(newBubbles);
    setNextBubbleColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, []);

  const findConnectedBubbles = useCallback(
    (bubbles: Bubble[], startBubble: Bubble): Bubble[] => {
      const visited = new Set<string>();
      const connected: Bubble[] = [];
      const queue = [startBubble];

      while (queue.length > 0) {
        const current = queue.shift()!;
        const key = `${current.row}-${current.col}`;

        if (visited.has(key)) continue;
        visited.add(key);
        connected.push(current);

        // Find neighbors with same color only
        const neighbors = bubbles.filter((bubble) => {
          if (bubble.color !== startBubble.color) return false;
          const distance = Math.sqrt(
            Math.pow(bubble.x - current.x, 2) +
              Math.pow(bubble.y - current.y, 2)
          );
          return distance <= BUBBLE_RADIUS * 2.2 && distance > 0;
        });

        neighbors.forEach((neighbor) => {
          const neighborKey = `${neighbor.row}-${neighbor.col}`;
          if (!visited.has(neighborKey)) {
            queue.push(neighbor);
          }
        });
      }

      return connected;
    },
    []
  );

  const resetGame = useCallback(() => {
    setScore(0);
    setGameState("playing");
    setShootingBubble(null);
    initializeBubbles();
  }, [initializeBubbles]);

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%)",
      }}
    >
      <div className="w-full max-w-sm px-4 md:max-w-2xl lg:max-w-4xl">
        <ScoreBoard score={score} />

        <GameCanvas
          bubbles={bubbles}
          setBubbles={setBubbles}
          shootingBubble={shootingBubble}
          setShootingBubble={setShootingBubble}
          nextBubbleColor={nextBubbleColor}
          setNextBubbleColor={setNextBubbleColor}
          gameState={gameState}
          setGameState={setGameState}
          setScore={setScore}
          findConnectedBubbles={findConnectedBubbles}
        />

        <GameControls
          gameState={gameState}
          score={score}
          onResetGame={resetGame}
          onInitializeBubbles={initializeBubbles}
        />
      </div>
    </div>
  );
}
