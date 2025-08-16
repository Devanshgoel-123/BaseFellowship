import { Bubble } from "@/lib/bubbleType";
import {BUBBLE_RADIUS } from "@/lib/constants";

interface BubbleRendererProps {
  bubble: Bubble;
  ctx: CanvasRenderingContext2D;
}

export const renderBubble = ({ bubble, ctx }: BubbleRendererProps) => {
  // Main bubble
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = bubble.color;
  ctx.fill();
  
  // Border
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner glow effect
  ctx.shadowColor = bubble.color;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS - 5, 0, Math.PI * 2);
  ctx.fillStyle = bubble.color + "60";
  ctx.fill();
  ctx.shadowBlur = 0;

  // Highlight effect
  ctx.beginPath();
  ctx.arc(bubble.x - 5, bubble.y - 5, BUBBLE_RADIUS / 3, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1;
};


