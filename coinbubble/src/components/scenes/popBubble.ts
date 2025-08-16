import { PlayScene } from "@/lib/bubbleType";

export function popBubble(scene: PlayScene, b: any, increment: number) {
  scene.tweens.add({
    targets: b,
    scale: 1.3,
    duration: 80,
    yoyo: true,
    onComplete: () => b.destroy()
  });
  const txt = scene.add.text(b.x, b.y, `+${increment}`, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
  scene.tweens.add({ targets: txt, y: b.y - 30, alpha: 0, duration: 600, onComplete: () => txt.destroy() });
}