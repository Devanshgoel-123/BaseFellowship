'use client';

import dynamicImport from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, ComponentType, useRef } from 'react';
import Link from 'next/link';
import { Bubble, ShootingBubble, GameState } from "@/lib/bubbleType";
import { getRandomColor } from "@/lib/utils";
import { initializeBubbles } from "@/lib/functions";
import { ScoringSystem } from '@/lib/functions';
import { formatTime } from '@/lib/functions';
import './styles.scss';
import { updateUserGameHistory } from '@/Services/user';
import { useAccount } from 'wagmi';

const GameCanvas = dynamicImport(
  () => import('@/components/GameCanvas').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading game...</div>
      </div>
    )
  }
) as ComponentType<any>;

interface GameOverParams {
  score: number;
  lives: number;
  pops: number;
}

// Disable SSR for this page to avoid Next.js auth issues
export const dynamic = 'force-dynamic';

export default function GamePage() {
  const { address } = useAccount()
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shootingBubble, setShootingBubble] = useState<ShootingBubble | null>(
    null
  );
  const [nextBubbleColor, setNextBubbleColor] = useState<string>(
    getRandomColor()
  );
  const [timer, setTimer] = useState<number | null>(10);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const scoringSystem = useRef(new ScoringSystem());

  const handleInitializeBubbles = useCallback(() => {
    const newBubbles = initializeBubbles();
    setBubbles(newBubbles);
    setNextBubbleColor(getRandomColor());
  }, []);

  useEffect(() => {
    if (timer !== null && timer <= 0) {
      handleGameOver();
    }
  }, [timer]);


  useEffect(() => {
    handleInitializeBubbles();
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev !== null ? prev - 1 : null);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [handleInitializeBubbles]);

  const resetGame = useCallback(() => {
    setScore(0);
    setTimer(10);
    setGameState("playing");
    setShootingBubble(null);
    setShowGameOver(false);
    handleInitializeBubbles();
  }, [handleInitializeBubbles]);

  const handleGameOver = useCallback(async () => {
    setGameState("lost");
    const hitScores: Record<string, number> =
      scoringSystem.current.getStats().creatorBubblesPopped.reduce(
        (acc, creatorBubblePoppedStats) => {
          acc[creatorBubblePoppedStats.creatorPfp] = creatorBubblePoppedStats.points;
          return acc;
        },
        {} as Record<string, number>
      );
    setTimer(null);
    setShowGameOver(true);
    const result = await updateUserGameHistory({
      hitScores,
      userAddress: address as string,
      normalPoints: scoringSystem.current.getStats().totalPoints
    })
    console.log(result)
  }, []);

  const handleBubblesPopped = useCallback((poppedBubbles: Bubble[]) => {
    const points = scoringSystem.current.addPoints(poppedBubbles);
    setScore((prev) => prev + points);
  }, []);

  return (
    <div className="gameWrapperDiv">
      <div className="userScore">
        <div>
          <span className="score-label">Points:</span>
          <span className="score-value">{score}</span>
        </div>
        <div>
          <span className="timer-label">Timer</span>
          <span className="timer-value">{timer !== null ? formatTime(timer) : "00:00"}</span>
        </div>
      </div>
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

      {showGameOver && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#35A5F7] to-[#152E92] rounded-3xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
              <p className="text-white/80 mb-6">Your score : {scoringSystem.current.getStats().totalPoints}</p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full py-3 bg-white/90 hover:bg-white text-[#152E92] font-bold rounded-xl transition-colors"
                >
                  Play Again
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 bg-transparent hover:bg-white/10 text-white font-bold border border-white/30 rounded-xl transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
