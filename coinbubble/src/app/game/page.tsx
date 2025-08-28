"use client";

import dynamicImport from "next/dynamic";
import { useCallback, useEffect, useState, ComponentType, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bubble, ShootingBubble, GameState } from "~/lib/bubbleType";
import { getRandomColor } from "~/lib/utils";
import { initializeBubbles } from "~/lib/functions";
import { ScoringSystem } from "~/lib/functions";
import { formatTime } from "~/lib/functions";
import ScoreBoard from "~/components/ScoreBoard"; // Adjust the import path as needed
import "./styles.scss";
import { updateUserGameHistory } from "~/Services/user";
import { useAccount } from "wagmi";
import { GAME_DURATION } from "~/lib/constants";

const GameCanvas = dynamicImport(
  () => import("~/components/GameCanvas").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading game...</div>
      </div>
    ),
  }
) as ComponentType<any>;

export const dynamic = "force-dynamic";

export default function GamePage() {
  const { address } = useAccount();
  const router = useRouter();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shootingBubble, setShootingBubble] = useState<ShootingBubble | null>(
    null
  );
  const [nextBubbleColor, setNextBubbleColor] = useState<string>(
    getRandomColor()
  );
  const [timer, setTimer] = useState<number | null>(GAME_DURATION);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const scoringSystem = useRef(new ScoringSystem());

  const handleInitializeBubbles = useCallback(async () => {
    try {
      const newBubbles = await initializeBubbles();
      if (!newBubbles || newBubbles.length === 0) {
        console.error("initializeBubbles returned empty or invalid data");
        return;
      }
      setBubbles(newBubbles);
      setNextBubbleColor(getRandomColor());
    } catch (error) {
      console.error("Failed to initialize bubbles:", error);
    }
  }, []);

  const handleGameOver = useCallback(async () => {
    const hitScores: Record<string, number> = scoringSystem.current
      .getStats()
      .creatorBubblesPopped.reduce((acc, creatorBubblePoppedStats) => {
        acc[creatorBubblePoppedStats.creatorPfp] =
          creatorBubblePoppedStats.points;
        return acc;
      }, {} as Record<string, number>);
    setTimer(null);
    setShowGameOver(true);
    const result = await updateUserGameHistory({
      hitScores,
      userAddress: address as string,
      normalPoints: scoringSystem.current.getStats().totalPoints,
    });
    console.log(result);
  }, [address]);

  useEffect(() => {
    if (timer !== null && timer <= 0) {
      handleGameOver();
    }
  }, [timer, handleGameOver, gameState]);

  useEffect(() => {
    const initializeGame = async () => {
      await handleInitializeBubbles();
    };
    initializeGame();
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev !== null && prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [handleInitializeBubbles, gameState]);

  useEffect(() => {
    console.log("Current state:", { bubbles, gameState, showGameOver });
  }, [bubbles, gameState, showGameOver]);

  const resetGame = useCallback(async () => {
    try {
      setGameState("playing");
      setScore(0);
      setTimer(GAME_DURATION);
      setShootingBubble(null);
      await handleInitializeBubbles();
      setShowGameOver(false);
      console.log("Game reset, bubbles:", bubbles);
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  }, [handleInitializeBubbles, bubbles]);

  const handleBubblesPopped = useCallback((poppedBubbles: Bubble[]) => {
    const points = scoringSystem.current.addPoints(poppedBubbles);
    setScore((prev) => prev + points);
  }, []);

  // ScoreBoard handlers
  const handleScoreBoardClose = () => {
    setShowGameOver(false);
  };

  const handleScoreBoardHome = () => {
    router.push('/');
  };

  const handleScoreBoardShare = () => {
    // Implement share functionality
    const gameStats = scoringSystem.current.getStats();
    const shareText = `I just scored ${gameStats.totalPoints} points in the bubble game! 🎮`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Bubble Game Score',
        text: shareText,
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      alert('Score copied to clipboard!');
    }
  };

  const handleScoreBoardReplay = async () => {
    console.log("Replay clicked from ScoreBoard");
    await resetGame();
  };

  return (
    <div className="gameWrapperDiv">
      <div className="userScore">
        <div>
          <span className="score-label">Points:</span>
          <span className="score-value">{score}</span>
        </div>
        <div>
          <span className="timer-label">Timer</span>
          <span className="timer-value">
            {timer !== null ? formatTime(timer) : "00:00"}
          </span>
        </div>
      </div>
      {gameState === "playing" && (
        <div className="gameCanvasContainer">
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
            scoringSystem={scoringSystem}
          />
        </div>
      )}

      {showGameOver && (
        <div className="absolute inset-0 z-50">
          <ScoreBoard
            onClose={handleScoreBoardClose}
            onHome={handleScoreBoardHome}
            onShare={handleScoreBoardShare}
            onReplay={handleScoreBoardReplay}
          />
        </div>
      )}
    </div>
  );
}
