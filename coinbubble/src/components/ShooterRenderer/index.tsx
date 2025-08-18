import { ShootingBubble } from "../../lib/bubbleType";
import { BUBBLE_RADIUS } from "../../lib/constants";

const cannonImg = new Image();
cannonImg.src = "/assets/game_assest/cannon.png";
let cannonLoaded = false;
cannonImg.onload = () => {
  cannonLoaded = true;
};

const bubbleImgCache: Record<string, HTMLImageElement> = {};
function getBubbleImg(src: string): HTMLImageElement {
  if (!bubbleImgCache[src]) {
    const img = new Image();
    img.src = src;
    bubbleImgCache[src] = img;
  }
  return bubbleImgCache[src];
}

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

  if (nextBubbleColor === null) return;
  const shooterX = width / 2;
  const shooterY = height + 40;
 console.log("The next bubble color is", nextBubbleColor)
 if (cannonLoaded) {
  const cannonWidth = 100;
  const cannonHeight = 200;

  ctx.save();
  ctx.translate(shooterX, shooterY);
  ctx.rotate(aimAngle + Math.PI / 2);
  ctx.drawImage(
    cannonImg,
    -cannonWidth / 2,
    -cannonHeight,
    cannonWidth,
    cannonHeight
  );
  ctx.restore();
}

const bubbleDistance = 50;
const bubbleX = shooterX + Math.cos(aimAngle) * bubbleDistance;
const bubbleY = shooterY + Math.sin(aimAngle) * bubbleDistance;

// Load and render bubble image
const bubbleImg = getBubbleImg(nextBubbleColor);
if (bubbleImg.complete && bubbleImg.naturalWidth > 0) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(bubbleX, bubbleY, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    bubbleImg,
    bubbleX - BUBBLE_RADIUS,
    bubbleY - BUBBLE_RADIUS,
    BUBBLE_RADIUS * 2,
    BUBBLE_RADIUS * 2
  );
  ctx.restore();
  ctx.beginPath();
  ctx.arc(bubbleX, bubbleY, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();
}
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
