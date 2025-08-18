import { Bubble } from "~/lib/bubbleType";
import { BUBBLE_RADIUS } from "~/lib/constants";

interface BubbleRendererProps {
  bubble: Bubble;
  ctx: CanvasRenderingContext2D;
}

// export const renderBubble = ({ bubble, ctx }: BubbleRendererProps) => {
//   // Main bubble
//   ctx.beginPath();
//   ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
//   ctx.fillStyle = bubble.color;
//   ctx.fill();
  
//   // Border
//   ctx.strokeStyle = "#FFFFFF";
//   ctx.lineWidth = 2;
//   ctx.stroke();

//   ctx.shadowColor = bubble.color;
//   ctx.shadowBlur = 15;
//   ctx.beginPath();
//   ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS - 5, 0, Math.PI * 2);
//   ctx.fillStyle = bubble.color + "60";
//   ctx.fill();
//   ctx.shadowBlur = 0;

//   // Highlight effect
//   ctx.beginPath();
//   ctx.arc(bubble.x - 5, bubble.y - 5, BUBBLE_RADIUS / 3, 0, Math.PI * 2);
//   ctx.fillStyle = "#FFFFFF";
//   ctx.globalAlpha = 0.3;
//   ctx.fill();
//   ctx.globalAlpha = 1;
// };



export const renderBubble = ({ bubble, ctx }: BubbleRendererProps) => {
  // Assuming 'bubble' now includes an additional 'image' property that is a pre-loaded HTMLImageElement
  // (e.g., loaded via const img = new Image(); img.src = 'path/to/image.png'; img.onload = ...; and assigned to bubble.image).
  // If the image isn't pre-loaded, it may not render correctly in real-time animations.
  // The image should ideally be square and designed to fit the bubble's theme/use case.

  const r = BUBBLE_RADIUS;

  // Clip the image to the circular path instead of solid color fill
  ctx.save();
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, r, 0, Math.PI * 2);
  ctx.clip();
  
  // Create and load image
  const img = new Image();
  img.src = bubble.color;
  
  // Only draw if image is loaded
  if (img.complete && img.naturalHeight !== 0) {
    ctx.drawImage(img, bubble.x - r, bubble.y - r, r * 2, r * 2);
  }
  
  ctx.restore();

  // Border (redraw path since clip consumes it)
  // ctxbeginPath();
  // ctx.arc(bubble.x, bubble.y, r, 0, Math.PI * 2);
  // ctx.strokeStyle = "#FFFFFF";
  // ctx.lineWidth = 2;
  // ctx.stroke();

  // // Inner glow (keeping original, assuming bubble.color still applies for tint/glow consistency)
  // ctx.shadowColor = bubble.color;
  // ctx.shadowBlur = 15;
  // ctx.beginPath();
  // ctx.arc(bubble.x, bubble.y, r - 5, 0, Math.PI * 2);
  // ctx.fillStyle = bubble.color + "60";
  // ctx.fill();
  // ctx.shadowBlur = 0;

  // // Highlight effect
  // ctx.beginPath();
  // ctx.arc(bubble.x - 5, bubble.y - 5, r / 3, 0, Math.PI * 2);
  // ctx.fillStyle = "#FFFFFF";
  // ctx.globalAlpha = 0.3;
  // ctx.fill();
  // ctx.globalAlpha = 1;
};