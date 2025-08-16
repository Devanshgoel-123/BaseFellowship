import { PlayScene } from "@/lib/bubbleType";

export function cooldown(scene: PlayScene) {
  scene.isShooting = false;
  scene.crosshair.setAlpha(0.4);
  scene.time.delayedCall(500, () => { scene.isShooting = true; scene.crosshair.setAlpha(0.9); });
}