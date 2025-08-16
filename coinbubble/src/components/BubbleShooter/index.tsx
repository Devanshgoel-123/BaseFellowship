/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback, useRef } from "react";
import GameCanvas from "../GameCanvas";
import ScoreBoard from "../ScoreBoard";
import GameControls from "../GameControls";
import LastHitColorIndicator from "../LastHitColorIndicator";
import StatsDisplay from "../StatsDisplay";
import GameOverModal from "../GameOverModal";
import "./styles.scss";
import type { Bubble, ShootingBubble, GameState } from "../../lib/bubbleType";
import { initializeBubbles, getRandomColor } from "../../lib/functions";
import { ScoringSystem } from "../../lib/scoring";

export default function BubbleShooter() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shootingBubble, setShootingBubble] = useState<ShootingBubble | null>(
    null
  );
  const [nextBubbleColor, setNextBubbleColor] = useState<string>(
    getRandomColor()
  );
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [lastHitColor, setLastHitColor] = useState<string | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const scoringSystem = useRef(new ScoringSystem());

  const handleInitializeBubbles = useCallback(() => {
    const newBubbles = initializeBubbles();
    setBubbles(newBubbles);
    setNextBubbleColor(getRandomColor());
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setGameState("playing");
    setShootingBubble(null);
    setLastHitColor(null);
    setShowGameOver(false);
    scoringSystem.current.reset();
    handleInitializeBubbles();
  }, [handleInitializeBubbles]);

  const handleGameOver = useCallback(() => {
    setGameState("lost");
    setShowGameOver(true);
  }, []);

  const handleBubblesPopped = useCallback((poppedBubbles: Bubble[]) => {
    const points = scoringSystem.current.addPoints(poppedBubbles);
    setScore((prev) => prev + points);

    if (poppedBubbles.length > 0) {
      setLastHitColor(poppedBubbles[0].color);
    }
  }, []);

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
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
          onBubblesPopped={handleBubblesPopped}
          onGameOver={handleGameOver}
        />

        <GameControls
          gameState={gameState}
          score={score}
          onResetGame={resetGame}
          onInitializeBubbles={handleInitializeBubbles}
        />

        <LastHitColorIndicator
          lastHitColor={lastHitColor}
          isVisible={gameState === "playing"}
        />

        {/* <StatsDisplay
          totalPoints={scoringSystem.current.getStats().totalPoints}
          totalBubbles={scoringSystem.current.getStats().totalBubblesPopped}
          colorStats={scoringSystem.current.getColorStats()}
          isVisible={gameState === "playing"}
        /> */}

        <GameOverModal
          isVisible={showGameOver}
          stats={scoringSystem.current.getStats()}
          onRestart={resetGame}
        />
      </div>
    </div>
  );
}
