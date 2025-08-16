import { PlayScene } from "@/lib/bubbleType";

export function onBubbleMiss(scene: PlayScene) {
  scene.lives--;
  scene.cooldown(scene);
  scene.updateLives(scene);
  if (scene.lives <= 0) {
    scene.endGame(scene, scene.onGameOver);
  }
}