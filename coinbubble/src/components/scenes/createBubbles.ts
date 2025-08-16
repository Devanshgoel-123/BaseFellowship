import { PlayScene } from '@/lib/bubbleType';


export function createBubbles(scene: PlayScene) {
  scene.bubbles = scene.physics.add.group({
    collideWorldBounds: false,
    allowGravity: false,
  });

  const uiBarHeight = 60;          
  const topMargin = uiBarHeight + 60; 
  const sideMargin = 24;        

  let bubbleSize = 80;             // big & pretty
  let spacingX = bubbleSize * 0.95;
  const spacingY = bubbleSize * 0.85;

  const rows = 5;
  const cols = 5;

  const availableWidth = scene.scale.width - sideMargin * 2;
  let totalWidth = (cols - 1) * spacingX + bubbleSize;
  if (totalWidth > availableWidth) {
    spacingX = Math.max(4, (availableWidth - bubbleSize) / (cols - 1)); 
    totalWidth = (cols - 1) * spacingX + bubbleSize;
  }

  const startX = sideMargin + (availableWidth - totalWidth) / 2;
  const startY = topMargin;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOffset = row % 2 === 0 ? 0 : spacingX / 2;
      const x = startX + col * spacingX + xOffset;
      const y = startY + row * spacingY;

      const bubbleType = `b${(row + col) % 4 + 1}`;
      const bubble = scene.bubbles.create(x, y, bubbleType) as Phaser.Physics.Arcade.Image & { meta?: any };

      bubble.displayWidth = bubbleSize;
      bubble.displayHeight = bubbleSize;
      bubble.setOrigin(0.5);
      bubble.setCircle(bubbleSize / 2);
      bubble.setImmovable(true);

      bubble.meta = {
        creatorName: ['alpha', 'bravo', 'charlie', 'delta'][(row + col) % 4],
        scoreValue: Phaser.Math.RND.pick([10, 20]),
      };
    }
  }
}
