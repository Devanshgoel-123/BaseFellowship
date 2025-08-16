import { PlayScene } from "@/lib/bubbleType";

export function createGameElements(scene: PlayScene) {
  // Position cannon at bottom center, extending below screen
  scene.cannon = scene.add.image(scene.scale.width / 2, scene.scale.height + 10, 'cannon').setOrigin(0.5, 1).setScale(0.6);
  
  // Position crosshair in the middle-upper area with trajectory line
  scene.crosshair = scene.add.image(scene.scale.width / 2, scene.scale.height * 0.4, 'aim').setAlpha(0.9).setScale(0.4);
  
  // Add trajectory line (dotted line from crosshair to cannon)
  const trajectory = scene.add.graphics();
  trajectory.lineStyle(2, 0xFFFFFF, 0.6);
  
  // Create dotted line effect manually
  const startX = scene.crosshair.x;
  const startY = scene.crosshair.y;
  const endX = scene.cannon.x;
  const endY = scene.cannon.y - 80;
  const dashLength = 5;
  const gapLength = 4;
  
  let currentX = startX;
  let currentY = startY;
  const totalDistance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const directionX = (endX - startX) / totalDistance;
  const directionY = (endY - startY) / totalDistance;
  
  while (Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2) < totalDistance) {
    const dashEndX = currentX + directionX * dashLength;
    const dashEndY = currentY + directionY * dashLength;
    
    trajectory.beginPath();
    trajectory.moveTo(currentX, currentY);
    trajectory.lineTo(dashEndX, dashEndY);
    trajectory.strokePath();
    
    currentX = dashEndX + directionX * gapLength;
    currentY = dashEndY + directionY * gapLength;
  }
}