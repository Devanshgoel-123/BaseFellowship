import { ShootingBubble } from "../../lib/bubbleType";
import { BUBBLE_RADIUS } from "../../lib/constants";

interface ShooterRendererProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  nextBubbleColor: string;
  aimAngle: number;
  shootingBubble: ShootingBubble | null;
  gameState: string;
}

export const renderShooter = ({
  ctx,
  width,
  height,
  nextBubbleColor,
  aimAngle,
  shootingBubble,
  gameState,
}: ShooterRendererProps) => {
  const shooterX = width / 2;
  const shooterY = height - 50;

  // Shooter base
  ctx.beginPath();
  ctx.arc(shooterX, shooterY, BUBBLE_RADIUS + 5, 0, Math.PI * 2);
  ctx.fillStyle = "#1E1E2E";
  ctx.fill();
  ctx.strokeStyle = "#0052FF"; // BALL_BASE_BLUE
  ctx.lineWidth = 3;
  ctx.stroke();

  // Next bubble
  ctx.beginPath();
  ctx.arc(shooterX, shooterY, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = nextBubbleColor;
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Aiming line (only when not shooting and game is playing)
  if (!shootingBubble && gameState === "playing") {
    ctx.strokeStyle = "#0052FF"; // BALL_BASE_BLUE
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(shooterX, shooterY);
    ctx.lineTo(
      shooterX + Math.cos(aimAngle) * 100,
      shooterY + Math.sin(aimAngle) * 100
    );
    ctx.stroke();
    ctx.setLineDash([]);
  }
};
