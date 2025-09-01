'use client';
import { useRef, useCallback, useEffect, useState } from "react";
import { Bubble, ShootingBubble, GameState } from "~/lib/bubbleType";
import { BUBBLE_RADIUS, SHOOT_SPEED } from "~/lib/constants";
import { addNewRowAtTop } from "~/lib/functions";
import { getRandomColor } from "~/lib/utils";
import { calculateAimAngle, createShootingBubble } from "~/lib/functions";
import { renderBackground, checkDeathLine, renderDeathLine } from "~/lib/functions";
import { renderBubble } from "~/components/BubbleRenderer";
import { renderShooter } from "./ShooterRenderer";
import { renderHitAnimation } from "./HitAnimationRenderer";
import { checkCollision } from "~/lib/functions";
import { ScoringSystem } from "~/lib/functions";
import { handleBubblePlacement } from "~/lib/functions";
import { findFloatingBubbles } from "~/lib/functions";
import { GoldenBubblePopup } from "./PopUpPfp";
import { useGameStore } from "~/store/gameStats";
import "./styles.scss";


interface GameCanvasProps {
  bubbles: Bubble[];
  setBubbles: (bubbles: Bubble[]) => void;
  shootingBubble: ShootingBubble | null;
  setShootingBubble: (bubble: ShootingBubble | null) => void;
  nextBubbleColor: string;
  setNextBubbleColor: (color: string) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onBubblesPopped: (poppedBubbles: Bubble[]) => void;
  onGameOver: () => void;
  scoringSystem: ScoringSystem;
}

export default function GameCanvas({
  bubbles,
  setBubbles,
  shootingBubble,
  setShootingBubble,
  nextBubbleColor,
  setNextBubbleColor,
  gameState,
  setGameState,
  onBubblesPopped,
  onGameOver,
  scoringSystem
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const aimAngleRef = useRef<number>(-Math.PI / 2);
  const bubblesRef = useRef<Bubble[]>([]);
  const shootingBubbleRef = useRef<ShootingBubble | null>(null);
  const gameStateRef = useRef<GameState>("playing");
  const [showCreatorPopup, setShowCreatorPopup] = useState(false);
  const [creatorBubble, setCreatorBubble] = useState<Bubble | null>(null);
  const [hitPopup, setHitPopup] = useState<{
    show: boolean;
    count: number;
    x: number;
    y: number;
    opacity: number;
  }>({ show: false, count: 0, x: 0, y: 0, opacity: 1 });

  const [pendingNewRow, setPendingNewRow] = useState(false);

  useEffect(() => {
    bubblesRef.current = bubbles;
  }, [bubbles]);

  useEffect(() => {
    shootingBubbleRef.current = shootingBubble;
  }, [shootingBubble]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const getCanvasDimensions = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    console.log("The height of the screen is ", window.innerHeight);
    
    // Mobile-first responsive dimensions
    if (isMobile) {
      const height = window.innerHeight * 0.9; // Slightly smaller for mobile UI
      console.log("Mobile canvas height:", height);
      return {
        width: window.innerWidth,
        height: height,
      };
    } else if (isTablet) {
      const height = Math.min(window.innerHeight * 0.95, 1024);
      console.log("Tablet canvas height:", height);
      return {
        width: Math.min(window.innerWidth, 768),
        height: height,
      };
    } else {
      // Desktop
      const height = window.innerHeight * 0.95;
      console.log("Desktop canvas height:", height);
      return {
        width: Math.min(window.innerWidth, 1200),
        height: height,
      };
    }
  }, []);


  const handleAddNewRow = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentBubbles = bubblesRef.current;
    console.log("Adding new row - Current bubbles:", currentBubbles.length);
    console.log("Bubble Y positions before:", currentBubbles.map(b => ({ y: b.y, row: b.row })).slice(0, 5));
    
    const newBubbles = addNewRowAtTop(currentBubbles, canvas.width);
    
    console.log("Bubble Y positions after:", newBubbles.map(b => ({ y: b.y, row: b.row })).slice(0, 5));
    console.log("New total bubbles:", newBubbles.length);
    
    setBubbles(newBubbles);
  }, [setBubbles]);

  const handleCheckDeathLine = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    return checkDeathLine(bubblesRef.current, canvas.height);
  }, []);

  const handleAiming = useCallback((clientX: number, clientY: number) => {
    if (
      !canvasRef.current ||
      shootingBubbleRef.current ||
      gameStateRef.current !== "playing"
    )
      return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const shooterX = canvas.width / 2;
    const shooterY = canvas.height - 50;

    const angle = calculateAimAngle(clientX, clientY, rect, shooterX, shooterY);
    aimAngleRef.current = angle;
  }, []);

  const shootBubble = useCallback(() => {
    if (shootingBubbleRef.current || gameStateRef.current !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const shooterX = canvas.width / 2;
    const shooterY = canvas.height - 50;

    const newShootingBubble = createShootingBubble(
      shooterX,
      shooterY,
      aimAngleRef.current,
      nextBubbleColor,
      SHOOT_SPEED
    );

    setShootingBubble(newShootingBubble);
    setNextBubbleColor(getRandomColor());
  }, [nextBubbleColor, setShootingBubble, setNextBubbleColor]);

  const showHitAnimation = useCallback(
    (count: number, x: number, y: number) => {
      setHitPopup({ show: true, count, x, y, opacity: 1 });

      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.03;
        setHitPopup((prev) => ({ ...prev, opacity, y: prev.y - 1 }));

        if (opacity <= 0) {
          clearInterval(fadeInterval);
          setHitPopup({ show: false, count: 0, x: 0, y: 0, opacity: 1 });
        }
      }, 80);
    },
    []
  );

  useEffect(() => {
    if (pendingNewRow) {
      const timer = setTimeout(() => {
        handleAddNewRow();
        setPendingNewRow(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pendingNewRow, handleAddNewRow]);

  // Remove the old useEffect death line check since we're now checking every frame

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dimensions = getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    console.log("Canvas dimensions set:", dimensions);
    console.log("Death line will be at Y:", dimensions.height - 60);

    const animate = () => {
      const currentBubbles = bubblesRef.current;
      const currentShootingBubble = shootingBubbleRef.current;
      const currentGameState = gameStateRef.current;

      renderBackground({ ctx, width: canvas.width, height: canvas.height });
      renderDeathLine({ ctx, width: canvas.width, height: canvas.height });

      // Check death line every frame
      const deathLineReached = checkDeathLine(currentBubbles, canvas.height);
      if (deathLineReached && currentGameState === "playing") {
        console.log("Game Over triggered - Death line reached");
        console.log("Canvas height:", canvas.height);
        console.log("Death line Y:", canvas.height - 60);
        console.log("Bubbles at death line:", currentBubbles.filter(bubble => (bubble.y + 25) >= (canvas.height - 60)));
        console.log("Current game state:", currentGameState);
        setGameState("gameOver");
        // Also update the global game store
        useGameStore.getState().setGameOn(false);
        useGameStore.getState().setGameOver(true);
        onGameOver();
        return; // Stop animation
      }

      // Render all bubbles
      currentBubbles.forEach((bubble) => {
        renderBubble({ bubble, ctx });
      });

        renderShooter({
          ctx,
          width: canvas.width,
          height: canvas.height,
          nextBubbleColor,
          aimAngle: aimAngleRef.current,
          shootingBubble: currentShootingBubble,
          gameState: currentGameState,
        });
      renderHitAnimation({ ctx, hitPopup });

      if (currentShootingBubble) {
        const newShootingBubble = { ...currentShootingBubble };
        newShootingBubble.x += newShootingBubble.dx;
        newShootingBubble.y += newShootingBubble.dy;

        // Check for wall collision and bounce
        if (
          newShootingBubble.x <= BUBBLE_RADIUS ||
          newShootingBubble.x >= canvas.width - BUBBLE_RADIUS
        ) {
          newShootingBubble.dx *= -1;
        }

        const { collision, newX, newY, shouldBounce, creatorHit, creatorBubble } = checkCollision({
          shootingBubble: newShootingBubble,
          bubbles: currentBubbles,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
        });
       

        if (shouldBounce) {
          setShootingBubble(newShootingBubble);
        } else if (collision) {
          if (creatorHit && creatorBubble !== null) {
            let updatedBubbles = currentBubbles.filter(bubble => 
              !(bubble.x === creatorBubble.x && bubble.y === creatorBubble.y)
            );
            const floatingBubbles = findFloatingBubbles(updatedBubbles);
            updatedBubbles = updatedBubbles.filter(bubble => 
              !floatingBubbles.some(floating => 
                floating.x === bubble.x && floating.y === bubble.y
              )
            )
            onBubblesPopped([creatorBubble]);
            setBubbles(updatedBubbles);
            setCreatorBubble(creatorBubble);
            setShowCreatorPopup(true);
            setTimeout(() => setShowCreatorPopup(false), 1200);
            if (updatedBubbles.length === 0) {
              setGameState("won");
            }
            setShootingBubble(null);
          } else {
          const { updatedBubbles, connectedBubbles} = handleBubblePlacement(
            newShootingBubble,
            currentBubbles,
            newX,
            newY
          );

          if (connectedBubbles.length >= 3) {
            setBubbles(updatedBubbles);
            onBubblesPopped(connectedBubbles);
            showHitAnimation(connectedBubbles.length, newX, newY);

            if (updatedBubbles.length === 0) {
              setGameState("won");
            }
          } else {
            // No bubbles popped, add new row
            setBubbles(updatedBubbles);
            setPendingNewRow(true);
          }

          setShootingBubble(null);
        }
        } else {
          setShootingBubble(newShootingBubble);
          renderBubble({ bubble: { ...newShootingBubble, row: 0, col: 0 }, ctx });
        }
      }

      if (currentGameState === "playing") {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    getCanvasDimensions,
    nextBubbleColor,
    hitPopup,
    setBubbles,
    onBubblesPopped,
    setGameState,
    setShootingBubble,
    showHitAnimation,
    onGameOver,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleAiming(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleAiming(touch.clientX, touch.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      shootBubble();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      shootBubble();
    };

    // Add touch start for better mobile responsiveness
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      // Optional: Add haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleAiming, shootBubble]);

  return (
    <>
    <div className="canvasContainer w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="gameCanvas w-full h-full touch-none select-none"
        style={{ touchAction: "none"}}
      />
      {showCreatorPopup && creatorBubble?.creator && (
      <GoldenBubblePopup pfpSrc={creatorBubble.creator.pfp} message={creatorBubble.creator.message}/>
    )}
    </div>
    
    </>
    
  );
}
