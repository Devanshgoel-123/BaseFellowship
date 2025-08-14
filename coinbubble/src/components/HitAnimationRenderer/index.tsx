interface HitAnimationRendererProps {
  ctx: CanvasRenderingContext2D;
  hitPopup: {
    show: boolean;
    count: number;
    x: number;
    y: number;
    opacity: number;
  };
}

export const renderHitAnimation = ({
  ctx,
  hitPopup,
}: HitAnimationRendererProps) => {
  if (!hitPopup.show) return;

  ctx.save();
  ctx.globalAlpha = hitPopup.opacity;

  // Explosion gradient
  const gradient = ctx.createRadialGradient(
    hitPopup.x,
    hitPopup.y,
    0,
    hitPopup.x,
    hitPopup.y,
    70
  );
  gradient.addColorStop(0, "#FF6B35");
  gradient.addColorStop(0.3, "#F7931E");
  gradient.addColorStop(0.6, "#FFD700");
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(hitPopup.x, hitPopup.y, 70, 0, Math.PI * 2);
  ctx.fill();

  // Score text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 28px Poppins";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.strokeText(`+${hitPopup.count}`, hitPopup.x, hitPopup.y);
  ctx.fillText(`+${hitPopup.count}`, hitPopup.x, hitPopup.y);

  ctx.restore();
};
