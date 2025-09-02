"use client";

import dynamicImport from "next/dynamic";
import { useCallback, useEffect, useState, ComponentType, useRef } from "react";
import { useGameStore } from "~/store/gameStats";
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
import { promise } from "zod/v4";
import Link from "next/link";


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
  const [showScoreBoard, setShowScoreBoard] = useState(false);
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
    // Remove the early return that was preventing game over logic
    const hitScores: Record<string, number> = scoringSystem.current
      .getStats()
      .creatorBubblesPopped.reduce((acc, creatorBubblePoppedStats) => {
        acc[creatorBubblePoppedStats.creatorPfp] =
          creatorBubblePoppedStats.points;
        return acc;
      }, {} as Record<string, number>);
    setTimer(null);
    useGameStore.getState().setGameOn(false);
    useGameStore.getState().setGameOver(true);
    
    // Add a 1-second delay before showing the ScoreBoard
    setTimeout(() => {
      setShowScoreBoard(true);
    }, 200);

    const result = await updateUserGameHistory({
      hitScores,
      userAddress: address as string,
      normalPoints: scoringSystem.current.getStats().totalPoints,
    });
    console.log(result);
  }, [address]);

  useEffect(() => {
    if (timer !== null && timer <= 0) {
      useGameStore.getState().setGameOn(false);
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

  const resetGame = useCallback(async () => {
    try {
      // Reset scoring system
      scoringSystem.current = new ScoringSystem();
      
      setGameState("playing");
      setScore(0);
      setTimer(GAME_DURATION);
      setShootingBubble(null);
      await handleInitializeBubbles();
      useGameStore.getState().setGameOver(false);
      useGameStore.getState().setGameOn(true);
      console.log("Game reset successfully");
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  }, [handleInitializeBubbles]);

  const handleBubblesPopped = useCallback((poppedBubbles: Bubble[]) => {
    const points = scoringSystem.current.addPoints(poppedBubbles);
    setScore((prev) => prev + points);
  }, []);

  // ScoreBoard handlers
  const handleScoreBoardClose = () => {
    useGameStore.getState().setGameOver(false);
    useGameStore.getState().setGameOn(true);
    setShowScoreBoard(false);
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
    setShowScoreBoard(false);
    await resetGame();
  };

  return (
    <div className="gameWrapperDiv w-full h-screen overflow-hidden flex flex-col">
      {/* Mobile-responsive score display */}
      <div className="userScore fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm p-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <span className="score-label text-white font-semibold">Points:</span>
            <span className="score-value text-white font-bold text-lg">{score}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="timer-label text-white font-semibold">Timer</span>
            <span className="timer-value text-white font-bold text-lg">
              {timer !== null ? formatTime(timer) : "00:00"}
            </span>
          </div>
        </div>
      </div>
      {useGameStore.getState().isGameOn && (
        <div className="gameCanvasContainer w-full flex-1 pt-20">
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

      {useGameStore.getState().isGameOver && showScoreBoard && (
        <div className="absolute inset-0 z-50">
        <ScoreBoard
          onClose={handleScoreBoardClose}
          onHome={handleScoreBoardHome}
          onShare={handleScoreBoardShare}
          onReplay={handleScoreBoardReplay}
          scoringSystem={scoringSystem.current}
        />
        </div>
      )}
    </div>
  );
}
