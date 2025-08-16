import { PlayScene } from "@/lib/bubbleType";

export function endGame(scene: PlayScene, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
  scene.isShooting = false;
  scene.time.delayedCall(300, () => {
    onGameOver({ score: Math.round(scene.score), lives: Math.max(scene.lives, 0), pops: scene.pops });
  });
}