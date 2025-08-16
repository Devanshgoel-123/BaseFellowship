import { PlayScene } from "@/lib/bubbleType";

export function updateLives(scene: PlayScene) {
  scene.livesText.setText(Math.max(Math.round(scene.lives), 0).toString());
  
  scene.cameras.main.flash(200, 255, 0, 0);
}