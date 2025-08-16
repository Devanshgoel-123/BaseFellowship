import { PlayScene } from "@/lib/bubbleType";

export function updateScore(scene: PlayScene) {
  scene.scoreText.setText(Math.round(scene.score).toString());
}