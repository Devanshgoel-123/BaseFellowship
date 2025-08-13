"use client";

import { useEffect, useRef, useCallback } from "react";
import type {
  Bubble,
  ShootingBubble,
  GameState,
} from "../../utils/types/bubbleType";
import { COLORS, BUBBLE_RADIUS } from "@/utils/constants/constant";

interface GameCanvasProps {
  bubbles: Bubble[];
  setBubbles: (bubbles: Bubble[]) => void;
  shootingBubble: ShootingBubble | null;
  setShootingBubble: (bubble: ShootingBubble | null) => void;
  nextBubbleColor: string;
  setNextBubbleColor: (color: string) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setScore: (score: (prev: number) => number) => void;
  findConnectedBubbles: (bubbles: Bubble[], startBubble: Bubble) => Bubble[];
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
  setScore,
  findConnectedBubbles,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const aimAngleRef = useRef<number>(-Math.PI / 2); // Start aiming upward

  const getCanvasDimensions = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? 320 : window.innerWidth < 1024 ? 600 : 800,
      height: isMobile ? 480 : window.innerWidth < 1024 ? 450 : 600,
    };
  }, []);

  const handleAiming = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current || shootingBubble || gameState !== "playing")
        return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const shooterX = canvas.width / 2;
      const shooterY = canvas.height - 50;

      const angle = Math.atan2(y - shooterY, x - shooterX);
      // Limit angle to prevent shooting backwards (only upward shots)
      if (angle > -Math.PI * 0.9 && angle < -Math.PI * 0.1) {
        aimAngleRef.current = angle;
      }
    },
    [shootingBubble, gameState]
  );

  const shootBubble = useCallback(() => {
    if (shootingBubble || gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const shooterX = canvas.width / 2;
    const shooterY = canvas.height - 50;
    const speed = 8;

    setShootingBubble({
      x: shooterX,
      y: shooterY,
      dx: Math.cos(aimAngleRef.current) * speed,
      dy: Math.sin(aimAngleRef.current) * speed,
      color: nextBubbleColor,
    });

    // Generate new random color for next bubble
    setNextBubbleColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, [
    shootingBubble,
    gameState,
    nextBubbleColor,
    setShootingBubble,
    setNextBubbleColor,
  ]);

  // Game animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set responsive canvas size
    const dimensions = getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      // Clear canvas with Base chain dark theme
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid pattern
      ctx.strokeStyle = "#1E1E1E";
      ctx.lineWidth = 1;
      const gridSize = canvas.width < 400 ? 30 : 40;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw bubbles with glow effects
      bubbles.forEach((bubble) => {
        // Main bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = bubble.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS - 5, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color + "60";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw shooter and aim line
      const shooterX = canvas.width / 2;
      const shooterY = canvas.height - 50;

      // Aim line
      if (!shootingBubble && gameState === "playing") {
        ctx.strokeStyle = "#0052FF";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(shooterX, shooterY);
        ctx.lineTo(
          shooterX + Math.cos(aimAngleRef.current) * 100,
          shooterY + Math.sin(aimAngleRef.current) * 100
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Shooter base
      ctx.beginPath();
      ctx.arc(shooterX, shooterY, BUBBLE_RADIUS + 5, 0, Math.PI * 2);
      ctx.fillStyle = "#1E1E1E";
      ctx.fill();
      ctx.strokeStyle = "#0052FF";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Next bubble in shooter
      ctx.beginPath();
      ctx.arc(shooterX, shooterY, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = nextBubbleColor;
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update shooting bubble physics
      if (shootingBubble) {
        const newShootingBubble = { ...shootingBubble };
        newShootingBubble.x += newShootingBubble.dx;
        newShootingBubble.y += newShootingBubble.dy;

        // Wall collision
        if (
          newShootingBubble.x <= BUBBLE_RADIUS ||
          newShootingBubble.x >= canvas.width - BUBBLE_RADIUS
        ) {
          newShootingBubble.dx *= -1;
        }

        // Check collision with existing bubbles
        let collision = false;
        let collisionBubble: Bubble | null = null;

        for (const bubble of bubbles) {
          const distance = Math.sqrt(
            Math.pow(newShootingBubble.x - bubble.x, 2) +
              Math.pow(newShootingBubble.y - bubble.y, 2)
          );

          if (distance <= BUBBLE_RADIUS * 2) {
            collision = true;
            collisionBubble = bubble;
            break;
          }
        }

        // Check if reached top
        if (newShootingBubble.y <= BUBBLE_RADIUS) {
          collision = true;
        }

        if (collision) {
          // Position new bubble
          let newX = newShootingBubble.x;
          let newY = newShootingBubble.y;

          if (collisionBubble) {
            const angle = Math.atan2(
              newShootingBubble.y - collisionBubble.y,
              newShootingBubble.x - collisionBubble.x
            );
            newX = collisionBubble.x + Math.cos(angle) * (BUBBLE_RADIUS * 2);
            newY = collisionBubble.y + Math.sin(angle) * (BUBBLE_RADIUS * 2);
          }

          const newBubble: Bubble = {
            x: newX,
            y: newY,
            color: newShootingBubble.color,
            row: Math.floor(newY / (BUBBLE_RADIUS * 1.7)),
            col: Math.floor(newX / (BUBBLE_RADIUS * 2)),
          };

          const updatedBubbles = [...bubbles, newBubble];

          // Only check for matches of same color
          const connectedBubbles = findConnectedBubbles(
            updatedBubbles,
            newBubble
          );

          if (connectedBubbles.length >= 3) {
            const remainingBubbles = updatedBubbles.filter(
              (bubble) =>
                !connectedBubbles.some(
                  (connected) =>
                    connected.x === bubble.x && connected.y === bubble.y
                )
            );
            setBubbles(remainingBubbles);
            setScore((prev) => prev + connectedBubbles.length * 10);

            // Check win condition
            if (remainingBubbles.length === 0) {
              setGameState("won");
            }
          } else {
            setBubbles(updatedBubbles);
          }

          setShootingBubble(null);
        } else {
          setShootingBubble(newShootingBubble);

          // Draw shooting bubble
          ctx.beginPath();
          ctx.arc(
            newShootingBubble.x,
            newShootingBubble.y,
            BUBBLE_RADIUS,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = newShootingBubble.color;
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      if (gameState === "playing") {
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
    bubbles,
    shootingBubble,
    nextBubbleColor,
    gameState,
    findConnectedBubbles,
    setBubbles,
    setScore,
    setGameState,
    setShootingBubble,
    getCanvasDimensions,
  ]);

  // Event listeners for mobile and desktop
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
    <div className="relative mb-4">
      <canvas
        ref={canvasRef}
        className="border-2 border-blue-500 rounded-lg bg-gray-900 w-full md:border-2 max-w-full h-auto cursor-crosshair active:border-blue-400"
        style={{ touchAction: "none", borderRadius: "12px" }}
      />
    </div>
  );
}
