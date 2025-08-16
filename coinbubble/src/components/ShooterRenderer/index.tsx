import { ShootingBubble } from "../../lib/bubbleType";
import { BUBBLE_RADIUS } from "../../lib/constants";

const cannonImg = new Image();
cannonImg.src = "/assets/game_assest/cannon.png";
let cannonLoaded = false;
cannonImg.onload = () => {
  cannonLoaded = true;
};

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
  const shooterY = height + 40;

  if (cannonLoaded) {
    const cannonWidth = 100;  // Adjust to your image size
    const cannonHeight = 200; // Adjust to your image size

    ctx.save();
    ctx.translate(shooterX, shooterY); 
    ctx.rotate(aimAngle + Math.PI / 2); 
    ctx.drawImage(
      cannonImg,
      -cannonWidth /2,   
      -cannonHeight,      
      cannonWidth,
      cannonHeight
    );
    ctx.restore();
  }

  const bubbleDistance =50; // negative because we measure downward from base
  const bubbleX = shooterX + Math.cos(aimAngle) * bubbleDistance;
  const bubbleY = shooterY + Math.sin(aimAngle) * bubbleDistance;
  // Draw the bubble in the mouth of the cannon
  ctx.beginPath();
  ctx.arc(bubbleX,bubbleY, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = nextBubbleColor;
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Aiming line
  if (!shootingBubble && gameState === "playing") {
    ctx.strokeStyle = "#0052FF";
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
