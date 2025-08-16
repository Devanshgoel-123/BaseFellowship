import { PlayScene } from "@/lib/bubbleType";

export function getIntersectingBubble(this: PlayScene, x: number, y: number, radius: number) {
  let hit: any = null;
  const children = this.bubbles.getChildren() as any[];
  for (const b of children) {
    const dx = b.x - x;
    const dy = b.y - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= radius) {
      hit = b;
      break;
    }
  }
  return hit;
}