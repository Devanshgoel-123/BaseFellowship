import { PlayScene } from "@/lib/bubbleType";

export function onBubblePop(scene: PlayScene, bubble: Phaser.GameObjects.GameObject) {
  const b = bubble as any;
  scene.popBubble(scene, b, 10); // Fixed increment for abilities
  scene.score += 10;
  scene.pops++;
  scene.updateScore(scene);
  
  // Check for game over if no bubbles left
  if (scene.bubbles.getLength() <= 0) {
    scene.endGame(scene, scene.onGameOver);
  }
}