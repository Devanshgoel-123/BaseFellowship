interface CanvasRendererProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export const renderBackground = ({ ctx, width, height }: CanvasRendererProps) => {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1A1A2E");
  gradient.addColorStop(0.5, "#16213E");
  gradient.addColorStop(1, "#0F3460");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

export const renderGrid = ({ ctx, width, height }: CanvasRendererProps) => {
  ctx.strokeStyle = "#1E1E2E";
  ctx.lineWidth = 1;
  const gridSize = width < 400 ? 25 : 30;
  
  for (let i = 0; i < width; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  
  for (let i = 0; i < height; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
};

export const renderDeathLine = ({ ctx, width, height }: CanvasRendererProps) => {
  const deathLineY = height - 60;
  
  // Death line
  ctx.strokeStyle = "#EF4444"; // BALL_RED
  ctx.lineWidth = 3;
  ctx.setLineDash([15, 10]);
  ctx.beginPath();
  ctx.moveTo(0, deathLineY);
  ctx.lineTo(width, deathLineY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Death line label
  ctx.fillStyle = "#EF4444"; // BALL_RED
  ctx.font = "bold 12px Poppins";
  ctx.textAlign = "center";
  ctx.fillText("DANGER LINE", width / 2, deathLineY - 5);
};
