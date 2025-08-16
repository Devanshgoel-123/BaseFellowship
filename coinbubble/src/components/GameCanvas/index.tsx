/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Bubble, ShootingBubble, GameState } from "../../lib/bubbleType";
import { BUBBLE_RADIUS, SHOOT_SPEED } from "../../lib/constants";
import {
  getRandomColor,
  checkDeathLine,
  calculateAimAngle,
  createShootingBubble,
  addNewRowAtTop,
} from "../../lib/functions";
import { renderBubble } from "../BubbleRenderer";
import {
  renderBackground,
  renderGrid,
  renderDeathLine,
} from "../CanvasRenderer";
import { renderShooter } from "../ShooterRenderer";
import { renderHitAnimation } from "../HitAnimationRenderer";
import { checkCollision, handleBubblePlacement } from "../GameLogic";
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
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const aimAngleRef = useRef<number>(-Math.PI / 2);
  const bubblesRef = useRef<Bubble[]>([]);
  const shootingBubbleRef = useRef<ShootingBubble | null>(null);
  const gameStateRef = useRef<GameState>("playing");

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
    return {
      width: isMobile
        ? Math.min(window.innerWidth - 20, 360)
        : window.innerWidth < 1024
        ? 400
        : 500,
      height: isMobile
        ? Math.min(window.innerHeight - 200, 700)
        : window.innerWidth < 1024
        ? 600
        : 700,
    };
  }, []);

  const handleAddNewRow = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentBubbles = bubblesRef.current;
    const newBubbles = addNewRowAtTop(currentBubbles, canvas.width);
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

  useEffect(() => {
    if (gameState === "playing" && handleCheckDeathLine()) {
      onGameOver();
    }
  }, [bubbles, gameState, handleCheckDeathLine, onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dimensions = getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      const currentBubbles = bubblesRef.current;
      const currentShootingBubble = shootingBubbleRef.current;
      const currentGameState = gameStateRef.current;

      // Render background and grid
      renderBackground({ ctx, width: canvas.width, height: canvas.height });
      renderGrid({ ctx, width: canvas.width, height: canvas.height });
      renderDeathLine({ ctx, width: canvas.width, height: canvas.height });

      // Render all bubbles
      currentBubbles.forEach((bubble) => {
        renderBubble({ bubble, ctx });
      });

      // Render shooter and aiming line
      renderShooter({
        ctx,
        width: canvas.width,
        height: canvas.height,
        nextBubbleColor,
        aimAngle: aimAngleRef.current,
        shootingBubble: currentShootingBubble,
        gameState: currentGameState,
      });

      // Render hit animation
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

        // Check for collision with bubbles or ceiling
        const { collision, collisionBubble, newX, newY, shouldBounce } =
          checkCollision({
            shootingBubble: newShootingBubble,
            bubbles: currentBubbles,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
          });

        if (shouldBounce) {
          // Bounce off walls
          setShootingBubble(newShootingBubble);
        } else if (collision) {
          const { updatedBubbles, connectedBubbles, shouldAddNewRow } =
            handleBubblePlacement(
              newShootingBubble,
              currentBubbles,
              newX,
              newY
            );

          if (connectedBubbles.length >= 3) {
            // Bubbles were popped
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
        } else {
          // Continue moving the shooting bubble
          setShootingBubble(newShootingBubble);

          // Render the moving bubble
          renderBubble({
            bubble: { ...newShootingBubble, row: 0, col: 0 },
            ctx,
          });
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

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleAiming, shootBubble]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{ touchAction: "none", borderRadius: "12px" }}
      />
    </div>
  );
}
