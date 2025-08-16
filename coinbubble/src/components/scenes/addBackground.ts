import { PlayScene } from "@/lib/bubbleType";

export function addBackground(scene: PlayScene) {
  // Create underwater gradient background
  const bg = scene.add.image(0, 0, 'underwater_bg')
    .setOrigin(0, 0) // Top-left origin
    .setDisplaySize(scene.scale.width, scene.scale.height)
  
  // Add seabed effect at the bottom
  const seabed = scene.add.graphics();
  seabed.fillStyle(0x4a90e2, 0.6);
  seabed.fillRect(0, scene.scale.height - 20, scene.scale.width, 20);
}